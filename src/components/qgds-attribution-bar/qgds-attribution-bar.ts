import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { palettes } from "../../utils";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-attribution-bar.styles.scss?inline";

import "../qgds-link/qgds-link.js";

type QGDSPalette = keyof typeof palettes;

/**
 * An attribution bar may be used within a site header to display site-wide links and actions such as Contact Us and Login
 *
 * @tagname qgds-attribution-bar
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97586&p=f&m=dev
 *
 * @prop {QGDSPalette} [palette="default"] - Colour palette applied to the attribution bar.
 * @prop {String} [url] - URL for attribution bar link.
 * @prop {String} [label] - Label for attribution bar link.
 *
 *
 * @slot - Default slot. Accepts <qgds-link> as well as custom html elements. It is used to display links, such as "Contact us", "Find services", etc. or a custom menu towards the right of the attribution bar.
 *
 */
@customElement("qgds-attribution-bar")
export class QGDSAttributionBar extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true, useDefault: true })
  palette: QGDSPalette = "default";

  @property({ type: String, reflect: true })
  url?: string;

  @property({ type: String, reflect: true })
  label?: string;

  render() {
    return html`
      <section aria-label="Attribution bar" class="attribution-bar">
        <div class="attribution-bar-container qgds-container qgds-cols">
          <div class="attribution-bar-collection qgds-span-4 qgds-span-3:md qgds-span-8:lg">
            ${this.url && this.label
              ? html`<qgds-link href="${ifDefined(this.url)}" label="${ifDefined(this.label)}"></qgds-link>`
              : nothing}
          </div>
          <div class="attribution-bar-links qgds-span-4 qgds-span-3:md qgds-span-4:lg">
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
