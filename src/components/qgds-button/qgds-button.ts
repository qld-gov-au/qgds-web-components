import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import componentCSS from "./qgds-button.styles.scss?inline";
import { resetStyles, animationsStyles } from "../../styles";
import { QgdsEvents } from "../../utils";
import type { IconName } from "../qgds-icon/icon-names";

// Define types for properties to ensure type safety and better autocompletion
type ButtonVariant = "primary" | "secondary" | "tertiary";
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";
type IconPosition = "leading" | "trailing";

/**
 * QGDS Button Component
 *
 * A web component for displaying buttons with various styles and states.
 * Supports primary, secondary, and tertiary variants.
 * Can include icons and handle loading states.
 * Accessible via aria-labels and keyboard interactions.
 *
 * @attr {string} label - The label of the button.
 * @attr {ButtonVariant} variant - The variant of the button ("primary", "secondary", "tertiary").  Default is "primary"
 * @attr {boolean} disabled - Whether the button is disabled.  Default is "false"
 * @attr {AnchorTarget} target - The target for the link ("_self", "_blank", "_parent", "_top"). Default is "_self"
 * @attr {ButtonType} [type="button"] - The type of the button ("button", "submit", "reset"). Default is "button"
 * @attr {string} aria-label - The aria-label for the button for accessibility.
 * @attr {IconName} icon-name - The qgds-icon icon-id rendered in shadow DOM when provided.
 * @attr {IconPosition} icon-position - The position of the icon relative to the label ("leading", "trailing"). Default is "leading".
 * @attr {string} id - A unique ID for the button.
 * @attr {string} href - The URL the button links to (if it's a link).
 * @attr {string} loading-label - The label to display when the button is in a loading state. Default is "Loading...".
 * @attr {boolean} is-loading - Whether the button is in a loading state. Default is "false".
 * @attr {string} event-title - The title of the custom event dispatched on click.
 * @cssprop --btn-border-colour - The color of the button border.
 * @cssprop --btn-text - The color of the button text.
 *
 * @event qgds-click - Fires when the button is clicked.
 * @event qgds-focus - Fires when the button receives focus.
 * @event qgds-blur - Fires when the button loses focus.
 * @event qgds-mouseenter - Fires when the mouse enters the button.
 * @event qgds-mouseleave - Fires when the mouse leaves the button.
 * @event qgds-mousedown - Fires when the mouse button is pressed down on the button.
 * @event qgds-mouseup - Fires when the mouse button is released on the button.
 *
 * @example
 * ```html
 * <qgds-button type="button" label="QGDS Button" variant="primary" icon-name="external-link"></qgds-button>
 * ```
 */

export type QGDSButtonProps = InstanceType<typeof QGDSButton>;

@customElement("qgds-button")
export class QGDSButton extends LitElement {
  constructor() {
    super();

    // Initialize events controller
    this._events = new QgdsEvents(this, { prefix: "qgds" });
  }

