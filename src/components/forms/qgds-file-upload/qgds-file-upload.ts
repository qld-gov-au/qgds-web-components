import { html, LitElement, unsafeCSS, nothing, TemplateResult } from "lit";
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
interface FileStatus {
  file: File;
  status: Status;
}

/**
 * @tagname qgds-file-upload
 */

@customElement(tagname)
export class QGDSFileUpload extends QGDSFormField {
  static override styles = [...super.styles, unsafeCSS(componentStyles)];

  @property({ type: Number, attribute: "max-files" }) maxFiles?: number = 1;
  @property({ type: Number, attribute: "min-files" }) minFiles?: number;
  @property({ type: Number, attribute: "max-size", useDefault: true }) maxSize?: number = 100; // Default 100MB???
  @property({ type: Boolean }) multiple: boolean = false;
  @property({ type: String }) accept: string = "";

  @state() private _files: FileStatus[] = [];

  @query("input[type=file]", true) private _input!: HTMLInputElement;

  private _breakpoint = new BreakpointController(this);
  private get _isMobile() {
    return qgdsBreakpoint[this._breakpoint.current] < qgdsBreakpoint.LG;
  }

  constructor() {
    super();
  }

  private _selectFiles = () => {
    this._input.click();
  };

  private _handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this._files = input.files ? Array.from(input.files).map((file) => ({ file, status: "ready" })) : [];
  };

  private _renderFiles = () => {
    const { _files } = this;
    return _files.length === 0
      ? nothing
      : _files.length === 1
        ? html`<qgds-file-status .file=${_files[0].file} status=${_files[0].status}></qgds-file-status>`
        : html`<ul class="file-upload-list">
            ${repeat(
              _files,
              (fileStatus) => fileStatus.file.name, // key function will track the correct DOM object on add / removal
              (fileStatus) =>
                html`<li>
                  <qgds-file-status .file=${fileStatus.file} status=${fileStatus.status}></qgds-file-status>
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
      readOnly,
      disabled,
      maxFiles,
      maxSize,
      _ariaDescribedBy,
      _handleChange,
      _renderFiles,
      _selectFiles,
    } = this;
    const multiple = this.multiple && ((maxFiles ?? 0) < 0 || (maxFiles ?? 0) > 1);
    const validFileTypes = this.accept
      .split(",")
      .map((item) => {
        const trimmed = item.trim();
        // if item start with "." it is a file extension, return without the dot
        // else it is a mimetype string, evalaute for its file type
        return trimmed.startsWith(".") ? trimmed.slice(1) : mimeToExtension(trimmed);
      })
      .join(", ");

    return html`<div class="file-upload">
      <div class="file-upload-dropzone">
        ${this._isMobile
          ? html`<p class="qgds-display-sm mb-16">Select file${multiple ? "s" : nothing} to upload</p>`
          : html`<qgds-feature-icon icon-name="upload" size="sm" class="mb-16"></qgds-feature-icon>
              <p class="qgds-display-md mb-16">
                Drag and drop file${multiple ? "s" : nothing} here or select file${multiple ? "s" : nothing} to upload
              </p> `}
        <p class="qgds-caption">You can upload ${validFileTypes} files.</p>
        <p class="qgds-caption">Files can’t be larger than ${maxSize} MB.</p>
        ${(maxFiles ?? 0) > 1 ? html`<p class="qgds-caption">You can upload up to ${maxFiles} files.</p>` : nothing}
        <qgds-button
          class="mt-24"
          variant="secondary"
          label="Select Files"
          @qgds-button-click=${_selectFiles}
        ></qgds-button>
      </div>
      <input
        id=${id}
        name=${ifDefined(name)}
        class="file-upload-input"
        type="file"
        tabindex="-1"
        accept=${ifDefined(accept)}
        ?multiple=${multiple}
        ?required=${required}
        ?readonly=${readOnly}
        ?disabled=${disabled}
        aria-describedby=${ifDefined(_ariaDescribedBy)}
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
  @property({ type: Object, attribute: false }) file?: File;
  @property({ type: String }) status: "loading" | "ready" | "error" | "success" = "loading";

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
                Upload complete - ${file ? readableFileSize(file.size) : nothing}`}
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
