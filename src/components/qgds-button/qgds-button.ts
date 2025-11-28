import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

// Make sure 'componentCSS' is correctly typed.
// If your vite config's `?inline` import truly provides a string, this is correct.
import componentCSS from "./qgds-button.css?inline";

console.log("Type of componentCSS:", typeof componentCSS);
console.log("Value of componentCSS:", componentCSS);

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
  target: AnchorTarget = "_self";

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
        all: unset; /* Resets all browser default styles */
        cursor: pointer;
        
        display: inline-flex; /* Ensures content respects padding/borders */
        justify-content: center;
        align-items: center;
        text-align: center; /* For text alignment */

        background-color: var(--button-background,#007bff); /* Fallback value */

        color: var(--button-text, white); /* Fallback value */
        border: 2px solid var(--button-border-color, #007bff); /* Fallback value */
        border-radius: var(--border-radius, 4px); /* Fallback value */
        padding: 0.5rem 1rem;
        text-decoration: var(--button-text-decoration, none);
        box-sizing: border-box; /* Include padding and border in the element's total width and height */
        font-family: inherit; /* Inherit font from parent */
        font-size: inherit; /* Inherit font size from parent */
        line-height: 1; /* Adjust line height for consistent button height */
        transition:
          background-color 0.2s ease-in-out,
          border-color 0.2s ease-in-out,
          color 0.2s ease-in-out; /* Smooth transitions */
      }

      button:hover,
      a:hover {
        text-decoration: var(--button-text-decoration-hover, underline);
      }

      button[disabled],
      a[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
        /* Optionally, override colors for disabled state */
        background-color: var(--button-disabled-background, #cccccc);
        color: var(--button-disabled-text, #666666);
        border-color: var(--button-disabled-border-color, #999999);
      }

      /* Styles for different sizes (medium, large) */
      :host([size="large"]) button,
      :host([size="large"]) a {
        padding: 0.75rem 1.5rem; /* Larger padding */
        font-size: 1.1rem; /* Larger font size */
      }

      /* Styles for different variants (default, bold, strong, dark, alt, tint) */
      /* These would typically be defined in qgds-button.css using custom properties */
      /* Example for a 'bold' variant: */
      :host([variant="bold"]) button,
      :host([variant="bold"]) a {
        font-weight: bold;
        /* Potentially different colors */
        /* background-color: var(--button-bold-background); */
        /* color: var(--button-bold-text); */
      }

      /* Styles for different palettes (primary, secondary, tertiary) */
      /* These would also typically be defined in qgds-button.css */
      /* Example for a 'primary' palette: */
      :host([palette="primary"]) button,
      :host([palette="primary"]) a {
        /* background-color: var(--palette-primary-background); */
        /* color: var(--palette-primary-text); */
      }
    `,
  ];

  render() {
    const content = html` <slot>${this.label}</slot> `;

    return this.href
      ? html`
          <a
            part="button"
            ?disabled=${this.disabled}
            href=${this.href}
            target=${this.target}
            aria-label=${this.ariaLabel || ""}
            palette=${this.palette || ""}
            variant=${this.variant || ""}>
            ${content}
          </a>
        `
      : html`
          <button
            part="button"
            ?disabled=${this.disabled}
            type=${this.type}
            aria-label=${this.ariaLabel || ""}
            ?palette=${this.palette || undefined}
            variant=${this.variant || undefined}>
            ${content}
          </button>
        `;
  }
}
