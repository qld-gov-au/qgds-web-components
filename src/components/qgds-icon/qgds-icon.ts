import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import componentCSS from "./qgds-icon.styles.scss?inline";
import { isMulticolourIcon } from "./icons-multicolour.js";

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

  private get isMulticolour(): boolean {
    return isMulticolourIcon(this.iconId);
  }

  render() {
    const classes = {
      "qgds-icon": true,
      "qgds-icon-multicolour": this.isMulticolour,
    };

    return html`
      <span class="${classMap(classes)}" aria-label="${this.ariaLabel || "icon"}"></span>
    `;
  }
}