  @property({ type: String }) label: string = "";
  @property({ type: String, useDefault: true }) variant: ButtonVariant = "primary";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: String }) target?: AnchorTarget;
  @property({ type: String }) type: HTMLButtonElement["type"] = "button";
  @property({ type: String, attribute: "aria-label" }) ariaLabel: string | null = null;
  @property({ type: String, attribute: "icon-name" }) iconName?: IconName;
  @property({ type: String, reflect: true, attribute: "icon-position" })
  iconPosition: IconPosition = "leading";
  @property({ type: String, reflect: true, attribute: "id" })
  uniqueID?: string;
  @property({ type: String, reflect: true, attribute: "href" })
  href?: string;
  @property({ type: String, attribute: "loading-label" }) loadingLabel = "Loading...";
  @property({ type: Boolean, reflect: true, attribute: "is-loading" })
  isLoading = false;

  // Internal state management for interaction states
  @state() private _isHovered: boolean = false;
  @state() private _isActive: boolean = false;
  @state() private _isFocused: boolean = false;

  static styles = [
    resetStyles,
    animationsStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    // Check if it's a link or button
    if (this.href !== undefined) {
      return this.renderLink();
    } else {
      return this.renderButton();
    }
  }

  private get hasExplicitLabel(): boolean {
    return this.hasAttribute("label") || this.label.trim().length > 0;
  }

  /* Render the label for the button, prioritizing the explicit label, then slotted text, and finally null if neither is present. */
  private renderLabel() {
    /* If the button has an explicit label attribute, we render it directly. */
    if (this.hasExplicitLabel) {
      return this.label;
    }

    // Else, we return a slot, and anything between the opening and closing tags will be used as button content. Accepts any HTML content, including text and icons. If no content is provided, the button will be empty.
    return html`<slot></slot>`;
  }

  /* Return the label to be used in the event detail, prioritizing the explicit label, then slotted text, and finally null if neither is present. */
  private get eventLabel(): string | null {
    if (this.hasExplicitLabel) {
      return this.label;
    }

    const slottedText = this.textContent?.trim();
    return slottedText && slottedText.length > 0 ? slottedText : null;
  }

  // Render link version of the button (anchor tag with href)
  private renderLink() {
    const classes = {
      btn: true,
      loading: this.isLoading,
      [`btn-${this.variant}`]: true,
      disabled: this.disabled || this.isLoading,
      "has-icon": !!this.iconName || this.isLoading,
    };

    return html`
      <a
        href=${this.href ?? "#"}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        class=${classMap(classes)}
        target="${ifDefined(this.target)}"
        tabindex="${this.disabled || this.isLoading ? -1 : 0}"
        rel="${this.target === "_blank" ? "noopener noreferrer" : ifDefined(undefined)}"
        @click=${this._handleClick}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
      >
        ${this.isLoading
          ? html`<qgds-icon icon-id="spinner-step-1" size="md"></qgds-icon>`
          : html`${this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : null}`}
        ${this.renderLabel()}
      </a>
    `;
  }

  // Render button version of the button
  private renderButton() {
    const classes = {
      btn: true,
      loading: this.isLoading,
      [`btn-${this.variant}`]: true,
      "has-icon": !!this.iconName || this.isLoading,
    };

    return html`
      <button
        ?disabled=${this.disabled || this.isLoading}
        type=${this.type}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        class=${classMap(classes)}
        tabindex="0"
        @click=${this._handleClick}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @mousedown=${this._handleMouseDown}
        @mouseup=${this._handleMouseUp}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
      >
        ${this.isLoading
          ? html`<qgds-icon icon-id="spinner-step-1" size="md"></qgds-icon>`
          : html`${this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : null}`}
        ${this.isLoading ? (this.loadingLabel ?? this.label) : this.renderLabel()}
      </button>
    `;
  }

  // State management handlers
  private _handleMouseEnter = (): void => {
    if (!this.disabled && !this.isLoading) {
      this._isHovered = true;
    }
  };

  private _handleMouseLeave = (): void => {
    this._isHovered = false;
    this._isActive = false;
  };

  private _handleMouseDown = (): void => {
    if (!this.disabled && !this.isLoading) {
      this._isActive = true;
    }
  };

  private _handleMouseUp = (): void => {
    this._isActive = false;
  };

  private _handleFocus = (): void => {
    if (!this.disabled && !this.isLoading) {
      this._isFocused = true;
    }
  };

  private _handleBlur = (): void => {
    this._isFocused = false;
  };

  // Getter for combined button state
  get buttonState() {
    return {
      isHovered: this._isHovered,
      isActive: this._isActive,
      isFocused: this._isFocused,
      isDisabled: this.disabled,
      isLoading: this.isLoading,
    };
  }

  private _events: QgdsEvents;

  private _handleClick = (e: PointerEvent) => {
    if (this.disabled || this.isLoading) {
      e.preventDefault();
      return;
    }

    this._events.dispatch(
      "click",
      {
        id: this.uniqueID ?? null,
        href: this.href,
        label: this.eventLabel,
        variant: this.variant,
      },
      e
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-button": QGDSButton;
  }
}
