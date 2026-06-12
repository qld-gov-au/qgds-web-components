import { html, LitElement, unsafeCSS, nothing, TemplateResult, PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state, query } from "lit/decorators.js";
import { baseStyles, formStyles, utilitiesStyles } from "../../../styles";
import componentStyles from "./qgds-file-upload.styles.scss?inline";
import { QgdsEvents, readableFileSize, getFileType, mimeToExtension, BreakpointController } from "../../../utils";
import { QGDSFormField } from "../qgds-form-field";

import "../../qgds-button/qgds-button";
import "../../qgds-feature-icon/qgds-feature-icon";
import "../../qgds-loading-spinner/qgds-loading-spinner";
import { IconName } from "../../qgds-icon/icon-names";
import { ifDefined } from "lit/directives/if-defined.js";
import qgdsBreakpoint from "../../../styles/qgds-tokens/qgds-breakpoint";

export const tagname = "qgds-file-upload";
type Status = "loading" | "ready" | "error" | "success";
interface FileMeta {
  index: number;
  status: Status;
  message?: string;
}

/**
 * @tagname qgds-file-upload
 */

@customElement(tagname)
export class QGDSFileUpload extends QGDSFormField {
  static override styles = [...super.styles, unsafeCSS(componentStyles)];

  @property({ type: Number, attribute: "max-files" })
  get maxFiles() {
    return this._maxFiles;
  }
  set maxFiles(newVal) {
    if (typeof newVal !== "number") {
      return;
    }
    const oldVal = this._maxFiles;
    if (newVal === 0) this._maxFiles = 1;
    else if (newVal < 0) {
      this._maxFiles = Infinity;
    } else {
      this._maxFiles = newVal;
    }

    this.requestUpdate("maxFiles", oldVal);
  }
  @property({ type: Number, attribute: "min-files" }) minFiles?: number;
  @property({ type: Number, attribute: "max-size", useDefault: true }) maxSize?: number = 100; // Default 100MB???
  @property({ type: Boolean }) multiple: boolean = false;
  @property({ type: String }) accept: string = "";
  @property({ attribute: false }) get files(): FileList | null {
    return this._input?.files ?? null;
  }

  @state() private _filesMeta: FileMeta[] = [];
  @state() private _isDragover: boolean = false;

  @query("input[type=file]", true) private _input!: HTMLInputElement;
  @query(".file-upload-dropzone") private _dropzone!: HTMLDivElement | null;

  private _maxFiles: number = 1;

  private _breakpoint = new BreakpointController(this);
  private get _isMobile() {
    return qgdsBreakpoint[this._breakpoint.current] < qgdsBreakpoint.LG;
  }

  private get _fileLimitReached() {
    return (this.files?.length ?? 0) >= this.maxFiles;
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback?.();
  }

  protected update(_changedProperties: PropertyValues) {
    super.update?.(_changedProperties);
    // console.log("Update!");
  }

  private _preventDefaults = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  private _handleDragEnter = (e: DragEvent) => {
    this._preventDefaults(e);
    if (this.disabled) return;
    this._isDragover = true;
  };

  private _handleDragLeave = (e: DragEvent) => {
    this._preventDefaults(e);
    if (e.target === this._dropzone) {
      this._isDragover = false;
    }
  };

  private _handleDrop = (e: DragEvent) => {
    this._preventDefaults(e);
    this._isDragover = false;

    // If the drag event includes files
    if (e.dataTransfer?.files) {
      const files = e.dataTransfer.files; // Returns a FileList object
      this._updateInputFileList(files);
    }
  };

  private _selectFiles = () => {
    this._input.click();
  };

  private _handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    // Once files are selected, run some basic validation against given constraints.
    // Any errors should be passed through to the FileStatus element for display
    // The component should also fire an invalid event and ensure it prevents submission.

