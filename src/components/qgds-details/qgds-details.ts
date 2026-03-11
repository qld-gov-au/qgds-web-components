import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import componentCSS from "./qgds-details.styles.scss?inline";
import { baseStyles } from "../../styles";

import "../qgds-icon/qgds-icon.js";

export type DetailsSize = "xs" | "sm" | "md" | "lg";

/**
 * Used to progressively disclose content behind a native browser details/summary disclosure widget.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 * @website https://www.designsystem.qld.gov.au/components/details
 * @tagname qgds-details
 *
 * @attribute {string} summary-text - The visible label shown in the summary trigger.
 * @attribute {DetailsSize} size - Size variant controlling height and font size ("xs", "sm", "md", "lg"). Default is "md".
 *
 * @slot - Default slot accepts general typographic HTML content (paragraphs, lists, links).
 *
 * @cssprop {color} --summary-color - Override the summary text color.
 * @cssprop {color} --summary-icon-color - Override the chevron icon color.
 * @cssprop {color} --summary-bg-hover - Override the summary hover background color.
 * @cssprop {color} --summary-icon-hover - Override the chevron icon color on hover.
 * @cssprop {color} --content-color - Override the content text color.
 *
 * @example
 * ```html
 * <qgds-details summary-text="More information" size="md">
 *   <p>Hidden content revealed when the summary is activated.</p>
 * </qgds-details>
 * ```
 */
@customElement("qgds-details")
export class QGDSDetails extends LitElement {
  @property({ type: String, attribute: "summary-text", useDefault: true })
  summaryText: string = "Summary";

  @property({ type: String, useDefault: true })
  size: DetailsSize = "md";

  /** Internal open/closed state — toggled by native browser interaction */
  @state() private _open: boolean = false;

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    return html`
      <details ?open=${this._open} @toggle=${this._handleToggle}>
        <summary class="summary">
          <span class="icon">
            <qgds-icon icon-id="chevron-right" size="sm"></qgds-icon>
          </span>
          <span class="text">${this.summaryText}</span>
        </summary>
        <div class="content">
          <slot></slot>
        </div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-details": QGDSDetails;
  }
}
