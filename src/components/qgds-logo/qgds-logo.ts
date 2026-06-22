import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-logo.styles.scss?inline";

// Preset logos
import coaStackedSVG from "./assets/coa-stacked.svg?raw";
import coaDeliveringSVG from "./assets/coa-delivering-for-qld.svg?raw";

export const tagName = "qgds-logo";
export type LogoVariant = "masterbrand" | "subbrand" | "cobrand" | "endorsed" | "standalone";
export type LogoPreset = "coa-stacked" | "coa-delivering-for-qld";

const presetLogos: Record<LogoPreset, string> = {
  "coa-stacked": coaStackedSVG,
  "coa-delivering-for-qld": coaDeliveringSVG,
};

/**
 * QGDS Logo Component
 *
 * Renders the Queensland Government logo lockup according to QGDS brand guidelines.
 * The `variant` attribute drives the rendering structure — and helps pair this component with the qgds-site-name element.
 *
 * @website "https://www.designsystem.qld.gov.au/brand-foundations/site-names-and-logos"
 * @uikit   "https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=6182-30988&m=dev"
 * @tagname "qgds-logo"
 *
 * @prop {LogoPreset}  logo                 - Preset COA logo: "coa-stacked" | "coa-delivering-for-qld"
 * @prop {string}      alt                  - Accessible label for the preset COA SVG
 * @prop {string}      href                 - Optional URL. Wraps the COA image in a link
 * @prop {string}      aria-label           - Accessible label for the href link. Falls back to site-name
 * @prop {string}      custom-logo         - URL for a custom logo image (cobrand, endorsed, standalone)
 * @prop {string}      custom-logo-alt     - Accessible label for the custom logo image
 *
 * @cssprop {color} --logo-divider-color  - Divider color used in cobrand variant
 * @cssprop {color} --logo-color - Color applied to the preset COA SVG
 */

@customElement(tagName)
export class QGDSLogo extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  // ─── Public API ─────────────────────────────────────────────────────────
  @property({ type: String }) logo: string = "coa-delivering-for-qld";
  @property({ type: String }) alt = "";
  @property({ type: String, attribute: "href" }) href = "";
  @property({ type: String, attribute: "aria-label" }) label = "";
  @property({ type: String, attribute: "custom-logo" }) customLogo = "";
  @property({ type: String, attribute: "custom-logo-alt" }) customLogoAlt = "";

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  private isPreset(value: string): value is LogoPreset {
    return value in presetLogos;
  }

  // ─── Render helpers ──────────────────────────────────────────────────────

  private renderPresetLogo() {
    if (!this.logo || !this.isPreset(this.logo)) return nothing;

    const svg = presetLogos[this.logo];
    const image = html`
      <div part="image" class="logo-image" role="img" aria-label="${ifDefined(this.alt || undefined)}">
        ${unsafeSVG(svg)}
      </div>
    `;

    return this.href
      ? html`<a href="${this.href}" class="logo-link" aria-label=${ifDefined(this.label || undefined)}>${image}</a>`
      : image;
  }

  private renderCustomLogo() {
    if (!this.customLogo) return nothing;

    const image = html` <img src="${this.customLogo}" alt="${this.customLogoAlt}" /> `;

    return html`
      <div part="custom-logo" class="logo-image-custom">
        ${this.href
          ? html`<a href="${this.href}" class="logo-link" aria-label=${ifDefined(this.label || undefined)}>${image}</a>`
          : image}
      </div>
    `;
  }

  // ─── Root render ─────────────────────────────────────────────────────────

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          "qgds-logo": true,
          "is-delivering": this.logo === "coa-delivering-for-qld",
          "is-custom": this.customLogo,
        })}
      >
        ${this.renderPresetLogo()} ${this.renderCustomLogo()}
      </div>
    `;
  }
}

// ─── Global element registry ─────────────────────────────────────────────────

declare global {
  interface HTMLElementTagNameMap {
    "qgds-logo": QGDSLogo;
  }
}
