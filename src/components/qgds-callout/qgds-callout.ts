import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-callout.styles.scss?inline";

export type QGDSCalloutProps = InstanceType<typeof QGDSCallout>;

/** QGDS Callout Web Component
 *  Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 * @example
 * <qgds-callout heading="Important Notice" heading-level="h2">
 *
 * @attribute heading - Callout headline text
 * @attribute heading-level - Heading level (h2-h6)
 * @attribute content - Callout message content
 */

@customElement("qgds-callout")
export class QGDSCallout extends LitElement {
  @property({ type: String, reflect: true, attribute: "heading" })
  heading: string = "Callout headline";
  @property({ type: String, reflect: true, attribute: "heading-level" })
  headingLevel: string = "h3";
  @property({ type: String, reflect: true, attribute: "content" })
  content: string = "This is callout content.";

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    let headingElement: unknown = "";

    if (this.heading) {
      switch (this.headingLevel.toLowerCase()) {
        case "2":
        case "h2":
          headingElement = html`<h2 class="headline">${this.heading}</h2>`;
          break;
        case "3":
        case "h3":
          headingElement = html`<h3 class="headline">${this.heading}</h3>`;
          break;
        case "4":
        case "h4":
          headingElement = html`<h4 class="headline">${this.heading}</h4>`;
          break;
        case "5":
        case "h5":
          headingElement = html`<h5 class="headline">${this.heading}</h5>`;
          break;
        case "6":
        case "h6":
          headingElement = html`<h6 class="headline">${this.heading}</h6>`;
          break;
        default:
          console.warn(
            `Unsupported heading level: ${this.headingLevel}. Defaulting to h3.`,
          );
          headingElement = html`<h3 class="headline">${this.heading}</h3>`;
      }
    }

    return html`
      <div class="callout">
        ${headingElement}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
