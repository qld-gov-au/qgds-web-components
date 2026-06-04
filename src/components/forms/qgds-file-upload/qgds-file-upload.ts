import { html, LitElement, unsafeCSS, nothing, TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles, formStyles, utilitiesStyles } from "../../../styles";
import componentStyles from "./qgds-file-upload.styles.scss?inline";
import { QgdsEvents, readableFileSize, getFileType } from "../../../utils";
import { QGDSFormField } from "../qgds-form-field";

import "../../qgds-button/qgds-button";
import "../../qgds-icon/qgds-icon";
import "../../qgds-loading-spinner/qgds-loading-spinner";
import { IconName } from "../../qgds-icon/icon-names";

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
  @property({ type: Number, attribute: "min-files" }) minFiles?: number = 0;
  @property({ type: Number, attribute: "max-size" }) maxSize?: number = 100; // Default 100MB???
  @property({ type: String }) accept: string = "";

  @state() private _files: FileStatus[] = [];

  constructor() {
    super();
    // Mock a File Object for now.
    const loadingFile: FileStatus = {
      file: new File(["content"], "loading-file.txt", {
        type: "text/plain",
      }),
      status: "loading",
    };
    const textFile: FileStatus = {
      file: new File(["content"], "text-file.txt", {
        type: "text/plain",
      }),
      status: "ready",
    };
    const wordFile: FileStatus = {
      file: new File(["content"], "word-file.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      status: "ready",
    };
    const pdfFile: FileStatus = {
      file: new File(["content"], "pdf-file.pdf", {
        type: "application/pdf",
      }),
      status: "ready",
    };
    const imageFile: FileStatus = {
      file: new File(["content"], "image-file.jpg", {
        type: "image/jpeg",
      }),
      status: "ready",
    };
    const csvFile: FileStatus = {
      file: new File(["content"], "csv-file.csv", {
        type: "text/csv",
      }),
      status: "ready",
    };
    const audioFile: FileStatus = {
      file: new File(["content"], "audio-file.mp3", {
        type: "audio/mpeg",
      }),
      status: "ready",
    };
    const videoFile: FileStatus = {
      file: new File(["content"], "video-file.mp4", {
        type: "video/mp4",
      }),
      status: "ready",
    };
    const errorFile: FileStatus = {
      file: new File(["content"], "error-file.csv", {
        type: "text/plain",
      }),
      status: "error",
    };
    const successFile: FileStatus = {
      file: new File(["content"], "success-file.csv", {
        type: "text/plain",
      }),
      status: "success",
    };

    Object.defineProperty(videoFile.file, "size", { value: 12_345_678, configurable: true });
    Object.defineProperty(imageFile.file, "size", { value: 12_345, configurable: true });
    Object.defineProperty(errorFile.file, "size", { value: 12_345_678_910, configurable: true });

    this._files = [
      ...this._files,
      successFile,
      errorFile,
      videoFile,
      audioFile,
      csvFile,
      imageFile,
      pdfFile,
      wordFile,
      textFile,
      loadingFile,
    ];
  }

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
    const { _renderFiles } = this;
    return html`${_renderFiles()}`;
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
