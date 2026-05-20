import { html, LitElement, unsafeCSS } from "lit";
// import { classMap } from "lit/directives/class-map.js";
// import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles, formStyles } from "../../../styles";
import componentStyles from "./qgds-file-upload.styles.scss";
import { QgdsEvents } from "../../../utils";
import { QGDSFormField } from "../qgds-form-field";

import "../../qgds-button/qgds-button";
import "../../qgds-icon";

export const tagName = "qgds-file-upload";

// Sub Component is only used within Main Component
@customElement("qgds-file-status")
class QGDSFileStatus extends LitElement {
  static styles = [baseStyles, formStyles, unsafeCSS(componentStyles)];
  @property({ type: Object, attribute: false }) file?: File;
  @property({ type: String }) status: "loading" | "ready" | "error" | "success" = "loading";

  private _events: QgdsEvents;

  constructor() {
    super();
    this._events = new QgdsEvents(this);
  }

  render() {
    const { name, size } = this.file ?? { name: "", size: 0 };
    return html`<div class="file-status is-flex">
      <div class="is-flex">
        <qgds-icon icon-id="document"></qgds-icon>
        <div>
          <h6 class="qgds-display-xs">${name}</h6>
          <p class="qgds-validation-message">
            <qgds-icon icon-id="status-success" size="sm"></qgds-icon> Upload complete - ${size}
          </p>
        </div>
        <qgds-button variant="tertiary"><qgds-icon icon-id="delete"></qgds-icon></qgds-button>
      </div>
    </div>`;
  }
}

@customElement("qgds-file-upload")
export class QGDSFileUpload extends QGDSFormField {
  static override styles = [...super.styles, unsafeCSS(componentStyles)];

  @property({ type: Number, attribute: "max-files" }) maxFiles?: number = 1;
  @property({ type: Number, attribute: "min-files" }) minFiles?: number = 0;
  @property({ type: Number, attribute: "max-size" }) maxSize?: number = 100; // Default 100MB???
  @property({ type: String }) accept: string = "";

  @state() private _files: File[] = [];

  // Mock a File Object for now.
  private mockFile = new File(["content"], "test-file.txt", {
    type: "text/plain",
  });

  renderInput() {
    return html`<qgds-file-status .file=${this.mockFile}></qgds-file-status>`;
  }

  // render function is handled by the superClass
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-file-upload": QGDSFileUpload;
    "qgds-file-status": QGDSFileStatus;
  }
}
