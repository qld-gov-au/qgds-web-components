import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-promotional-panel.styles.scss?inline";
import "../qgds-button/qgds-button";
import "../qgds-feature-icon/qgds-feature-icon";

export type QGDSPromotionalPanelProps = InstanceType<typeof QGDSPromotionalPanel>;

type contentAlignmentVariants = "content-left" | "content-right";
type iconType = "design" | "phone" | "email" | "chat" | "search";
type promoVariants = "indent-text" | "indent-image" | "contained" | "promo";
type promoColors = "default" | "muted" | "bold" | "deep";

/**
 * Promotional (promo) panels provide a visual break on a page and an opportunity to promote specific content.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120418-51481&m=dev
 *
 * @property {promoVariants} promoType - The type of the promotional panel
 * @property {contentAlignmentVariants} contentAlignment - The alignment of the content within the promotional panel
 * @property {iconType} icon - The type of the icon to display in the promotional panel
 * @property {promoColors} promoPalette - The color palette for the promotional panel
 *
 * @property {string} promoImage - The URL of the promotional image
 * @property {string} promoImageDescription - The alt text description for the promotional image
 * @property {string} title - The title text for the promotional panel
 * @property {string} abstract - The abstract text for the promotional panel
 *
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 *
 */
@customElement("qgds-promotional-panel")
export class QGDSPromotionalPanel extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String }) promoType: promoVariants = "indent-text";
  @property({ type: String }) contentAlignment: contentAlignmentVariants = "content-left";
  @property({ type: String }) icon: iconType = "design";
  @property({ type: String }) promoPalette: promoColors = "muted";

  @property({ type: String }) promoImage = "";
  @property({ type: String }) promoImageDescription = "";
  @property({ type: String }) title = "";
  @property({ type: String }) abstract = "";

  private get isPromo() {
    return this.promoType === "promo";
  }

  render() {
    return html`
      <section class="qgds-promo-panel ${this.promoType}">
        <div
          class="qgds-promo-panel-container ${this.contentAlignment}"
          style=${this.isPromo ? `background-image:url(${this.promoImage})` : nothing}
        >
          <!-- Image Panel -->
          <div class="image-panel">
            ${!this.isPromo
              ? html` <img class="promo-panel-image" src=${this.promoImage} alt=${this.promoImageDescription} /> `
              : html`<div class="promo-panel-image"></div>`}
          </div>

          <!-- Content Panel -->
          <div class="content-panel">
            ${this.icon
              ? html`
                  <div class="icon-container">
                    <qgds-feature-icon class="base-icon" icon-name=${this.icon}></qgds-feature-icon>
                  </div>
                `
              : nothing}

            <div class="main">
              ${this.title ? html`<h2>${this.title}</h2>` : nothing}
              ${this.abstract ? html`<div class="promo-abstract">${this.abstract}</div>` : nothing}
              <slot>
                <!-- Default content slot for additional text or HTML content -->
              </slot>
            </div>

            <!-- CTA -->
            <div class="footer-ctalinks-container">
              <slot name="footer-ctalinks">Default Footer CTA Links</slot>
            </div>

            <!-- Buttons -->
            <div class="footer-buttons-container">
              <slot name="footer-buttons">Default Footer Buttons</slot>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-promotional-panel": QGDSPromotionalPanel;
  }
}
