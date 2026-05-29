import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-attribution-bar.styles.scss?inline";

export type QGDSAttributionBarProps = InstanceType<typeof QGDSAttributionBar>;

/**
 * Attribution sits before the header and is visible only desktop(lg) and above.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97586&p=f&m=dev
 *
 * @slot - Default slot accepts <qdgs-link> elements. It is used to display the collection name and link to the left of attribution bar.
 * @slot attribution - Accepts <qdgs-link> elements. It is used to display links, such as "Contact us", "Find services", etc. towards the right of attribution bar.
 * @slot custom - Content slot that accepts custom HTML content, that includes heading/paragraphs/dropdowns etc. It is used to display custom content, such as log-in dropdown on right most part of attribution bar.
 *
 */
@customElement("qgds-attribution-bar")
export class QGDSAttributionBar extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    return html`
      <section aria-label="Attribution bar" class="attribution-bar">
        <div class="attribution-bar__collection">
          <slot></slot>
        </div>
        <div class="attribution-bar__links">
          <div class="attribution-bar__attribution">
            <slot name="attribution"></slot>
          </div>
          <div class="attribution-bar__custom">
            <slot name="custom"></slot>
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
