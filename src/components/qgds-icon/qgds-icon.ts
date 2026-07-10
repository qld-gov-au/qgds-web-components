import { LitElement, html, unsafeCSS } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { resetStyles } from "../../styles";
import componentCSS from "./qgds-icon.styles.scss?inline";
import { isMulticolourIcon } from "./icons-multicolour.js";
import type { IconName } from "./icon-names";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * QGDS Icon Component
 *
 * A web component for displaying icons using CSS mask-image or background-image techniques.
 * Single-colour icons use mask-image for easy recolouring via CSS.
 * Multi-colour icons use background-image to preserve their original colours.
 *
 * @uikit https://www.figma.com/design/0mkS2SvlrITvPC4JTnF7RS/QGDS-Icon-library
 * @website https://www.designsystem.qld.gov.au/styles/iconography
 *
 * @attr {IconName} icon-id - The ID of the icon to display (e.g., "home", "alert-success").
 * @attr {IconSize} size - The size of the icon. Options are "xs", "sm", "md", "lg", "xl", "xxl". Default is "md".
 * @attr {string} aria-label - The aria-label for the icon for accessibility.
 *
 * @cssprop --qgds-icon-color - The color of single-colour icons (applies to mask-image icons).
 * @cssprop --qgds-icon-size - The size of the icon.
 *
 * @example
 * ```html
 * <qgds-icon icon-id="home" size="md" aria-label="Home"></qgds-icon>
 * ```
 */
@customElement("qgds-icon")
export class QGDSIcon extends LitElement {
  @property({ type: String, attribute: "icon-id" })
  iconId?: IconName;

  @property({ type: String, useDefault: true })
  size: IconSize = "md";

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string = "";

  static styles = [resetStyles, unsafeCSS(componentCSS)];

  private get isMulticolour(): boolean {
    return this.iconId ? isMulticolourIcon(this.iconId) : false;
  }

  // Determine accessibility attributes based on the presence of ariaLabel

  render() {
    const classes = {
      "qgds-icon": true,
      "qgds-icon-multicolour": this.isMulticolour,
    };

    const labelText = this.ariaLabel || undefined;
    const role = labelText ? "img" : undefined;
    const ariaHidden = labelText ? undefined : "true";

    return html`
      <span
        aria-label="${ifDefined(labelText)}"
        aria-hidden="${ifDefined(ariaHidden)}"
        role="${ifDefined(role)}"
        style="
          --qgds-icon-svg: var(--qgds-icon-${this.iconId}); 
          --_qgds-icon-size: var(--qgds-icon-size, var(--qgds-icon-size-${this.size}))"
        class="${classMap(classes)}"
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-icon": QGDSIcon;
  }
}
