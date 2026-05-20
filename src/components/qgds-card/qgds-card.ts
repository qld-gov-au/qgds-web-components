import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

// Utils
import { QgdsEvents } from "../../utils";
import { semanticHeading } from "../../utils";
import { type IconName } from "../qgds-icon/icon-names.js";
export type { IconName };

// Import dependent components
import "../qgds-image/qgds-image";
import "../qgds-tag/qgds-tag";
import "../qgds-link/qgds-link";
import "../qgds-feature-icon/qgds-feature-icon";
import "../qgds-icon/qgds-icon";

// Styles
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-card.styles.scss?inline";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/*
  Card taxonomy — three independent axes:

  action (interaction model)
  ├── "none"       No clickable targets
  ├── "single"     Entire card is one link (requires href)
  └── "multiple"   Independent links in the footer

  layout (spatial arrangement)
  ├── "default"    Standard stacked layout
  └── "feature"    Wide image/content row at md+ viewports (image-position: start | end)

  variant (visual treatment — applies within any action/layout combination)
  ├── "none"         Plain card, no indicator
  ├── "arrow"        Single-action with trailing arrow
  ├── "leading-icon" Icon to the left of heading/content
  └── "stacked-icon" Icon above heading/content

  footer types (inferred from slotted content)
  ├── "none"    No footer
  ├── "text"    Plain text or heading (available on all action types)
  ├── "links"   CTA links (multiple-action only)
  └── "tags"    Tag chips (multiple-action only)
*/

export type CardAction = "none" | "single" | "multiple";
export type CardLayout = "default" | "feature";
export type CardVariant = "none" | "arrow" | "leading-icon" | "stacked-icon";
export type ImagePosition = "none" | "start" | "end";
export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";
export type QGDSCardProps = InstanceType<typeof QGDSCard>;
type FooterType = "none" | "text" | "links" | "tags";

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * The card component is used to provide a brief summary of content or a task, often with a link to more detail.
 *
 * @uikit https://www.figma.com/design/fc8Ng3GB7fbkL37WGKXwai/Queensland-Government-Design-System--UI-Kit--Community-\?node-id\=120360-98159\&m\=dev
 * @website https://www.designsystem.qld.gov.au/components/card
 *
 * @prop {CardAction} [action="none"] - Card's primary behaviour: "none" (non-clickable), "single" (whole card is a link), "multiple" (independent footer links).
 * @prop {CardLayout} [layout="default"] - Spatial layout of the card: "default" (standard stacked layout) or "feature" (side-by-side image/content layout at larger viewports).
 * @prop {CardVariant} [variant="none"] - Alternate card variants: "arrow", "leading-icon", or "stacked-icon".
 * @prop {string} [palette="default"] - Colour palette applied to the card.
 * @prop {string} heading - The card's heading text.
 * @prop {HeadingLevel} [headingLevel="h3"] - Semantic heading level (h2-h6).
 * @prop {string} [ariaLabel] - Accessible name override when the heading is insufficient.
 * @prop {string} [href] - URL for single-action cards, and primary link for multiple-action cards.
 * @prop {string} [target="_self"] - Link target for single-action cards.
 * @prop {string} imageSrc - The source URL for the card's image
 * @prop {string} imageAlt - The alternative text for the card's image
 * @prop {ImagePosition} [imagePosition="start"] - Position of the image for feature variant cards (start or end).
 * @prop {IconName} [iconName] - Name of the icon for the card (used for "leading-icon" and "stacked-icon" variants). Refer qgds-icon for available icons.
 *
 * @slot (default) - The card's main body text.
 * @slot footer-text - Plain text or heading in the card footer.
 * @slot footer-links - CTA links in the card footer (used with action="multiple").
 * @slot footer-tags - Tag chips in the card footer (used with action="multiple").
 *
 * @cssprop --bg - Override the card background colour.
 * @cssprop --fg - Override the card foreground colour.
 * @cssprop --border - Override the card border colour.
 * @cssprop --border-radius - Override the card border radius.
 *
 * @event qgds-click - Fires when the card region is clicked.
 */
@customElement("qgds-card")
export class QGDSCard extends LitElement {
  // ==========================================================================
  // STYLES
  // ==========================================================================
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  constructor() {
    super();

    // Initialize events controller
    this._events = new QgdsEvents(this, { prefix: "qgds" });
  }

  // ==========================================================================
  // PROPERTIES (Public API)
  // ==========================================================================

  @property({ type: String, reflect: true, useDefault: true })
  action: CardAction = "none";

  @property({ type: String, reflect: true, useDefault: true })
  layout: CardLayout = "default";

  @property({ type: String, reflect: true, useDefault: true })
  variant: CardVariant = "none";

  @property({ type: String, reflect: true, useDefault: true })
  palette: string = "default";

  @property({ type: String })
  heading: string = "";

  @property({ type: String, attribute: "heading-level", useDefault: true })
  headingLevel: HeadingLevel = "h3";

  @property({ type: String })
  href?: string;

  @property({ type: String, useDefault: true })
  target: string = "_self";

  @property({ type: String, attribute: "image-src" })
  imageSrc?: string;

  @property({ type: String, attribute: "image-alt" })
  imageAlt?: string;

  @property({ type: String, attribute: "icon-name" })
  iconName?: IconName;

  @property({ type: String, attribute: "image-position" })
  imagePosition?: ImagePosition = "start";

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string | null = null;

