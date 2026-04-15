import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { resetStyles, elementsStyles } from "../../styles";
import componentCSS from "./qgds-tag.styles.scss?inline";
// import { ICON_NAMES } from "../qgds-icon/icon-names";
import "../qgds-icon/qgds-icon";
import { QgdsEvents } from "../../utils";
import { IconName } from "../qgds-icon/icon-names";

type Variant = "default" | "info" | "action" | "dismissible";
type Size = "sm" | "lg";

/**
 * QGDS Tag Component
 *
 * A web component for displaying tags with various styles and variants.
 * Used to label, categorize, or highlight content.
 *
 * @uikit pagination
 * @website https://www.designsystem.qld.gov.au/components/tag
 *
 * @prop {string} label - The label/text content of the tag. Required.
 * @prop {Variant} [variant = "default"] - The variant of the tag .
 * @prop {string} [href] - If provided, the tag will render as a link pointing to this URL. This will also force the action variant styling.
 * @prop {string} [target] - The target attribute for the link when href is provided (e.g., "_blank" to open in a new tab).
 * @prop {Size} [size] - The size of the tag. Default is "sm" for default and info tags, "lg" for action and removable tags.
 *
 * @cssprop --bg - The background color of the tag.
 * @cssprop --bg-hover - The hover-state background color of the tag.
 * @cssprop --bg-focus - The focus-state background color of the tag.
 * @cssprop --fg - The text color of the tag.
 * @cssprop --fg-hover - The hover-state text color of the tag.
 * @cssprop --fg-focus - The focus-state text color of the tag.
 * @cssprop --border - The border color of the tag.
 * @cssprop --border-hover - The hover-state border color of the tag.
 * @cssprop --border-focus - The focus-state border color of the tag.
 *
 * @event qgds-click - Dispatched when the variant=action tag is clicked.
 * @event qgds-dismiss - Dispatched when the remove button is clicked. detail contains the label of the tag.
 *
 * @example
 * ```html
 * <qgds-tag label="Example" variant="default"></qgds-tag>
 * ```
 *
 * @example
 * ```html
 * <qgds-tag label="Removable Tag" variant="removable"></qgds-tag>
 * ```
 */

@customElement("qgds-tag")
export class QGDSTag extends LitElement {
  @property({ type: String }) label: string = "";
  @property({ type: String }) variant: Variant = "default";
  @property({ type: String }) size?: Size;
  @property({ type: String }) href?: string;
  @property({ type: String }) target?: string;

  static styles = [
    resetStyles,
    elementsStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  private _events: QgdsEvents;

  private get _variant() {
    return this.href || this.onclick ? "action" : this.variant;
  }

  private _handleDismiss = (e: PointerEvent) => {
    const dismissEvent = this._events.create("dismiss", { label: this.label }, e);
    this._events.dispatch(dismissEvent);
    // Only remove if the event wasn't cancelled
    if (!dismissEvent.defaultPrevented) {
      this.remove();
    }
  };

  private _handleClick = (e: PointerEvent) => {
    this._events.dispatch("click", { label: this.label }, e);
  };

  constructor() {
    super();

    // Initialize events controller
    this._events = new QgdsEvents(this, { prefix: "qgds" });
  }

  render() {
    const classes = classMap({
      "qgds-tag": true,
      "is-info": this._variant === "info",
      "is-action": this._variant === "action",
      "is-lg": this.size === "lg" || this.variant === "dismissible",
    });

    const defaultIcon = "alert-cancel" satisfies IconName;
    const hoverIcon = "alert-cancel-filled" satisfies IconName;

    if (this.href) {
      return html`<a href="${this.href}" target=${ifDefined(this.target)} class="${classes}" >
        <span class="qgds-tag-label">${this.label}<span></a>`;
    }

    if (this._variant === "action") {
      return html`<button class="${classes}" @click=${this._handleClick}> <span class="qgds-tag-label">${this.label}<span></button>`;
    }

    return html`
      <div class="${classes}">
        <span class="qgds-tag-label">${this.label}</span>
        ${this._variant === "dismissible"
          ? html`
              <button
                class="qgds-tag-dismiss"
                type="button"
                aria-label="Remove ${this.label}"
                @click="${this._handleDismiss}"
              >
                <qgds-icon icon-id="${defaultIcon}" size="md" class="default-icon" aria-hidden="true"></qgds-icon>
                <qgds-icon icon-id="${hoverIcon}" size="md" class="hover-icon" aria-hidden="true"></qgds-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-tag": QGDSTag;
  }
}
