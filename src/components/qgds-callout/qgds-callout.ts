import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { semanticHeading } from "../../utils";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-callout.styles.scss?inline";

export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "xs" | "sm" | "md";

/**
 * Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120360-73541&m=dev
 * @website https://www.designsystem.qld.gov.au/components/callout
 *
 * @property {string} heading - Callout heading text
 * @property {HeadingLevel} [headingLevel="h3"] - Semantic heading level (h2-h6)
 * @property {HeadingSize} [headingSize] - Heading size provides additional control over the visual size of the heading, independent of the semantic level.
 *
 * @attribute heading - The heading attribute reflects the heading property.
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 *
 * @cssprop {color} --callout-background - Override the background color of the callout.
 * @cssprop {color} --callout-border - Override the border color of the callout.
 * @cssprop {color} --callout-text - Override the text color within the callout.
 */

@customElement("qgds-callout")
export class QGDSCallout extends LitElement {
  @property({ type: String, useDefault: true })
  heading: string = "Callout heading";

  @property({ type: String, reflect: true, attribute: "heading-level", useDefault: true })
  headingLevel: HeadingLevel = "h3";

  @property({ type: String, reflect: true, attribute: "heading-size", useDefault: false })
  headingSize?: HeadingSize;

  static styles = [baseStyles, unsafeCSS(componentCSS)];

  private static readonly headingClasses: Record<HeadingSize, string> = {
    xs: "qgds-heading-xs",
    sm: "qgds-heading-sm",
    md: "qgds-heading-md",
  };

  private static readonly headingDefaults: Record<HeadingLevel, string> = {
    h2: "qgds-heading-md",
    h3: "qgds-heading-sm",
    h4: "qgds-heading-xs",
    h5: "qgds-heading-xs",
    h6: "qgds-heading-xs",
  };

  render() {
    // Determine the heading size class based on the headingSize property, or fallback to the default for the headingLevel
    const headingSizeClass = this.headingSize
      ? QGDSCallout.headingClasses[this.headingSize]
      : QGDSCallout.headingDefaults[this.headingLevel];

    return html`
      <div class="callout">
        ${semanticHeading(this.heading, this.headingLevel, `heading ${headingSizeClass || "qgds-heading-sm"}`)}

        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-callout": QGDSCallout;
  }
}
