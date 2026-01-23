import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-icon.styles.scss?inline";

type IconSize = "sm" | "md" | "lg" | "xl";

@customElement("qgds-icon")
export class QGDSIcon extends LitElement {
  @property({ type: String })
  iconId: string = "";

  @property({ type: String })
  size: IconSize = "md";

  @property({ type: String, attribute: "arialabel" })
  ariaLabel: string = "";

  static styles = css`
    ${unsafeCSS(componentCSS)}
  `;

  render() {
    return html`
      <span class="qgds-icon" aria-label="${this.ariaLabel || "icon"}"></span>
    `;
  }
}
