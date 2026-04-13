import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-blockquote.styles.scss?inline";

export type QGDSBlockquoteProps = InstanceType<typeof QGDSBlockquote>;

/**
 * Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=133254-206549&t=FIwjIg0V3JbsLmNw-0
 *
 * @property {string} citeUrl - The URL of the source of the quote
 * @property {string} citeLabel - The text for the citation
 *
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 *
 * @cssprop {color} --bg - Override the background color of the blockquote.
 * @cssprop {color} --border - Override the border color of the blockquote.
 * @cssprop {color} --fg - Override the text color within the blockquote.
 * @cssprop {color} --cite-fg - Override the citation text color within the blockquote.
 */

@customElement("qgds-blockquote")
export class QGDSBlockquote extends LitElement {
  @property({ type: String, attribute: "cite-url" })
  citeUrl: string = "";

  @property({ type: String, attribute: "cite-label" })
  citeLabel: string = "";

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    return html`
      <figure>
        <blockquote><slot></slot></blockquote>
        ${this.citeLabel
          ? html`<figcaption>
              <cite>
                ${this.citeUrl ? html`<a href="${this.citeUrl}">${this.citeLabel}</a>` : html`${this.citeLabel}`}
              </cite>
            </figcaption>`
          : nothing}
      </figure>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-blockquote": QGDSBlockquote;
  }
}
