import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

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
    // Old SVG sprite approach (replaced with CSS mask-image):
    // <svg class="qgds-icon-${this.size}" ?aria-hidden="${this.ariaHidden}" aria-label="${ifDefined(this.ariaLabel)}">
    //   <use href="./assets/img/icons-sprite.svg#qgds-icon-${this.iconId}"></use>
    // </svg>

    return html`
      <span class="qgds-icon" aria-label="${this.ariaLabel || "icon"}"></span>
    `;
  }
}
