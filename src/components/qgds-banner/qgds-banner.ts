import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { palettes } from "../../utils";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-banner.styles.scss?inline";

type QGDSPalette = keyof typeof palettes;

type BackgroundOptions = "none" | "texture" | "image" | "hero-image";
type ImageOptions = "grid-align" | "right-align" | "right-align-gradient" | "fixed-image-ratio" | "fixed-graphic-ratio";
type BannerVariants = "no-banner" | "default" | "basic" | "advanced" | "contained";

/**
 * Banners are use to introduce a page, their content should reflect the goals and content and purpose of the page they are on.
 *
 * @tag qgds-banner
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120418-139173&m=dev
 *
 * @prop {QGDSPalette} [palette="default"] - Colour palette applied to the banner.
 *
 * @prop {string} heading - The main heading text of the banner.
 * @prop {string} subHeading - The subheading text of the banner, which provides additional context or information about the page.
 * @prop {boolean} isBlockTypeHeading - Determines whether the heading should be displayed as a block type. Sub-heading field is used only for this type.
 * @prop {BackgroundOptions} [backgroundOption="none"] - The type of background to display in the banner.
 * @prop {ImageOptions} [imageOption="grid-align"] - The layout option for the background image when backgroundOption is set to "hero-image".
 * @prop {string} imageUrl - The URL of the background image to display when backgroundOption is set to "hero-image".
 * @prop {string} mobileImageUrl - The URL of the mobile background image to display when backgroundOption is set to "hero-image" or "background-image".
 * @prop {string} imageDescription - The alt text description for the background image, used for accessibility purposes.
 * @prop {BannerVariants} [variant="no-banner"] - The variant of the banner, which determines the styling of the banner.
 * @slot - Default slot. Accepts custom html elements. It is used to display abstract text that is displayed underneath the page title.
 * @slot breadcrumbs - Accepts one <qgds-breadcrumbs> with <qgds-breadcrumbs-item> elements. It is used to display the breadcrumbs navigation above the page title.
 * @slot cta - Accepts a <qgds-link> element. It is used to display the site name and link to the left of the banner.
 *
 */

@customElement("qgds-banner")
export class QGDSBanner extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true, useDefault: true }) palette: QGDSPalette = "default";
  @property({ type: String, reflect: true, useDefault: true }) variant: BannerVariants = "no-banner";
  @property({ type: String, attribute: "heading" }) heading = "";
  @property({ type: String, attribute: "sub-heading" }) subHeading = "";
  @property({ type: Boolean, attribute: "is-block-type-heading", reflect: true }) isBlockTypeHeading = false;
  @property({ type: String, attribute: "background-option" }) backgroundOption: BackgroundOptions = "none";
  @property({ type: String, attribute: "image-option", reflect: true }) imageOption: ImageOptions = "grid-align";
  @property({ type: String, attribute: "image-url" }) imageUrl = "";
  @property({ type: String, attribute: "mobile-image-url" }) mobileImageUrl = "";
  @property({ type: String, attribute: "image-description" }) imageDescription = "";

  @state() private _hasAbstract = false;
  @state() private _hasCta = false;
  @state() private _hasCards = false;

  private _onSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;

    const hasContent =
      slot.assignedElements({ flatten: true }).length > 0 ||
      slot
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());

    switch (slot.name) {
      case "":
        this._hasAbstract = hasContent;
        break;
      case "cta":
        this._hasCta = hasContent;
        break;
      case "cards":
        this._hasCards = hasContent;
        break;
    }
  };

  private get hasBannerContent() {
    return !!this.heading || this._hasAbstract || this._hasCta || this._hasCards;
  }

  render() {
    const bannerClasses = {
      banner: true,
      [this.variant]: true,
      "has-background": !!this.imageUrl && (this.backgroundOption === "image" || this.backgroundOption === "texture"),
      "has-background-image": !!this.imageUrl && this.backgroundOption === "image",
    };
    const bannerContentClasses = {
      "banner-inner": true,
      "has-hero-image": !!this.imageUrl && this.backgroundOption === "hero-image",
    };
    const headingClasses = {
      "banner-heading-wrapper": true,
      "block-type": this.isBlockTypeHeading,
    };

    return html`
      <section
        aria-label="Banner"
        class=${classMap(bannerClasses)}
        style=${this.backgroundOption === "image" || this.backgroundOption === "texture"
          ? `background-image:url(${this.imageUrl})`
          : ""}
      >
        <div class="banner-container has-image-${this.imageOption}">
          <div class=${classMap(bannerContentClasses)}>
            <div class="banner-content-container">
              <div class="banner-breadcrumbs">
                <slot name="breadcrumbs"></slot>
              </div>
              ${this.backgroundOption.includes("image") && (this.mobileImageUrl || this.imageUrl)
                ? html`<div
                    class="banner-image-mobile"
                    role="img"
                    aria-label=${this.imageDescription}
                    style="background-image:url(${this.mobileImageUrl ?? this.imageUrl})"
                  ></div>`
                : nothing}
              ${this.hasBannerContent
                ? html`
                    <div class="banner-content">
                      ${this.heading
                        ? html`<h1 class="${classMap(headingClasses)}">
                            <span class="banner-heading"> ${this.heading} </span>
                            ${this.subHeading
                              ? html`<span class="banner-sub-heading">${this.subHeading}</span>`
                              : nothing}
                          </h1>`
                        : nothing}

                      <slot class="banner-abstract" @slotchange=${this._onSlotChange}></slot>
                      <slot class="banner-cta" name="cta" @slotchange=${this._onSlotChange}></slot>
                      <slot class="banner-cards" name="cards" @slotchange=${this._onSlotChange}></slot>
                    </div>
                  `
                : nothing}
            </div>
            ${this.backgroundOption.includes("image") && this.imageUrl
              ? html` <div class="banner-image-container ${this.imageOption}">
                  ${this.backgroundOption === "hero-image"
                    ? html`<div
                        class="banner-image"
                        role="img"
                        aria-label=${this.imageDescription}
                        style="background-image:url(${this.imageUrl})"
                      ></div>`
                    : nothing}
                </div>`
              : nothing}
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-banner": QGDSBanner;
  }
}
