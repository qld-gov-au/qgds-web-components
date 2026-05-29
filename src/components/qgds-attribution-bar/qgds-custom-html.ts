import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

export type QGDSCustomHtmlProps = InstanceType<typeof QGDSCustomHtml>;

/**
 * Custom HTML content container for the attribution bar.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97586&p=f&m=dev
 *
 * @slot - Default slot accepts custom HTML content.
 */

@customElement("qgds-custom-html")
export class QGDSCustomHtml extends LitElement {
  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-custom-html": QGDSCustomHtml;
  }
}
