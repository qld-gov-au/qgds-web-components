import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

// Make sure 'componentCSS' is correctly typed.
// If your vite config's `?inline` import truly provides a string, this is correct.
import componentCSS from "./qgds-button.css?inline";

// Define types for properties to ensure type safety and better autocompletion
type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonType = "button" | "submit" | "reset";
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";
type UniqueID = string; // This is used for click tracking data attribute
type ButtonText = string;

@customElement("qgds-button")
export class QGDSButton extends LitElement {
  // Use @property decorator for declaring properties directly on the class.
  // This is the idiomatic way in Lit with TypeScript.
  // The 'static properties' getter is less common with decorators.

  @property({ type: String }) label: string = "Button";
  @property({ type: String, attribute: "button-text" }) buttonText: ButtonText =
    "test";
  @property({ type: String, reflect: true }) variant: ButtonVariant = "primary";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: String }) target: AnchorTarget | "" = "";
  @property({ type: String }) type: ButtonType = "button";
  @property({ type: String, attribute: "aria-label" }) ariaLabel: string = "";
  @property({ type: Boolean, reflect: true }) trailingIcon: boolean = false;
  @property({ type: String, reflect: true, attribute: "unique-id" })
  uniqueID: UniqueID | undefined = undefined;
  @property({ type: Boolean, reflect: true, attribute: "is-link" }) isLink =
    false;
  @property({ type: String, attribute: "loading-text" }) loadingText =
    "Loading...";
  @property({ type: Boolean, reflect: true, attribute: "is-loading" })
  isLoading = false;
  @property({ type: String, attribute: "event-title" }) eventTitle = "onClick";

  // Corrected property for palette, as your constructor had 'palette' and then 'variant' again.
  // Assuming 'palette' is intended to be a separate attribute for themes.
  // @property({ type: String, reflect: true })

  // Constructor is generally for setting up initial state that doesn't depend on attributes.
  // For properties, it's better to set default values directly on the class with the @property decorator.
  // super() must still be called.
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    // Loading state takes precedence
    if (this.isLoading) {
      return this.renderLoadingButton();
    }

    // Then check if it's a link or button
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
        type="button"
        ?uniqueID=${ifDefined(this.uniqueID ?? undefined)}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        class="btn ${ifDefined("btn-" + this.variant)} ${this.disabled
          ? "disabled"
          : ""}"
        title=${this.buttonText}
        target=${ifDefined(this.target ?? undefined)}
        tabindex="0"
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
        ?disabled=${this.disabled}
        type=${this.type}
        ?uniqueID=${ifDefined(this.uniqueID ?? undefined)}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        class="btn ${ifDefined("btn-" + this.variant)}"
        title=${this.buttonText}
        @click=${this._onClick.bind(this)}
        tabindex="0"
      >
        <slot name="icon"></slot>
        ${this.buttonText}
      </button>
    `;
  }

  // Render loading state of the button
  private renderLoadingButton() {
    return html`
      <button
        ?disabled=${this.disabled}
        type=${this.type}
        ?uniqueID=${ifDefined(this.uniqueID ?? undefined)}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        class="btn loading ${ifDefined("btn-" + this.variant)} "
        title=${this.buttonText}
        @click=${this._onClick.bind(this)}
        tabindex="0"
      >
        <span class="icon-loading"></span>
        ${this.loadingText}
      </button>
    `;
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
