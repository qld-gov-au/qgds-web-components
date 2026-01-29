import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import componentCSS from "./qgds-icon.styles.scss?inline";
import { isMulticolourIcon } from "./icons-multicolour.js";

type IconSize = "sm" | "md" | "lg" | "xl";

/**
 * QGDS Icon Component
 *
 * A web component for displaying icons using CSS mask-image or background-image techniques.
 * Single-colour icons use mask-image for easy recolouring via CSS.
 * Multi-colour icons use background-image to preserve their original colours.
 *
 * @element qgds-icon
 * @attr {string} iconId - The ID of the icon to display (e.g., "home", "alert-success").
 * @attr {IconSize} size - The size of the icon. Options are "sm", "md", "lg", "xl". Default is "md".
 * @attr {string} ariaLabel - The aria-label for the icon for accessibility.
 *
 * @example
 * ```html
 * <qgds-icon iconId="home" size="md" ariaLabel="Home"></qgds-icon>
 * ```
 */
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
