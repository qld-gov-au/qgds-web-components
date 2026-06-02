import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../qgds-icon/qgds-icon";
import styles from "./qgds-loading-spinner.styles.scss?inline";
import { resetStyles, utilitiesStyles } from "../../styles";
import type { IconSize } from "../qgds-icon/qgds-icon";

/**
 * QGDS Loading Spinner
 *
 * Indicates that content is loading or a process is in progress.
 * Uses an animated icon to convey the loading state to users.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=49314-16705
 * @website https://www.designsystem.qld.gov.au/components/loading-spinner
 *
 * @prop {IconSize} [size="md"] The size of the spinner icon: "xs", "sm", "md", "lg", "xl" or "xxl".
 * @prop {string} [label="Loading"] Text used as the accessible label. Also shown visually when labelVisible is true.
 * @prop {boolean} [hideLabel=false] Whether to display the label text visually below the spinner.
 * @prop {boolean} [isStacked=false] When true, stacks the icon and label vertically. When false, displays them inline horizontally.
 *
 */

@customElement("qgds-loading-spinner")
export class QGDSLoadingSpinner extends LitElement {
  @property({ type: String, useDefault: true })
  size: IconSize = "md";

  @property({ type: String, useDefault: true })
  label: string = "Loading";

  @property({ type: Boolean, attribute: "hide-label", reflect: true })
  hideLabel: boolean = false;

  @property({ type: Boolean, attribute: "is-stacked", reflect: true })
  isStacked: boolean = false;

  static styles = [resetStyles, utilitiesStyles, unsafeCSS(styles)];

  render() {
    return html`
      <div class="loading-spinner ${this.isStacked ? "is-stacked" : ""}" role="status" aria-label="${this.label}">
        <qgds-icon class="spinner-icon" icon-id="spinner-step-1" size="${this.size}" aria-hidden="true"></qgds-icon>

        ${this.hideLabel
          ? html`<span class="sr-only">${this.label}</span>`
          : html`<span class="label">${this.label}</span>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-loading-spinner": QGDSLoadingSpinner;
  }
}
