import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import componentCSS from "./qgds-call-to-action.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link/qgds-link.js";

@customElement("qgds-call-to-action")
export class QgdsCallToAction extends LitElement {
  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String }) label = "View all";
  @property({ type: String }) href = "#";
  @property({ type: Boolean, reflect: true, attribute: "is-view-all" }) isViewAll = false;

  render() {
    return html`
      <qgds-link
        label="${this.label}"
        href="${this.href}"
        icon-name="${this.isViewAll ? "view-all" : "arrow-right"}"
        animation="leftToRight"
        icon-size=${this.isViewAll ? "lg" : "md"}
        trailing-icon
      ></qgds-link>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-call-to-action": QgdsCallToAction;
  }
}
