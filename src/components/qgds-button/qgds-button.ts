import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

// Make sure 'componentCSS' is correctly typed.
// If your vite config's `?inline` import truly provides a string, this is correct.
import componentCSS from "./qgds-button.css?inline";

// console.log("Type of componentCSS:", typeof componentCSS);
// console.log("Value of componentCSS:", componentCSS);

// Define types for properties to ensure type safety and better autocompletion
type ButtonVariant = "default" | "bold" | "strong" | "dark" | "alt" | "tint";
type ButtonSize = "medium" | "large";
type ButtonPalette = "" | "primary" | "secondary" | "tertiary"; // Renamed from 'variant' in constructor to avoid confusion
type ButtonType = "button" | "submit" | "reset";
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";

@customElement("qgds-button")
export class QGDSButton extends LitElement {
  // Use @property decorator for declaring properties directly on the class.
  // This is the idiomatic way in Lit with TypeScript.
  // The 'static properties' getter is less common with decorators.

  @property({ type: String })
  label: string = "Button";

  @property({ type: String, reflect: true })
  variant: ButtonVariant = "default"; // Renamed this from 'palette' as per your original 'variant' property

  @property({ type: String, reflect: true })
  size: ButtonSize = "medium";

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String })
  href: string = "";

  @property({ type: String })
  target: AnchorTarget | "" = "";

  @property({ type: String })
  type: ButtonType = "button";

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string = "";

  // Corrected property for palette, as your constructor had 'palette' and then 'variant' again.
  // Assuming 'palette' is intended to be a separate attribute for themes.
  @property({ type: String, reflect: true })
  palette: ButtonPalette = ""; // e.g., "primary", "secondary", "tertiary"

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
    css`
      button,
      a {
        font-family: var(--qgds-font-family);
        background-color: var(--button-background, #007bff);
        color: var(--button-text, white);
        border: var(--button-border-width) solid
          var(--button-border-color, #007bff);
        border-radius: var(--border-radius, 4px);
        padding-block: 0.5rem;
        padding-inline: 1rem;
        text-decoration: var(--button-text-decoration, none);

        transition:
          background-color 0.2s ease-in-out,
          border-color 0.2s ease-in-out,
          color 0.2s ease-in-out;
      }

      button:hover,
      a:hover {
        text-decoration: var(--button-text-decoration-hover, underline);
      }

      button[disabled],
      a[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
        background-color: var(--button-disabled-background, #cccccc);
        color: var(--button-disabled-text, #666666);
        border-color: var(--button-disabled-border-color, #999999);
      }

      /* Styles for different sizes (medium, large) */
      :host([size="large"]) button,
      :host([size="large"]) a {
        padding-block: 0.75rem;
        padding-inline: 1.5rem;
        font-size: 1.1rem;
      }

      /* Styles for different variants (default, bold, strong, dark, alt, tint) */
      /* These would typically be defined in qgds-button.css using custom properties */
      /* Example for a 'bold' variant: */
      :host([variant="bold"]) button,
      :host([variant="bold"]) a {
        font-weight: bold;
      }

      /* Styles for different palettes (primary, secondary, tertiary) */
      /* These would also typically be defined in qgds-button.css */
      /* Example for a 'primary' palette: */
      :host([palette="primary"]) button,
      :host([palette="primary"]) a {
        background-color: var(--palette-primary-background);
        color: var(--palette-primary-text);
      }
    `,
  ];

  render() {
    const content = html` <slot>${this.label}</slot> `;

    return this.href
      ? html`
          <a
            part="button"
            href=${this.href}
            target=${ifDefined(this.target || undefined)}
            aria-label=${ifDefined(this.ariaLabel || undefined)}
            palette=${ifDefined(this.palette || undefined)}
            variant=${ifDefined(this.variant || undefined)}
          >
            ${content}
          </a>
        `
      : html`
          <button
            part="button"
            ?disabled=${this.disabled}
            type=${this.type}
            aria-label=${ifDefined(this.ariaLabel || undefined)}
            palette=${ifDefined(this.palette || undefined)}
            variant=${ifDefined(this.variant || undefined)}
          >
            ${content}
          </button>
        `;
  }
}
