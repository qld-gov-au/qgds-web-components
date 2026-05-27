import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-logo.styles.scss?inline";
import fallbackLogoSVG from "./assets/coa-stacked.svg?raw";

export const tagName = "qgds-logo";

/**
 * QGDS Logo Component
 *
 * Displays the Queensland Government logo with optional site name and brand variants.
 * Supports both image sources and custom SVG content via slots.
 * If no src or slot content is provided, displays the Queensland Coat of Arms as an inline SVG fallback,
 * which can be styled using currentColor and CSS custom properties.
 *
 * @website "https://www.designsystem.qld.gov.au/brand-foundations/site-names-and-logos"
 * @uikit "https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=6182-30988&m=dev"
 * @tagname "qgds-logo"
 *
 * @prop {string} variant - Brand variant: masterbrand, subbrand, co-brand, endorsed, standalone
 * @prop {string} src - Image source URL (preferably SVG). If not provided, uses inline fallback SVG.
 * @prop {string} alt - Alternative text for the logo image
 * @prop {string} site-name - Site name text
 * @prop {boolean} hide-site-name - Hide the site name text
 * @prop {boolean} hide-image - Hide the logo image (useful for mobile responsive)
 *
 * @slot image - Custom logo image content (SVG recommended). Overrides src and fallback.
 *
 * @fires qgds-logo-loaded - Emitted when the logo image loads successfully (only for img src)
 *
 */
@customElement(tagName)
export class QGDSLogo extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String }) variant: "masterbrand" | "subbrand" | "co-brand" | "endorsed" | "standalone" =
    "masterbrand";
  @property({ type: String }) src = "";
  @property({ type: String }) alt = "Queensland Government logo";
  @property({ type: String, attribute: "site-name" }) siteName = "";
  @property({ type: Boolean, attribute: "hide-site-name" }) hideSiteName = false;
  @property({ type: Boolean, attribute: "hide-image" }) hideImage = false;

  private handleImageLoad = () => {
    this.dispatchEvent(
      new CustomEvent("qgds-logo-loaded", {
        bubbles: true,
        composed: true,
      })
    );
  };

  private renderImage() {
    if (this.hideImage) return null;

    // If src is provided, use img element
    if (this.src) {
      return html`
        <div class="qgds-logo-image" role="img" aria-label="${this.alt}">
          <slot name="image">
            <img src="${this.src}" alt="${this.alt}" @load=${this.handleImageLoad} />
          </slot>
        </div>
      `;
    }

    // Otherwise inline the fallback SVG (allows CSS styling with currentColor)
    return html`
      <div class="qgds-logo-image" role="img" aria-label="${this.alt}">
        <slot name="image">${unsafeSVG(fallbackLogoSVG)}</slot>
      </div>
    `;
  }

  private renderSiteName() {
    if (this.hideSiteName || !this.siteName) {
      return null;
    }

    return html`
      <div class="qgds-logo-site-name">
        <div class="qgds-logo-site-name-main">${this.siteName}</div>
      </div>
    `;
  }

  render() {
    return html`
      <div
        class=${classMap({
          "qgds-logo": true,
          [`qgds-logo--${this.variant}`]: !!this.variant,
          "qgds-logo--has-site-name": !this.hideSiteName && !!this.siteName,
          "qgds-logo--image-hidden": this.hideImage,
        })}
        role="banner"
        aria-label="${ifDefined(this.siteName || undefined)}"
      >
        ${this.renderImage()} ${this.renderSiteName()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-logo": QGDSLogo;
  }
}
