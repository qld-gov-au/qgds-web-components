import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-site-name.styles.scss?inline";

// ─── Types ────────────────────────────────────────────────────────────────────

export const tagName = "qgds-site-name";
export type LogoVariant = "masterbrand" | "subbrand" | "cobrand" | "endorsed" | "standalone";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * QGDS Site Name Component
 *
 * Renders the Queensland Government site name according to QGDS brand guidelines. qgds-site-name is considered a sub-component and pairs with qgds-logo and qgds-header components
 *
 * ## Variants and their structures
 * - masterbrand  → Delivering lockup OR COA + site name
 * - subbrand     → COA + site name
 * - cobrand      → COA + site name + custom logo
 * - endorsed     → COA + site name OR custom logo only
 * - standalone   → Custom logo only
 *
 * @website "https://www.designsystem.qld.gov.au/brand-foundations/site-names-and-logos"
 * @uikit   "https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=6182-30988&m=dev"
 * @tagname "qgds-site-name"
 *
 * @prop {string}      site-name-prefix     - Smaller lead text rendered above site-name
 * @prop {string}      site-name            - Main site name text
 * @prop {string}      site-name-secondary  - Secondary site name text to support co-branding lockups
 * @prop {boolean}     hide-site-name       - Visually hides site name while keeping it accessible to screen readers
 *
 * @part site-name    - The site name container
 * @part site-name-secondary - The secondary site name container
 */

@customElement(tagName)
export class QGDSSiteName extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  // ─── Public API ─────────────────────────────────────────────────────────

  @property({ type: String }) variant: string = "masterbrand";
  @property({ type: String, attribute: "site-name" }) siteName = "";
  @property({ type: String, attribute: "site-name-prefix" }) siteNamePrefix = "";
  @property({ type: String, attribute: "site-name-secondary" }) siteNameSecondary = "";
  @property({ type: Boolean, attribute: "hide-site-name" }) hideSiteName = false;

  // ─── Private getters ─────────────────────────────────────────────────────

  // ─── Dev validation ──────────────────────────────────────────────────────

  // private validate(): void {
  //   const { variant, logo, siteName, customLogo } = this;

  //   if (!variant) {
  //     warn("A `variant` attribute is required.");
  //   }

  //   if (variant !== "standalone" && logo && !isPreset(logo)) {
  //     warn(`"${logo}" is not a valid preset. Use "coa-stacked" or "coa-delivering-for-qld".`);
  //   }

  //   if ((variant === "subbrand" || variant === "masterbrand") && !siteName && !this.isDelivering) {
  //     warn(`Variant "${variant}" requires a \`site-name\` attribute.`);
  //   }

  //   if (variant === "cobrand" && !customLogo) {
  //     warn(`Variant "cobrand" requires a \`custom-logo\` attribute.`);
  //   }

  //   if (variant === "standalone" && !customLogo) {
  //     warn(`Variant "standalone" requires a \`custom-logo\` attribute.`);
  //   }

  //   if (variant === "standalone" && logo) {
  //     warn(`Variant "standalone" does not use a preset \`logo\`. The \`logo\` attribute will be ignored.`);
  //   }

  //   if (variant === "masterbrand" && customLogo) {
  //     warn(`Variant "masterbrand" does not support a \`custom-logo\`. The attribute will be ignored.`);
  //   }
  // }

  // ─── Render helpers ──────────────────────────────────────────────────────

  private renderSiteName() {
    if (!this.siteName) return nothing;

    // Delivering lockup and explicit hide both result in sr-only — visible in DOM, hidden visually
    const srOnly = this.isDelivering || this.hideSiteName;

    // Optional prefix for smaller lead-in text, e.g. "Department of" in "Department of Education"
    const prefix = this.siteNamePrefix ? html`<span class="prefix">${this.siteNamePrefix}</span>` : nothing;

    // Required main site name, e.g. "Department of Education"
    const siteNameMain = html`<span class="main" part="site-name-main">${this.siteName}</span>`;

    // Optional
    const siteNameSecondary = this.siteNameSecondary
      ? html`<span class="secondary" part="site-name-secondary">${this.siteNameSecondary}</span>`
      : nothing;

    return html`
      <div part="site-name" class="site-name ${srOnly ? "sr-only" : ""}">
        ${prefix}
        <div class="site-name-wrap">${siteNameMain} ${siteNameSecondary}</div>
      </div>
    `;
  }

  // ─── Variant layouts ─────────────────────────────────────────────────────

  // private renderByVariant() {
  //   switch (this.variant) {
  //     case "masterbrand":
  //       // Delivering lockup needs no site name visible (sr-only handled in renderSiteName)
  //       // Stacked COA always paired with site name
  //       return html`${this.renderCOA()} ${this.renderSiteName()}`;

  //     case "subbrand":
  //       // Always COA + site name, with divider
  //       return html`${this.renderCOA()} ${this.renderSiteName()}`;

  //     case "cobrand":
  //       // COA + site name + custom logo, with divider between COA/sitename and custom logo
  //       return html`${this.renderCOA()} ${this.renderSiteName()} ${this.renderCustomLogo()}`;

  //     case "endorsed":
  //       // COA + site name, OR custom logo only if no COA preset provided
  //       return this.logo ? html`${this.renderCOA()} ${this.renderSiteName()}` : this.renderCustomLogo();

  //     case "standalone":
  //       // Custom logo only — COA is not used
  //       return this.renderCustomLogo();

  //     default:
  //       warn(`Unknown variant "${this.variant}".`);
  //       return nothing;
  //   }
  // }

  // ─── Root render ─────────────────────────────────────────────────────────

  override render() {
    this.validate();

    return html`
      <div
        part="base"
        class=${classMap({
          "qgds-logo": true,
          [`is-${this.variant.toLowerCase()}`]: !!this.variant,
          "has-site-name": !!this.siteName,
          "site-name-hidden": this.hideSiteName,
          //"is-delivering": this.isDelivering,
        })}
      >
        ${this.renderSiteName()}
      </div>
    `;
  }
}

// ─── Global element registry ─────────────────────────────────────────────────

declare global {
  interface HTMLElementTagNameMap {
    "qgds-site-name": QGDSSiteName;
  }
}
