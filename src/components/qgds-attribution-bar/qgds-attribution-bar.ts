import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { palettes } from "../../utils";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-attribution-bar.styles.scss?inline";

type QGDSPalette = keyof typeof palettes;

/**
 * An attribution bar may be used within a site header to display site-wide links and actions such as Contact Us and Login
 *
 * @tagname qgds-attribution-bar
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97586&p=f&m=dev
 *
 * @prop {QGDSPalette} [palette="default"] - Colour palette applied to the attribution bar.
 *
 * @slot site-name - Accepts a <qgds-link> element. It is used to display the site name and link to the left of the attribution bar.
 * @slot - Default slot. Accepts <qgds-link> as well as custom html elements. It is used to display links, such as "Contact us", "Find services", etc. or a custom menu towards the right of the attribution bar.
 *
 */
@customElement("qgds-attribution-bar")
export class QGDSAttributionBar extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true, useDefault: true })
  palette: QGDSPalette = "default";

  render() {
    return html`
      <section aria-label="Attribution bar" class="attribution-bar">
        <div class="attribution-bar-collection">
          <slot name="site-name"></slot>
        </div>
        <div class="attribution-bar-links">
          <div class="attribution-bar-attribution">
            <slot></slot>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-attribution-bar": QGDSAttributionBar;
  }
}
