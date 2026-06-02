import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { classMap } from "lit/directives/class-map.js";
import { baseStyles } from "../../styles";
import { semanticHeading } from "../../utils";
import componentCSS from "./qgds-footer.styles.scss?inline";

import "../qgds-link/qgds-link.js";
import "../qgds-button/qgds-button.js";

import footerLogo from "./assets/coa-delivering-for-qld.svg?raw";

export type QGDSFooterProps = InstanceType<typeof QGDSFooter>;

/**
 * QGDS Footer component provides a site-wide footer with contact information, site links,
 * social media links, and Acknowledgement of Country.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [footerHeading="Queensland Government"] - Optional heading for the footer, typically the organisation name.
 * @property {string} [contactHeading="Contact us"] - Heading for the contact section.
 * @property {string} [contactStatement] - Optional statement text in the contact section.
 * @property {string} [contactPhone] - Optional phone number (e.g., "13 QGOV (13 74 68)").
 * @property {string} [contactEmail] - Optional email address.
 * @property {string} [socialHeading="Follow us"] - Heading for the social media section.
 * @property {string} [aocHeading="Acknowledgement of Country"] - Heading for the Acknowledgement section.
 * @property {string} copyrightLabel - Copyright text (required, e.g., "© The State of Queensland 2026").
 * @property {number} [headingLevel=2] - Semantic heading level for all section headings (2-6).
 * @property {string} [palette="default"] - Color palette applied to the footer.
 * @property {boolean} [hideFooterLogo=false] - Option to hide the footer logo.
 *
 * @slot contact-link - Links/buttons for the contact section (e.g., "Contact us" button).
 * @slot footer-custom-link - Custom links for organization-specific content.
 * @slot footer-site-link - Site information links (Help, Copyright, Disclaimer, Privacy, etc.).
 * @slot footer-social-link - Social media links with icons (Facebook, Twitter, LinkedIn, etc.).
 * @slot aoc - Acknowledgement of Country statement content.
 * @slot footer-logo - Logo image or component.
 * @slot site-main-link - Main government link (e.g., "Queensland Government").
 *
 * @cssprop {color} --footer-background - Override the footer background color.
 * @cssprop {color} --footer-text - Override the footer text color.
 * @cssprop {length} --footer-padding-block - Override the footer block padding.
 *
 * @example
 * ```html
 * <qgds-footer
 *   social-heading="Follow us"
 *   aoc-heading="Acknowledgement of Country"
 *   copyright-label="© The State of Queensland (Organisation) 2026"
 *   palette="default"
 * >
 *   <qgds-link slot="footer-site-link" href="/help">Help</qgds-link>
 *   <qgds-link slot="footer-site-link" href="/copyright">Copyright</qgds-link>
 *   <qgds-link slot="footer-social-link" href="https://facebook.com" icon-name="facebook">Facebook</qgds-link>
 *   <div slot="aoc">
 *     We pay our respects to the Aboriginal and Torres Strait Islander ancestors...
 *   </div>
 *   <img slot="footer-logo" src="/logo.png" alt="Queensland Government">
 * </qgds-footer>
 * ```
 */
