import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import componentCSS from "./qgds-button.styles.scss?inline";
import { resetStyles, animationsStyles } from "../../styles";
import { QgdsEvents } from "../../utils";

// Define types for properties to ensure type safety and better autocompletion
type ButtonVariant = "primary" | "secondary" | "tertiary";
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";

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
 * @attr {boolean} trailing-icon - Whether the icon is displayed after the label. Default is "false" (icon before label).
 * @attr {string} id - A unique ID for the button.
 * @attr {string} href - The URL the button links to (if it's a link).
 * @attr {string} loading-label - The label to display when the button is in a loading state. Default is "Loading...".
 * @attr {boolean} is-loading - Whether the button is in a loading state. Default is "false".
 * @attr {string} event-title - The title of the custom event dispatched on click.
 * @attr {string} slot="icon" - The icon slot for adding a qgds-icon to the qgds-button.
 *
 *
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
 * <qgds-button type="button" label="QGDS Button" variant="primary">
 *   <qgds-icon slot="icon" icon-id="external-link" size="md">
 *   </qgds-icon>
 * </qgds-button>
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

  @property({ type: String }) label: string = "Button";
  @property({ type: String, useDefault: true }) variant: ButtonVariant = "primary";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: String }) target?: AnchorTarget;
  @property({ type: String }) type: HTMLButtonElement["type"] = "button";
  @property({ type: String, attribute: "aria-label" }) ariaLabel: string | null = null;
  @property({ type: Boolean, reflect: true, attribute: "trailing-icon" })
  trailingIcon: boolean = false;
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
  @state() private hasIcon: boolean = false;

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

  // Render link version of the button (anchor tag with href)
  private renderLink() {
    const classes = {
      btn: true,
      loading: this.isLoading,
      [`btn-${this.variant}`]: true,
      disabled: this.disabled || this.isLoading,
      "has-icon": this.hasIcon || this.isLoading,
      "trailing-icon": this.trailingIcon,
    };

    return html`
      <a
        href=${this.href ?? "#"}
        aria-label="${ifDefined(this.ariaLabel)}"
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
          : html`<slot name="icon" @slotchange=${this.handleSlotChange}></slot>`}
        ${this.label}
      </a>
    `;
  }

  // Render button version of the button
  private renderButton() {
    const classes = {
      btn: true,
      loading: this.isLoading,
      [`btn-${this.variant}`]: true,
      "has-icon": this.hasIcon || this.isLoading,
      "trailing-icon": this.trailingIcon,
    };

    return html`
      <button
        ?disabled=${this.disabled || this.isLoading}
        type=${this.type}
        aria-label="${ifDefined(this.ariaLabel)}"
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
          : html`<slot name="icon" @slotchange=${this.handleSlotChange}></slot>`}
        ${this.isLoading ? (this.loadingLabel ?? this.label) : this.label}
      </button>
    `;
  }

  // Handle slot changes to detect if icon is present
  private handleSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const assignedElements = slot.assignedElements();
    this.hasIcon = assignedElements.length > 0;
  };

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
        label: this.label,
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
