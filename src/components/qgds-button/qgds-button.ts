import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import componentCSS from "./qgds-button.css?inline";

// Define types for properties to ensure type safety and better autocompletion
type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonType = "button" | "submit" | "reset";
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";
// type UniqueID = string; // This is used for click tracking data attribute
// type ButtonText = string;

@customElement("qgds-button")
export class QGDSButton extends LitElement {
  // Use @property decorator for declaring properties directly on the class.
  // This is the idiomatic way in Lit with TypeScript.
  // The 'static properties' getter is less common with decorators.

  @property({ type: String }) label: string = "Button";
  @property({ type: String, attribute: "button-text" }) buttonText: string =
    "test";
  @property({ type: String, reflect: true }) variant: ButtonVariant = "primary";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: String }) target: AnchorTarget | "" = "";
  @property({ type: String }) type: ButtonType = "button";
  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string = "";
  @property({ type: Boolean, reflect: true }) trailingIcon: boolean = false;
  @property({ type: String, reflect: true, attribute: "unique-id" })
  uniqueID: string | undefined = undefined;
  @property({ type: Boolean, reflect: true, attribute: "is-link" }) isLink =
    false;
  @property({ type: String, attribute: "loading-text" }) loadingText =
    "Loading...";
  @property({ type: Boolean, reflect: true, attribute: "is-loading" })
  isLoading = false;
  @property({ type: String, attribute: "event-title" }) eventTitle = "onClick";

  // Internal state management for interaction states
  @state() private _isHovered: boolean = false;
  @state() private _isActive: boolean = false;
  @state() private _isFocused: boolean = false;

  // Constructor is generally for setting up initial state that doesn't depend on attributes.
  // For properties, it's better to set default values directly on the class with the @property decorator.
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    // Check if it's a link or button
    if (this.isLink) {
      return this.renderLink();
    } else {
      return this.renderButton();
    }
  }

  // Render link version of the button
  // anchor tag with href
  private renderLink() {
    return html`
      <a
        href=${this.label}
        ?uniqueID=${ifDefined(this.uniqueID ?? undefined)}
        aria-label="${ifDefined(this.ariaLabel || undefined)}"
        class="btn ${this.isLoading ? "loading" : ""} ${ifDefined(
          "btn-" + this.variant,
        )} ${this.disabled || this.isLoading ? "disabled" : ""}"
        target="${ifDefined(this.target || undefined)}"
        tabindex="0"
        rel="no-opener"
        @click=${this._onClick.bind(this)}
        @mouseenter=${this._handleMouseEnter.bind(this)}
        @mouseleave=${this._handleMouseLeave.bind(this)}
        @mousedown=${this._handleMouseDown.bind(this)}
        @mouseup=${this._handleMouseUp.bind(this)}
        @focus=${this._handleFocus.bind(this)}
        @blur=${this._handleBlur.bind(this)}
      >
        <slot name="icon"></slot>
        ${this.buttonText}
      </a>
    `;
  }

  // Render button version of the button
  private renderButton() {
    return html`
      <button
        ?disabled=${this.disabled || this.isLoading}
        type=${this.type}
        ?uniqueID=${ifDefined(this.uniqueID ?? undefined)}
        aria-label="${ifDefined(this.ariaLabel || undefined)}"
        class="btn ${this.isLoading ? "loading" : ""} ${ifDefined(
          "btn-" + this.variant,
        )}"
        title=${this.buttonText}
        @click=${this._onClick.bind(this)}
        tabindex="0"
        @mouseenter=${this._handleMouseEnter.bind(this)}
        @mouseleave=${this._handleMouseLeave.bind(this)}
        @mousedown=${this._handleMouseDown.bind(this)}
        @mouseup=${this._handleMouseUp.bind(this)}
        @focus=${this._handleFocus.bind(this)}
        @blur=${this._handleBlur.bind(this)}
      >
        ${this.isLoading
          ? html`<span class="icon-loading"></span>`
          : html`<slot name="icon"></slot>`}
        ${this.isLoading
          ? (this.loadingText ?? this.buttonText)
          : this.buttonText}
      </button>
    `;
  }

  // State management handlers
  private _handleMouseEnter() {
    if (!this.disabled && !this.isLoading) {
      this._isHovered = true;
    }
  }

  private _handleMouseLeave() {
    this._isHovered = false;
    this._isActive = false;
  }

  private _handleMouseDown() {
    if (!this.disabled && !this.isLoading) {
      this._isActive = true;
    }
  }

  private _handleMouseUp() {
    this._isActive = false;
  }

  private _handleFocus() {
    if (!this.disabled && !this.isLoading) {
      this._isFocused = true;
    }
  }

  private _handleBlur() {
    this._isFocused = false;
  }

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

  private _onClick() {
    const myButtonEvent = new CustomEvent(this.eventTitle, {
      bubbles: true,
      composed: true,
      detail: {
        eventTitle: this.eventTitle,
        uniqueID: this.uniqueID ?? null,
        buttonText: this.buttonText,
        variant: this.variant,
      },
    });
    this.dispatchEvent(myButtonEvent);
    // Add tracking event dispatch here if needed
  }
}
