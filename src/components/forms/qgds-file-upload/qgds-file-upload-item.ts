import { html, LitElement, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { baseStyles, formStyles, utilitiesStyles } from "../../../styles";
import componentStyles from "./qgds-file-upload.styles.scss?inline";
import { IconName } from "../../qgds-icon/icon-names";
import { QgdsEvents, getFileType } from "../../../utils";

import "../../qgds-button/qgds-button";
import "../../qgds-icon/qgds-icon";
import "../../qgds-loading-spinner/qgds-loading-spinner";

export type Status = "loading" | "ready" | "error" | "success";

// Sub Component is only used within Main Component
@customElement("qgds-file-upload-item")
export class QGDSFileUploadItem extends LitElement {
  static styles = [baseStyles, formStyles, unsafeCSS(componentStyles), utilitiesStyles];

  @property({ type: Object, attribute: false }) file!: File;
  @property({ type: String }) status: Status = "loading";
  @property({ type: String }) message: string = "";

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
    const { file, status, message, _iconName, _handleButtonClick } = this;
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

    return html`<div class="file-status ${classNames}">
      <div class="file-status-main">
        ${status === "loading"
          ? html`<qgds-loading-spinner size="lg" hide-label></qgds-loading-spinner>`
          : html`<qgds-icon icon-id="${_iconName}" size="lg"></qgds-icon>`}
        <div class="flex-grow">
          <h6 class="qgds-display-xs mb-8">${file.name}</h6>
          <p class=${captionClassNames}>
            ${status === "loading"
              ? html`Uploading...`
              : html`<qgds-icon icon-id=${status === "error" ? "status-error" : "status-success"} size="sm"></qgds-icon>
                  ${message ?? nothing}`}
          </p>
        </div>
      </div>
      <qgds-button
        variant="tertiary"
        label=${buttonLabel}
        @qgds-click=${_handleButtonClick}
        icon-name=${buttonIcon}
      ></qgds-button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-file-upload-item": QGDSFileUploadItem;
  }
}
