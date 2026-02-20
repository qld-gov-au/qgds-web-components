import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { semanticHeading } from "../../js/utils";
import componentCSS from "./qgds-callout.styles.scss?inline";

export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export type QGDSCalloutProps = InstanceType<typeof QGDSCallout>;

/**
 * Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120360-73541&m=dev
 * @website https://www.designsystem.qld.gov.au/components/callout
 * @tagname qgds-callout
 *
 * @attribute heading - Callout heading text
 * @attribute heading-level - Heading level (h2-h6)
 *
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 *
 * @cssprop {color} --background - Override the background color of the callout.
 * @cssprop {color} --border - Override the border color of the callout.
 * @cssprop {color} --text-color - Override the text color within the callout.
 */

@customElement("qgds-callout")
export class QGDSCallout extends LitElement {
  @property({ type: String, reflect: true, attribute: "heading" })
  heading: string = "Callout heading";

  @property({ type: String, reflect: true, attribute: "heading-level" })
  headingLevel: HeadingLevel = "h3";

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
