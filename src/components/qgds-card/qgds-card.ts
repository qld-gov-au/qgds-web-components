import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { QgdsEvents } from "../../utils";

import "../qgds-image/qgds-image";
import "../qgds-tag/qgds-tag";

import { baseStyles } from "../../styles";
import { semanticHeading } from "../../utils";
import componentCSS from "./qgds-card.styles.scss?inline";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type CardAction = "none" | "single" | "multiple";
export type ImagePosition = "none" | "start" | "end";
export type CardVariant = "none" | "arrow" | "leading-icon" | "stacked-icon" | "feature";
export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";
export type FooterType = "none" | "links" | "tags" | "text";
export type QGDSCardProps = InstanceType<typeof QGDSCard>;

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
 * @prop {CardVariant} [variant="none"] - Visual configuration of the card. Image display is inferred automatically from slotted content.
 * @prop {string} [palette="default"] - QGDS colour palette applied to the card.
 * @prop {string} heading - The card's heading text.
 * @prop {string} imageSrc - The source URL for the card's image
 * @prop {string} imageAlt - The alternative text for the card's image
 * @prop {HeadingLevel} [headingLevel="h3"] - Semantic heading level (h2-h6).
 * @prop {string} [href] - URL for single-action cards.
 * @prop {string} [target="_self"] - Link target for single-action cards.
 * @prop {ImagePosition} [imagePosition="start"] - Position of the image for feature variant cards (start or end).
 * @prop {string} [ariaLabel] - Accessible name override when the heading is insufficient.
 * @prop {0|1|2|3|4} [elevation] - Shadow depth (0 = none, 4 = highest).
 *
 * @slot main - The card's main body text.
 * @slot footer - Footer content. The card auto-detects whether content is links, tags, or text.
 * @slot icon - Adds an icon to the card (used for "leading-icon" and "stacked-icon" variants).
 * @slot date - Adds a date element to the card (used for "news" variants).
 *
 * @cssprop --background - Override the card background colour.
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

  @property({ type: String, attribute: "image-position", reflect: true, useDefault: true })
  imagePosition?: ImagePosition = "start";

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string | null = null;

  @property({ type: Number, reflect: true })
  elevation?: 0 | 1 | 2 | 3 | 4;

  // ==========================================================================
  // STATE (Private, reactive)
  // ==========================================================================

  @state() private footerType: FooterType = "none";

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  private getFooterType = (slot: HTMLSlotElement): FooterType => {
    const assignedElements = slot.assignedElements({ flatten: true });

    if (assignedElements.length === 0) {
      const hasTextNodes = slot
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim());
      return hasTextNodes ? "text" : "none";
    }

    const hasTags = assignedElements.some(
      (element) => element.localName === "qgds-tag" || !!element.querySelector("qgds-tag")
    );
    if (hasTags) {
      return "tags";
    }

    const hasLinks = assignedElements.some(
      (element) =>
        (element.localName === "a" && (element as HTMLAnchorElement).hasAttribute("href")) ||
        !!element.querySelector("a[href]")
    );
    if (hasLinks) {
      return "links";
    }

    const hasTextContent = assignedElements.some((element) => !!element.textContent?.trim());
    return hasTextContent ? "text" : "none";
  };

  private handleFooterSlot = (e: Event) => {
    this.footerType = this.getFooterType(e.target as HTMLSlotElement);
  };

  protected firstUpdated(): void {
    const footerSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="footer"]');
    if (footerSlot) {
      this.footerType = this.getFooterType(footerSlot);
    }
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  render() {
    const isSingle = this.action === "single" && !!this.href;
    const hasHref = !!this.href;
    const hasImage = !!this.imageSrc?.trim();
    const accessibleLabel = this.ariaLabel ?? this.heading ?? undefined;

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
      "is-feature": this.variant === "feature",
      "has-image": hasImage,
      "image-end": this.imagePosition === "end",
      "has-footer": this.footerType !== "none",
      "has-footer-links": this.footerType === "links",
      "has-footer-tags": this.footerType === "tags",
      "has-footer-text": this.footerType === "text",
      "has-arrow": this.variant === "arrow",
      "has-stacked-icon": this.variant === "stacked-icon",
      "has-leading-icon": this.variant === "leading-icon",
    };

    return html`
      <div
        class="card ${classMap(cardClasses)}"
        role=${ifDefined(!hasHref && isSingle ? "button" : undefined)}
        aria-label=${ifDefined(!hasHref && isSingle ? accessibleLabel : undefined)}
        tabindex=${ifDefined(!hasHref && isSingle ? 0 : undefined)}
        @click=${!hasHref && isSingle ? this._handleClick : nothing}
        @keydown=${!hasHref && isSingle ? this._handleKeydown : nothing}
      >
        <div class="image-wrap">
          <img src=${ifDefined(this.imageSrc)} alt=${ifDefined(this.imageAlt)} />
        </div>

        <div class="content-wrap">
          ${semanticHeading(headingContent, this.headingLevel, "heading")}

          <div class="content">
            <slot name="main"></slot>
          </div>

          <div class="footer">
            <slot name="footer" @slotchange=${this.handleFooterSlot}></slot>
          </div>
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
