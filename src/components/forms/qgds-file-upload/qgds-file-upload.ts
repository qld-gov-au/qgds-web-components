import { html, unsafeCSS, nothing, TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state, query } from "lit/decorators.js";
import componentStyles from "./qgds-file-upload.styles.scss?inline";
import { QgdsEvents, readableFileSize, mimeToExtension, BreakpointController } from "../../../utils";
import { QGDSFormField } from "../qgds-form-field";
import { Status, type QGDSFileUploadItem } from "./qgds-file-upload-item";
import "./qgds-file-upload-item";
import "../../qgds-feature-icon/qgds-feature-icon";

import { ifDefined } from "lit/directives/if-defined.js";
import qgdsBreakpoint from "../../../styles/qgds-tokens/qgds-breakpoint";

export const tagname = "qgds-file-upload";

interface Meta {
  status: Status;
  message?: string;
}

export interface MetaFile extends Meta {
  file: File;
}

/**
 * File upload input for selecting one or more files with drag-and-drop support.
 *
 * Use this component when a form needs a file picker that can validate accepted
 * MIME types and file-size limits before submission.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97997&m=dev
 * @website https://www.designsystem.qld.gov.au/components/file-upload
 *
 * @tagname qgds-file-upload
 *
 * @prop {number} [max-files=1] - Maximum number of files that can be selected.
 * @prop {number} [max-size=100] - Maximum allowed file size in MB.
 * @prop {boolean} [multiple=false] - Whether more than one file may be selected.
 * @prop {string} [accept=""] - Comma-separated list of accepted file types or extensions.
 *
 * @slot details - Place any markup to be rendered within additional details.
 *
 * @event qgds-change - Fired when the selected files change.
 *
 * @example
 * ```html
 * <qgds-file-upload
 *   id="upload"
 *   label="Upload a document"
 *   accept="image/*,.pdf"
 *   max-files="3"
 * ></qgds-file-upload>
 * ```
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
  @property({ type: Number, attribute: "max-size", useDefault: true }) maxSize?: number = 100; // Default 100MB???
  @property({ type: Boolean }) multiple?: boolean = false;
  @property({ type: String }) accept?: string = "";

  // public readonly `files`
  get files(): FileList | null {
    const dataTransfer = new DataTransfer();
    this._validMetaFiles.forEach((item) => dataTransfer.items.add(item.file));
    return dataTransfer.files;
  }

  // public readonly `filesArray`
  get filesArray(): File[] {
    return this._validMetaFiles.map((item) => item.file);
  }

  // private state
  @state() private _metaFiles: MetaFile[] = [];
  @state() private _isDragover: boolean = false;

  // query helpers
  @query("input[type=file]") private _input!: HTMLInputElement;
  @query(".file-upload-dropzone") private _dropzone!: HTMLDivElement | null;

  private _maxFiles: number = 1;
  private _events: QgdsEvents;
  private _breakpoint = new BreakpointController(this);
  private get _isMobile() {
    return qgdsBreakpoint[this._breakpoint.current] < qgdsBreakpoint.LG;
  }

  private get _fileLimitReached() {
    return (this.files?.length ?? 0) >= this.maxFiles;
  }

  private get _validMetaFiles(): MetaFile[] {
    return this._metaFiles.filter((item) => item.status !== "error");
  }

  private get _hasValidationErrors(): boolean {
    return this._metaFiles.some((item) => item.status === "error");
  }

  constructor() {
    super();
    this._events = new QgdsEvents(this);
  }

  connectedCallback(): void {
    super.connectedCallback?.();
  }

  private _preventDefaults = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  private _handleDragOver = (e: DragEvent) => {
    this._preventDefaults(e);
    if (this.disabled) {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "none";
      }
      return;
    }
    this._isDragover = true;
  };

  private _handleDragLeave = (e: DragEvent) => {
    this._preventDefaults(e);
    if (e.target === this._dropzone) {
      this._isDragover = false;
    }
  };

  private _handleDrop = async (e: DragEvent) => {
    this._preventDefaults(e);
    if (this.disabled) {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "none";
      }
      return;
    }
    this._isDragover = false;
    // If the drag event includes files
    if (e.dataTransfer?.files) {
      await this._addFiles(e.dataTransfer.files);
    }
  };

  // Fired when the internal input changes. Keep its value internal because we handle add/remove files differently
  private _handleChange = async (e: Event) => {
    this._preventDefaults(e);

    const input = e.target as HTMLInputElement;

    if (input.files?.length) {
      await this._addFiles(input.files);
    }
  };

  private _handleCancel = async (e: CustomEvent) => {
    const el = e.target as QGDSFileUploadItem;
    await this._removeFile(el.file);
  };

  private _addFiles = async (files: FileList) => {
    const newFiles: MetaFile[] = [];
    Array.from(files).forEach((file) => {
      const meta = this._getMetaValidate(file);
      newFiles.push({
        file,
        ...meta,
      });
    });
    this._metaFiles = [...this._metaFiles, ...newFiles]; // ensure a new array is created.
    await this.updateComplete;
    this._events.dispatch("change", { value: this.filesArray });
  };

  private _removeFile = async (fileToRemove: File) => {
    this._metaFiles = this._metaFiles.filter((item) => item.file !== fileToRemove); // ensure a new array is created.
    await this.updateComplete;
    this._events.dispatch("change", { value: this.filesArray });
  };

  private _selectFiles = () => {
    this._input.click();
  };

  protected override _computeIsValid(): boolean {
    if (this._hasValidationErrors) {
      return false;
    }

    if (!this.required) {
      return true;
    }

    return (this.files?.length ?? 0) > 0;
  }

  override checkValidity(): boolean {
    return this._computeIsValid();
  }

  override reportValidity(): boolean {
    const isValid = this._computeIsValid();

    if (!isValid) {
      const hasFiles = (this.files?.length ?? 0) > 0;
      const message = this._hasValidationErrors
        ? "Please remove invalid files before continuing."
        : "Please select at least one file.";

      this._internals.setValidity(
        {
          valueMissing: !hasFiles,
          customError: this._hasValidationErrors,
        },
        message,
        this._input
      );
      this.validationMessage = message;
      this.validationState = "error";
      this.focus();
      return false;
    }

    this._internals.setValidity({});
    this.validationMessage = undefined;
    this.validationState = undefined;
    return true;
  }

  private _getMetaValidate(file: File): Meta {
    const acceptValue = (this.accept ?? "").trim();

    // validate against accepted file types
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
        return {
          status: "error",
          message: `File type not accepted. Acceptable types: ${acceptValue}.`,
        };
      }
    }

    // validate against max size
    if (typeof this.maxSize === "number" && Number.isFinite(this.maxSize) && this.maxSize > 0) {
      const maxBytes = this.maxSize * 1024 * 1024;
      if (file.size > maxBytes) {
        return {
          status: "error",
          message: `File must be smaller than ${this.maxSize} MB.`,
        };
      }
    }

    // Else file is good to go.
    return {
      status: "ready",
      message: `File ready for upload - ${readableFileSize(file.size)}`,
    };
  }

  private _renderFiles = () => {
    const { _metaFiles } = this;
    return !_metaFiles || _metaFiles.length === 0
      ? nothing
      : _metaFiles.length === 1
        ? html`<qgds-file-upload-item
            .file=${_metaFiles[0].file}
            status=${_metaFiles[0].status}
            message=${ifDefined(_metaFiles[0].message)}
          ></qgds-file-upload-item>`
        : html`<ul class="file-upload-list">
            ${repeat(
              _metaFiles,
              (meta) => meta.file.name, // key function will track the correct DOM object on add / removal // Need a UUID perhaps instead?
              (meta) =>
                html`<li>
                  <qgds-file-upload-item
                    .file=${meta.file}
                    status=${meta.status}
                    message=${ifDefined(meta.message)}
                  ></qgds-file-upload-item>
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
      validationState,
      maxFiles,
      maxSize,
      _ariaDescribedBy,
      _fileLimitReached,
      _isDragover,
      _handleCancel,
      _handleChange,
      _handleDragLeave,
      _handleDragOver,
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
    const showMaxFiles = (maxFiles ?? 0) > 1 && maxFiles !== Infinity;

    return html`<div
      class=${classMap({
        "file-upload": true,
        "is-disabled": !!disabled,
        "is-error": validationState === "error",
      })}
      @qgds-cancel=${_handleCancel}
    >
      ${_fileLimitReached
        ? nothing
        : html`<div
            class=${classMap({ "file-upload-dropzone": true, "is-dragover": _isDragover })}
            @dragenter=${_handleDragOver}
            @dragover=${_handleDragOver}
            @dragleave=${_handleDragLeave}
            @drop=${_handleDrop}
          >
            ${this._isMobile
              ? html`<p class="qgds-display-sm mb-16">Select ${fileOrFiles} to upload</p>`
              : html`<qgds-feature-icon icon-name="upload" size="sm" class="mb-16"></qgds-feature-icon>
                  <p class="qgds-display-md mb-16">
                    Drag and drop ${fileOrFiles} here or select ${fileOrFiles} to upload
                  </p> `}
            <p class="qgds-caption">You can upload ${validFileTypes} files.</p>
            <p class="qgds-caption">${multiple ? "Files" : "File"} can’t be larger than ${maxSize} MB.</p>
            ${showMaxFiles ? html`<p class="qgds-caption">You can upload up to ${maxFiles} files.</p>` : nothing}
            <qgds-button
              class="mt-24"
              variant="secondary"
              label="Select ${fileOrFiles}"
              ?disabled=${disabled}
              @qgds-click=${_selectFiles}
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

declare global {
  interface HTMLElementTagNameMap {
    [tagname]: QGDSFileUpload;
  }
}
