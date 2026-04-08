import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-blockquote.styles.scss?inline";
import { ifDefined } from "lit/directives/if-defined.js";

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
 * @cssprop {color} --bg - Override the background color of the blockquote.
 * @cssprop {color} --border - Override the border color of the blockquote.
 * @cssprop {color} --fg - Override the text color within the blockquote.
 * @cssprop {color} --reference-fg - Override the reference text color within the blockquote.
 */

@customElement("qgds-blockquote")
export class QGDSBlockquote extends LitElement {
  @property({ type: String, attribute: "reference-url" })
  referenceURL: string = "";

  @property({ type: String, attribute: "reference-text" })
  referenceText: string = "";

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    return html`
      <figure>
        <blockquote cite="${ifDefined(this.referenceURL)}"><slot></slot></blockquote>
        ${this.referenceText ? html`<figcaption>${this.referenceText}</figcaption>` : nothing}
      </figure>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-blockquote": QGDSBlockquote;
  }
}
