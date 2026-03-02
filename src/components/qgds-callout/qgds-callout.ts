import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { semanticHeading } from "../../utils";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-callout.styles.scss?inline";

export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingDisplay = "Default" | "Extra small" | "Small" | "Medium";
export type QGDSCalloutProps = InstanceType<typeof QGDSCallout>;

/**
 * Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120360-73541&m=dev
 * @website https://www.designsystem.qld.gov.au/components/callout
 * @tagname qgds-callout
 *
 * @property {string} heading - Callout heading text
 * @property {HeadingLevel} [headingLevel="h3"] - Heading level (h2-h6)
 * @property {HeadingDisplay} [headingDisplay="Small"] - Display size (qgds-heading-sm, qgds-heading-md, qgds-heading-lg)
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

  @property({ type: String, reflect: true, attribute: "heading-level", useDefault: true })
  headingLevel: HeadingLevel = "h3";

  @property({ type: String, reflect: true, attribute: "heading-display", useDefault: true })
  headingDisplay: HeadingDisplay = "Small";

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  private static readonly headingClasses: Record<HeadingDisplay, string> = {
    "Extra small": "qgds-heading-xs",
    "Small": "qgds-heading-sm",
    "Medium": "qgds-heading-md",
  };

  private static readonly headingDefaults: Record<HeadingLevel, string> = {
    "h2": "qgds-heading-md",
    "h3": "qgds-heading-sm",
    "h4": "qgds-heading-xs",
    "h5": "qgds-heading-xs",
    "h6": "qgds-heading-xs",
  };

  render() {
    console.log(this);

    //Use user defined heading-display, or fallback to default class for heading level (h2, h3 etc), or finally fallback to small if something goes wrong
    let headingSizeClass =
      QGDSCallout.headingClasses[this.headingDisplay] ||
      QGDSCallout.headingDefaults[this.headingLevel] ||
      "qgds-heading-sm";

    if (!this.headingDisplay || this.headingDisplay === "Default") {
      headingSizeClass = QGDSCallout.headingDefaults[this.headingLevel] ?? "qgds-heading-sm";
    }

    return html`
      <div class="callout">
        ${semanticHeading(this.heading, this.headingLevel, `heading ${headingSizeClass}`)}

        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
