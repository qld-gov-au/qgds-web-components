import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-blockquote.styles.scss?inline";

export type QGDSBlockquoteProps = InstanceType<typeof QGDSBlockquote>;

/**
 * Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=133254-206549&t=FIwjIg0V3JbsLmNw-0
 *
 * @property {string} referenceURL - The URL of the source of the quote
 * @property {string} referenceText - The text for the citation
 *
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 *
 * @cssprop {color} --blockquote-background - Override the background color of the blockquote.
 * @cssprop {color} --blockquote-border - Override the border color of the blockquote.
 * @cssprop {color} --blockquote-text - Override the text color within the blockquote.
 * @cssprop {color} --blockquote-reference - Override the reference text color within the blockquote.
 */

@customElement("qgds-blockquote")
export class QGDSBlockquote extends LitElement {
  @property({ type: String, attribute: "reference-url", useDefault: true })
  referenceURL: string = "";

  @property({ type: String, reflect: true, attribute: "reference-text", useDefault: true })
  referenceText: string = "";

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    return html`
      <figure class="blockquote">
        <blockquote cite="${this.referenceURL}"><slot></slot></blockquote>
        <figcaption class="quote-source">${this.referenceText}</figcaption>
      </figure>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-blockquote": QGDSBlockquote;
  }
}