  // ==========================================================================
  // STATE (Private, reactive)
  // ==========================================================================

  @state() private hasFooterLinks = false;
  @state() private hasFooterTags = false;
  @state() private hasFooterText = false;

  // ==========================================================================
  // Events
  // ==========================================================================
  private _events: QgdsEvents;

  private _handleClick = (e: PointerEvent) => {
    this._events.dispatch("click", { label: this.heading, href: this.href }, e);
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._events.dispatch("click", { label: this.heading, href: this.href }, e);
    }
  };

  // ==========================================================================
  // PRIVATE METHODS (Slot handlers)
  // ==========================================================================

  // Footer precedence is deterministic: tags > links > text > none.
  private get footerType(): FooterType {
    if (this.hasFooterTags) {
      return "tags";
    }

    if (this.hasFooterLinks) {
      return "links";
    }

    if (this.hasFooterText) {
      return "text";
    }

    return "none";
  }

  private handleLinksSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements();
    const hasLinkElements = assigned.some(
      (el) =>
        el.tagName.toLowerCase() === "a" || el.tagName.toLowerCase() === "qgds-link" || el.querySelector("a, qgds-link")
    );
    this.hasFooterLinks = assigned.length > 0 && hasLinkElements;
  };

  private handleTagsSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements();
    const hasTagElements = assigned.some(
      (el) => el.tagName.toLowerCase() === "qgds-tag" || el.querySelector("qgds-tag")
    );

    this.hasFooterTags = assigned.length > 0 && hasTagElements;
  };

  private handleFooterTextSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements();
    const hasText = assigned.some((el) => el.textContent?.trim().length > 0);
    this.hasFooterText = assigned.length > 0 && hasText;
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  render() {
    const isSingle = Boolean(this.action === "single");
    const hasHref = Boolean(this.href);
    const hasImage = Boolean(this.imageSrc?.trim());
    const hasArrow = Boolean(this.variant === "arrow");
    const accessibleLabel = this.ariaLabel ?? this.heading ?? undefined;
    const iconSize = this.variant === "stacked-icon" ? "lg" : "sm";
    const footerType = this.footerType; //getter
    const effectiveFooterType: FooterType = hasArrow ? "none" : footerType;
    const showImage = hasImage && !hasArrow;
    const showFeatureIcon =
      !hasArrow && (this.variant.includes("stacked-icon") || this.variant.includes("leading-icon"));
    const showBodyContent = !hasArrow;
    const showFooter = !hasArrow;
    const imageAspect = this.layout === "feature" ? undefined : "3:2";

    const headingContent = hasHref
      ? html`<a
          href=${ifDefined(this.href)}
          target=${ifDefined(this.target)}
          rel=${ifDefined(this.target === "_blank" ? "noopener noreferrer" : undefined)}
          aria-label=${ifDefined(this.ariaLabel ?? undefined)}
          @click=${this._handleClick}
          >${this.heading}</a
        >`
      : this.heading;

    const cardClasses = {
      "is-single": isSingle,
      "is-feature": this.layout === "feature",
      "has-image": showImage,
      "image-end": this.imagePosition === "end",
      "has-footer": effectiveFooterType !== "none",
      "has-footer-links": effectiveFooterType === "links",
      "has-footer-tags": effectiveFooterType === "tags",
      "has-footer-text": effectiveFooterType === "text",
      "has-arrow": hasArrow,
      "has-stacked-icon": this.variant === "stacked-icon",
      "has-leading-icon": this.variant === "leading-icon",
      "is-multiple": this.action === "multiple",
    };

    return html`
      <div
        class="card ${classMap(cardClasses)}"
        role=${ifDefined(isSingle && !hasHref ? "button" : undefined)}
        aria-label=${ifDefined(isSingle && !hasHref ? accessibleLabel : undefined)}
        tabindex=${ifDefined(isSingle && !hasHref ? 0 : undefined)}
        @click=${isSingle && !hasHref ? this._handleClick : nothing}
        @keydown=${isSingle && !hasHref ? this._handleKeydown : nothing}
      >
        ${showImage
          ? html` <div class="card-image-wrap">
              <qgds-image
                alt="${ifDefined(this.imageAlt)}"
                aspect="${ifDefined(imageAspect)}"
                src="${ifDefined(this.imageSrc)}"
              ></qgds-image>
            </div>`
          : nothing}

        <div class="content-wrap">
          ${showFeatureIcon
            ? html`<div class="feature-icon-wrap">
                <qgds-feature-icon
                  size=${ifDefined(iconSize)}
                  icon-name=${ifDefined(this.iconName)}
                ></qgds-feature-icon>
              </div>`
            : nothing}

          <div class="content">
            ${semanticHeading(headingContent, this.headingLevel, "heading")}
            ${showBodyContent ? html`<slot></slot>` : nothing}
          </div>

          ${hasArrow ? html` <qgds-icon size="md" icon-id="arrow-right"></qgds-icon>` : nothing}
          ${showFooter
            ? html`<div class="footer">
                <slot name="footer-links" @slotchange=${this.handleLinksSlot}></slot>
                <slot name="footer-tags" @slotchange=${this.handleTagsSlot}></slot>
                <slot name="footer-text" @slotchange=${this.handleFooterTextSlot}></slot>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }
}
// ============================================================================
// TYPE DECLARATIONS
// ============================================================================

declare global {
  interface HTMLElementTagNameMap {
    "qgds-card": QGDSCard;
  }
}
