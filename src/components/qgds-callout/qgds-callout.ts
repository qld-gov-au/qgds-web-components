import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { semanticHeading } from "../../js/utils";
import componentCSS from "./qgds-callout.styles.scss?inline";

export type QGDSCalloutProps = InstanceType<typeof QGDSCallout>;

/** QGDS Callout Web Component
 *  Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 * @example
 * <qgds-callout heading="Important Notice" heading-level="h2">
 *  <p>This is an important callout message.</p>
 * </qgds-callout>
 *
 * @attribute heading - Callout headline text
 * @attribute heading-level - Heading level (h2-h6)
 */

@customElement("qgds-callout")
export class QGDSCallout extends LitElement {
  @property({ type: String, reflect: true, attribute: "heading" })
  heading: string = "Callout headline";
  @property({ type: String, reflect: true, attribute: "heading-level" })
  headingLevel: string = "h3";

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    return html`
      <div class="callout">
        ${semanticHeading(this.heading, this.headingLevel)}

        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