    this._filesMeta = input.files
      ? Array.from(input.files).map((file, index) => {
          const validationMessage = this._validateFile(file);
          return {
            index,
            status: validationMessage ? "error" : "ready",
            message: validationMessage,
          };
        })
      : [];
  };

  private _validateFile(file: File): string | undefined {
    const acceptValue = (this.accept || "").trim();

    if (acceptValue && acceptValue !== "*") {
      const fileType = (file.type || "").toLowerCase();
      const fileName = file.name || "";
      const fileExt = fileName.includes(".") ? (fileName.split(".").pop()?.toLowerCase() ?? "") : "";
      const accepted = acceptValue
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
        .some((token) => {
          if (token.startsWith(".")) {
            return fileExt === token.slice(1);
          }

          if (token.endsWith("/*")) {
            return fileType.startsWith(token.slice(0, -1));
          }

          if (fileType && fileType === token) {
            return true;
          }

          if (fileExt && fileExt === token) {
            return true;
          }

          return fileType ? mimeToExtension(token) === mimeToExtension(fileType) : mimeToExtension(token) === fileExt;
        });

      if (!accepted) {
        return `File type not accepted. Acceptable types: ${acceptValue}.`;
      }
    }

    if (typeof this.maxSize === "number" && Number.isFinite(this.maxSize) && this.maxSize > 0) {
      const maxBytes = this.maxSize * 1024 * 1024;
      if (file.size > maxBytes) {
        return `File must be smaller than ${this.maxSize} MB.`;
      }
    }

    return undefined;
  }

  private _handleCancel = (e: CustomEvent) => {
    const el = e.target as QGDSFileStatus;
    const dataTransfer = new DataTransfer();

    this._filesMeta.forEach((meta) => {
      const file = this.files?.item(meta.index);
      if (file && file !== el.file) dataTransfer.items.add(file);
    });

    this._updateInputFileList(dataTransfer.files);
  };

  private _updateInputFileList = (files: FileList) => {
    this._input.files = files;
    this._input.dispatchEvent(new Event("change"));
  };

  private _renderFiles = () => {
    const { files, _filesMeta } = this;
    return !files || files.length === 0
      ? nothing
      : files.length === 1
        ? html`<qgds-file-status
            .file=${files.item(0)}
            status=${_filesMeta[0].status}
            message=${ifDefined(_filesMeta[0].message)}
          ></qgds-file-status>`
        : html`<ul class="file-upload-list">
            ${repeat(
              _filesMeta,
              (meta) => files.item(meta.index)?.name, // key function will track the correct DOM object on add / removal
              (meta) =>
                html`<li>
                  <qgds-file-status
                    .file=${files.item(meta.index)}
                    status=${meta.status}
                    message=${ifDefined(meta.message)}
                  ></qgds-file-status>
                </li>`
            )}
          </ul>`;
  };

  protected renderInput(): TemplateResult {
    const {
      accept,
      required,
      id,
      name,
      disabled,
      maxFiles,
      maxSize,
      _ariaDescribedBy,
      _fileLimitReached,
      _isDragover,
      _handleCancel,
      _handleChange,
      _handleDragEnter,
      _handleDragLeave,
      _handleDrop,
      _preventDefaults,
      _renderFiles,
      _selectFiles,
    } = this;

    const multiple = this.multiple && maxFiles > 1;

    const validFileTypes =
      !this.accept || this.accept === "*"
        ? "any"
        : this.accept
            .split(",")
            .map((item) => {
              const trimmed = item.trim();
              // if item start with "." it is a file extension, return without the dot
              // else it is a mimetype string, evalaute for its file type
              return trimmed.startsWith(".") ? trimmed.slice(1) : mimeToExtension(trimmed);
            })
            .join(", ");

    const fileOrFiles = multiple ? "files" : "file";

    return html`<div class="file-upload" @qgds-cancel=${_handleCancel}>
      ${_fileLimitReached
        ? nothing
        : html`<div
            class=${classMap({ "file-upload-dropzone": true, "is-dragover": _isDragover })}
            @dragenter=${_handleDragEnter}
            @dragover=${_preventDefaults}
            @dragleave=${_handleDragLeave}
            @drop=${_handleDrop}
          >
            ${this._isMobile
              ? html`<p class="qgds-display-sm mb-16">Select ${fileOrFiles} to upload</p>`
              : html`<qgds-feature-icon icon-name="upload" size="sm" class="mb-16"></qgds-feature-icon>
                  <p class="qgds-display-md mb-16">
                    Drag and drop ${fileOrFiles} here or select ${fileOrFiles} to upload
                  </p> `}
            <p class="qgds-caption">You can upload ${validFileTypes} ${fileOrFiles}.</p>
            <p class="qgds-caption">${multiple ? "Files" : "File"} can’t be larger than ${maxSize} MB.</p>
            ${(maxFiles ?? 0) > 1 ? html`<p class="qgds-caption">You can upload up to ${maxFiles} files.</p>` : nothing}
            <qgds-button
              class="mt-24"
              variant="secondary"
              label="Select ${fileOrFiles}"
              @qgds-button-click=${_selectFiles}
            ></qgds-button>
          </div>`}
      <input
        id=${id}
        name=${ifDefined(name)}
        class="file-upload-input"
        type="file"
        tabindex="-1"
        accept=${ifDefined(accept)}
        ?multiple=${multiple}
        ?required=${required}
        ?disabled=${disabled}
        aria-describedby=${ifDefined(_ariaDescribedBy)}
        @click=${(e: PointerEvent) => {
          if (_fileLimitReached) _preventDefaults(e);
        }}
        @change=${_handleChange}
      />

      ${_renderFiles()}
    </div> `;
  }

  // render function is handled by the superClass
}