@customElement("qgds-footer")
export class QGDSFooter extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  // ==========================================================================
  // PROPERTIES
  // ==========================================================================

  @property({ type: String, attribute: "footer-heading" })
  footerHeading = "Queensland Government";

  @property({ type: String, attribute: "contact-heading" })
  contactHeading = "Contact us";

  @property({ type: String, attribute: "contact-statement" })
  contactStatement = "";

  @property({ type: String, attribute: "contact-phone" })
  contactPhone = "";

  @property({ type: String, attribute: "contact-email" })
  contactEmail = "";

  @property({ type: String, attribute: "custom-links-heading" })
  customLinksHeading = "";

  @property({ type: String, attribute: "site-links-heading" })
  siteLinksHeading = "";

  @property({ type: String, attribute: "social-heading" })
  socialHeading = "Follow us";

  @property({ type: String, attribute: "aoc-heading" })
  aocHeading = "Acknowledgement of Country";

  @property({ type: String, attribute: "copyright-label" })
  copyrightLabel = "";

  @property({
    type: Number,
    attribute: "heading-level",
    converter: {
      fromAttribute: (value: string | null): number => {
        if (!value) return 2;
        const num = parseInt(value.replace(/\D/g, ""), 10);
        return num >= 2 && num <= 6 ? num : 2;
      },
      toAttribute: (value: number): string => String(value),
    },
  })
  headingLevel: number = 2;

  @property({ type: String, reflect: true })
  palette = "default";

  @property({ type: Boolean, attribute: "hide-logo" })
  hideFooterLogo = false;

  // ==========================================================================
  // STATE (Private, reactive)
  // ==========================================================================

  @state() private _hasContact = false; // Whether any contact info is provided (either links or phone/email)
  @state() private _hasContactLinks = false;
  @state() private _hasCustomLinks = false;
  @state() private _hasSiteLinks = false;
  @state() private _hasSocialLinks = false;
  @state() private _hasAocContent = false;
  @state() private _hasLogo = false;
  @state() private _hasMainLink = false;

  // ==========================================================================
  // SLOT HANDLERS
  // ==========================================================================

  private _onContactLinkSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this._hasContactLinks = slot.assignedElements().length > 0;
    this._hasContact = this._hasContactLinks || !!this.contactPhone || !!this.contactEmail;
  };

  private _onCustomLinkSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const elements = slot.assignedElements();
    this._hasCustomLinks = elements.length > 0;

    // Validate slot content
    elements.forEach((el) => {
      if (el.tagName.toLowerCase() !== "qgds-link") {
        console.warn(
          `<qgds-footer>: footer-custom-link slot should contain <qgds-link> elements. Found <${el.tagName.toLowerCase()}>. Replace with <qgds-link>.`
        );
      }
    });
  };

  private _onSiteLinkSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const elements = slot.assignedElements();
    this._hasSiteLinks = elements.length > 0;

    // Validate slot content
    elements.forEach((el) => {
      if (el.tagName.toLowerCase() !== "qgds-link") {
        console.warn(
          `<qgds-footer>: footer-site-link slot should contain <qgds-link> elements. Found <${el.tagName.toLowerCase()}>. Replace with <qgds-link>.`
        );
      }
    });
  };

  private _onSocialLinkSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const elements = slot.assignedElements();
    this._hasSocialLinks = elements.length > 0;

    // Validate slot content
    elements.forEach((el) => {
      if (el.tagName.toLowerCase() !== "qgds-link") {
        console.warn(
          `<qgds-footer>: footer-social-link slot should contain <qgds-link> elements. Found <${el.tagName.toLowerCase()}>. Replace with <qgds-link>.`
        );
      }
    });
  };

  private _onAocSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this._hasAocContent =
      slot.assignedElements().length > 0 || slot.assignedNodes().some((node) => node.textContent?.trim());
  };

  private _onLogoSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this._hasLogo = slot.assignedElements().length > 0;
  };

  private _onMainLinkSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this._hasMainLink = slot.assignedElements().length > 0;
  };

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  protected firstUpdated(): void {
    if (!this.copyrightLabel) {
      console.warn(
        '<qgds-footer>: "copyright-label" attribute is required. Please provide copyright text (e.g., "© The State of Queensland 2026").'
      );
    }
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  render() {
    // Calculate AOC column span (absorbs space from missing columns)
    // Base: 3 columns
    // + 2 if Custom Links missing
    // + 2 if Site Links missing
    // + 2 if Social Links missing
    const aocSpan = 3 + (!this._hasCustomLinks ? 2 : 0) + (!this._hasSocialLinks ? 2 : 0);
    // Cap aocSpan at 6 to prevent it from taking more than half the footer (since it should only expand into the space of missing columns)
    //const cappedAocSpan = Math.min(aocSpan, 6);

    // Entend Site Links column to 3 if both Custom Links and Social Links are missing (to avoid excessive empty space)
    //const siteLinksSpan = 2 + (!this._hasCustomLinks && !this._hasSocialLinks ? 1 : 0);

    // has- class list assigned to footer parent to help grid rendering
    const footerClassList = classMap({
      "has-contact": this._hasContact,
      "has-contact-links": this._hasContactLinks,
      "has-custom-links": this._hasCustomLinks,
      "has-site-links": this._hasSiteLinks,
      "has-social-links": this._hasSocialLinks,
      "has-aoc-content": this._hasAocContent,
      "has-logo": this._hasLogo,
      "has-main-link": this._hasMainLink,
    });

    return html`
      <footer class="qgds-footer">
        ${this.footerHeading
          ? html` ${semanticHeading(this.footerHeading, this.headingLevel, "footer-site-name")} `
          : ""}

        <div class="footer-container ${footerClassList}">
          <!-- Column 1: Contact Us -->
          <section class="section-contact no-border">
            <div>
              ${semanticHeading(this.contactHeading, this.headingLevel, "footer-heading")}
              ${this.contactStatement ? html`<p class="contact-statement">${this.contactStatement}</p>` : ""}

              <div class="contact-links-wrapper" role="list">
                <slot name="contact-link" @slotchange=${this._onContactLinkSlotChange}></slot>
              </div>

              ${this.contactPhone
                ? html`<p class="contact-detail">
                    <span class="contact-label">Phone:</span>
                    <a href="tel:${this.contactPhone.replace(/\D/g, "")}" class="contact-link">
                      ${this.contactPhone}
                    </a>
                  </p>`
                : ""}
              ${this.contactEmail
                ? html`<p class="contact-detail">
                    <span class="contact-label">Email:</span>
                    <a href="mailto:${this.contactEmail}" class="contact-link"> ${this.contactEmail} </a>
                  </p>`
                : ""}
            </div>

            <div class="contact-cta-wrapper">
              <slot name="contact-cta"></slot>
            </div>
          </section>

          <!-- Column 2: Custom Links -->
          <section class="section-custom-links">
            <nav aria-labelledby="footer-custom-heading">
              ${semanticHeading(this.customLinksHeading, this.headingLevel, "footer-heading")}
              <div class="custom-links-wrapper" role="list">
                <slot name="footer-custom-link" @slotchange=${this._onCustomLinkSlotChange}></slot>
              </div>
            </nav>
          </section>

          <!-- Column 3: Site Links -->
          <section class="section-site-links">
            <nav aria-labelledby="footer-site-heading">
              ${semanticHeading(this.siteLinksHeading, this.headingLevel, "footer-heading")}
              <div class="site-links-wrapper" role="list">
                <slot name="footer-site-link" @slotchange=${this._onSiteLinkSlotChange}></slot>
              </div>
            </nav>
          </section>

          <!-- Column 4: Social Links -->
          <section class="section-social-links">
            <nav aria-labelledby="footer-social-heading">
              ${semanticHeading(this.socialHeading, this.headingLevel, "footer-heading")}
              <div class="social-links-wrapper" role="list">
                <slot name="footer-social-link" @slotchange=${this._onSocialLinkSlotChange}></slot>
              </div>
            </nav>
          </section>

          <!-- Column 5: Acknowledgement of Country -->
          <section class="section-aoc" aria-labelledby="footer-aoc-heading">
            ${semanticHeading(this.aocHeading, this.headingLevel, "footer-heading")}

            <div class="${classMap({ "aoc-content": true, empty: !this._hasAocContent })}">
              <slot name="aoc" @slotchange=${this._onAocSlotChange}></slot>
            </div>

            <div class="${classMap({ "footer-logo": true, empty: this.hideFooterLogo })}">
              <slot name="footer-logo" @slotchange=${this._onLogoSlotChange}>
                <!-- Fallback logo if no logo provided in slot - ensures CoA is always present in footer -->
                ${this.hideFooterLogo ? "" : unsafeHTML(footerLogo)}
              </slot>
            </div>

            ${this.copyrightLabel ? html`<p class="copyright">${this.copyrightLabel}</p>` : ""}

            <div class="${classMap({ "main-link-wrapper": true, empty: !this._hasMainLink })}">
              <slot name="site-main-link" @slotchange=${this._onMainLinkSlotChange}></slot>
            </div>
          </section>
        </div>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-footer": QGDSFooter;
  }
}
