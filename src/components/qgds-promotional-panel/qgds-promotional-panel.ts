import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-promotional-panel.styles.scss?inline";

import "../qgds-feature-icon/qgds-feature-icon";
import { semanticHeading } from "../../utils";

export type QGDSPromotionalPanelProps = InstanceType<typeof QGDSPromotionalPanel>;

type ContentAlignments = "content-start" | "content-end";
type IconTypes = "design" | "phone" | "email" | "chat" | "search";
type Variants = "indent-text" | "indent-image" | "contained" | "promo";
type HeadingLevels = "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Promotional (promo) panels provide a visual break on a page and an opportunity to promote specific content.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120418-51481&m=dev
 *
 * @attribute {Variants} variant - The type of the promotional panel
 * @attribute {ContentAlignments} [contentAlignment] - The alignment of the content within the promotional panel
 * @attribute {IconTypes} [iconName] - The type of the icon to display in the promotional panel. Refer to qgds-icon for available icons
 * @attribute {HeadingLevels} [headingLevel] - The semantic level of the heading (h2, h3, h4, h5, h6)
 *
 * @attribute {string} imageUrl - The URL of the promotional image
 * @attribute {string} imageDescription - The alt text description for the promotional image
 * @attribute {string} heading - The heading text for the promotional panel
 * @attribute {string} abstract - The abstract text for the promotional panel
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

  @property({ type: String, attribute: "variant" }) variant: Variants = "indent-text";
  @property({ type: String, attribute: "content-alignment" }) contentAlignment: ContentAlignments = "content-start";
  @property({ type: String, attribute: "icon-name" }) iconName: IconTypes = "design";

  @property({ type: String, attribute: "heading-level", useDefault: true }) headingLevel: HeadingLevels = "h2";
  @property({ type: String, attribute: "image-url" }) imageUrl = "";
  @property({ type: String, attribute: "image-description" }) imageDescription = "";
  @property({ type: String, attribute: "heading" }) heading = "";
  @property({ type: String, attribute: "abstract" }) abstract = "";

  private get isPromo() {
    return this.variant === "promo";
  }

  render() {
    return html`
      <section class="promo-panel is-${this.variant}">
        <div
          class="container ${this.contentAlignment}"
          style=${this.isPromo ? `background-image:url(${this.imageUrl})` : nothing}
        >
          <!-- Image Panel -->
          <div class="image-panel">
            ${!this.isPromo
              ? html` <img class="panel-image" src=${this.imageUrl} alt=${this.imageDescription} /> `
              : html`<div class="panel-image"></div>`}
          </div>

          <!-- Content Panel -->
          <div class="content-panel">
            ${this.iconName
              ? html`
                  <div class="icon-container">
                    <qgds-feature-icon class="base-icon" icon-name=${this.iconName}></qgds-feature-icon>
                  </div>
                `
              : nothing}

            <div class="main">
              ${semanticHeading(this.heading, this.headingLevel, "title")}
              ${this.abstract ? html`<div class="promo-abstract">${this.abstract}</div>` : nothing}
              <slot>
                <!-- Default content slot for additional text or HTML content -->
              </slot>
            </div>

            <!-- CTA -->
            <div class="footer-ctalinks-container">
              <slot name="footer-ctalinks"></slot>
            </div>

            <!-- Buttons -->
            <div class="footer-buttons-container">
              <slot name="footer-buttons"></slot>
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