// Sub Component is only used within Main Component
@customElement("qgds-file-status")
class QGDSFileStatus extends LitElement {
  static styles = [baseStyles, formStyles, unsafeCSS(componentStyles), utilitiesStyles];

  @property({ type: Object, attribute: false }) file!: File;
  @property({ type: String }) status: Status = "loading";
  @property({ type: String }) message?: string = "";

  private get _iconName(): IconName {
    if (this.status === "error") return "document-error";
    else if (this.file) {
      switch (getFileType(this.file)) {
        case "audio":
          return "audio";
        case "image":
          return "image";
        case "pdf":
          return "document-pdf";
        case "spreadsheet":
          return "document-spreadsheet";
        case "text":
          return "document";
        case "video":
          return "video";
        case "word":
          return "document-word";
        default:
          return "document";
      }
    } else return "document";
  }

  private _events: QgdsEvents;

  constructor() {
    super();
    this._events = new QgdsEvents(this);
  }

  private _handleButtonClick = (e: CustomEvent) => {
    e.stopPropagation();
    this._events.dispatch("cancel");
  };

  render() {
    const { status, file, _iconName, _handleButtonClick } = this;
    const classNames = classMap({
      "is-loading": status === "loading",
      "is-ready": status === "ready",
      "is-success": status === "success",
      "is-error": status === "error",
    });
    const captionClassNames = classMap({
      "qgds-caption": status === "loading",
      "qgds-validation-message is-error": status === "error",
      "qgds-validation-message is-success": status === "success" || status === "ready",
    });

    const buttonLabel = status === "loading" ? "Cancel" : "Remove";
    const buttonIcon = status === "loading" ? "alert-cancel" : "delete";

    return html`<div class="file-status flex flex-wrap gap-x-16 align-items-center ${classNames}">
      ${status === "loading"
        ? html`<qgds-loading-spinner size="lg"></qgds-loading-spinner>`
        : html`<qgds-icon icon-id="${_iconName}" size="lg"></qgds-icon>`}
      <div class="flex-grow">
        <h6 class="qgds-display-xs mb-8">${file?.name}</h6>
        <p class=${captionClassNames}>
          ${status === "loading"
            ? html`Uploading...`
            : html`<qgds-icon icon-id=${status === "error" ? "status-error" : "status-success"} size="sm"></qgds-icon>
                ${this.message ?? nothing} ${file ? readableFileSize(file.size) : nothing}`}
        </p>
      </div>
      <qgds-button variant="tertiary" label=${buttonLabel} @qgds-button-click=${_handleButtonClick}
        ><qgds-icon slot="icon" icon-id=${buttonIcon}></qgds-icon
      ></qgds-button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagname]: QGDSFileUpload;
    "qgds-file-status": QGDSFileStatus;
  }
}
