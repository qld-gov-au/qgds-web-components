import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import componentCSS from "./qgds-details.styles.scss?inline";
import { baseStyles } from "../../styles";

import "../qgds-icon/qgds-icon.js";

import { QgdsEvents } from "../../utils/events/event-controller";

type DetailsSize = "xs" | "sm" | "md" | "lg";

/**
 * Used to progressively disclose content behind a native browser details/summary disclosure widget.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [summary-text] - The visible label shown in the summary trigger.
 * @property {DetailsSize} [size] - Size variant controlling height and font size ("xs", "sm", "md", "lg"). Default is "sm".
 *
 * @slot - Default slot accepts general typographic HTML content (paragraphs, lists, links).
 *
 * @cssprop {color} --summary-color - Override the summary text color.
 * @cssprop {color} --summary-icon-color - Override the chevron icon color.
 * @cssprop {color} --summary-bg-hover - Override the summary hover background color.
 * @cssprop {color} --summary-icon-hover - Override the chevron icon color on hover.
 * @cssprop {color} --content-color - Override the content text color.
 *
 * @event qgds-toggle - Emitted when the details is toggled open or closed. Event payload includes `{ component: "qgds-details", id: string | null, open: boolean }`.
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
  private events: QgdsEvents = new QgdsEvents(this);

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, attribute: "summary-text", useDefault: true })
  summaryText: string = "Summary";

  @property({ type: String, useDefault: true })
  size: DetailsSize = "sm";

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string | null = null;

  /** Internal open/closed state — toggled by native browser interaction */
  @state() private _open: boolean = false;

  /**
   * Event handler for the native toggle event on the <details> element.
   * Syncs the internal open state and emits a custom "qgds-toggle" event with relevant details.
   */

  private handleToggle = (originalEvent: Event): void => {
    const detailsEl = originalEvent.currentTarget as HTMLDetailsElement | null;
    this._open = Boolean(detailsEl?.open);

    // Keep event detail limited, avoid bloating logs, and consider PII and privacy risks
    this.events.dispatch(
      "toggle",
      {
        id: this.id || null, // Include the id if it exists, otherwise null
        open: this._open, // boolean indicating whether the details is now open or closed
      },
      originalEvent // pass the original toggle event for reference in handlers
    );
  };

  render() {
    return html`
      <details ?open=${this._open} @toggle=${this.handleToggle}>
        <summary aria-label=${ifDefined(this.ariaLabel ?? undefined)}>
          <div>
            <span class="icon">
              <qgds-icon icon-id="chevron-right" size="sm"></qgds-icon>
            </span>
            <span class="text">${this.summaryText}</span>
          </div>
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
