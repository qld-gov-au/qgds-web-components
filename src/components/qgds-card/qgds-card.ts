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
export type CardVariant = "arrow" | "leading-icon" | "stacked-icon" | "footer" | "footer-tags";
export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";
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
 * @prop {CardVariant} [variant="arrow"] - Visual configuration of the card. Image display is inferred automatically from slotted content.
 * @prop {string} [palette="default"] - QGDS colour palette applied to the card.
 * @prop {string} heading - The card's heading text.
 * @prop {HeadingLevel} [headingLevel="h3"] - Semantic heading level (h2-h6).
 * @prop {string} [href] - URL for single-action cards.
 * @prop {string} [target="_self"] - Link target for single-action cards.
 * @prop {string} [ariaLabel] - Accessible name override when the heading is insufficient.
 * @prop {0|1|2|3|4} [elevation] - Shadow depth (0 = none, 4 = highest).
 *
 * @slot main - The card's main body text.
 * @slot image - An image for the card. Use `<qgds-image>` where possible; a standard `<img>` is also accepted as a fallback.
 * @slot footer-links - Links in the card footer (multi-action cards).
 * @slot footer-tags - Tags or secondary links in the card footer (multi-action cards).
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
  variant: CardVariant = "arrow";

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

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string | null = null;

  @property({ type: Number, reflect: true })
  elevation?: 0 | 1 | 2 | 3 | 4;

  // ==========================================================================
  // STATE (Private, reactive)
  // ==========================================================================

  @state() private hasImage = false;
  @state() private hasFooterLinks = false;
  @state() private hasFooterTags = false;

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  private handleImageSlot = (e: Event) => {
    this.hasImage = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private handleLinksSlot = (e: Event) => {
    this.hasFooterLinks = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private handleTagsSlot = (e: Event) => {
    this.hasFooterTags = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  render() {
    const isSingle = this.action === "single";
    const hasHref = isSingle && !!this.href;
    const accessibleLabel = this.ariaLabel ?? this.heading ?? undefined;

    const cardClasses = {
      "has-image": this.hasImage,
      "has-footer": this.hasFooterLinks || this.hasFooterTags,
      "has-footer-links": this.hasFooterLinks,
      "has-footer-tags": this.hasFooterTags,
      "has-arrow": this.variant === "arrow",
      "has-stacked-icon": this.variant === "stacked-icon",
      "has-leading-icon": this.variant === "leading-icon",
      "has-elevation-1": this.elevation === 1,
      "has-elevation-2": this.elevation === 2,
      "has-elevation-3": this.elevation === 3,
      "has-elevation-4": this.elevation === 4,
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
        ${hasHref
          ? html`<a
              class="card-link"
              href=${ifDefined(this.href)}
              target=${ifDefined(this.target)}
              rel=${ifDefined(this.target === "_blank" ? "noopener noreferrer" : undefined)}
              aria-label=${ifDefined(accessibleLabel)}
              @click=${this._handleClick}
            ></a>`
          : nothing}
        <div class="image-wrapper">
          <slot name="image" @slotchange=${this.handleImageSlot}></slot>
        </div>

        <div class="content-wrapper">
          ${semanticHeading(this.heading, this.headingLevel, "heading")}
          <div class="content">
            <slot name="main"></slot>
          </div>
        </div>

        <div class="footer">
          <slot
            name="footer"
            @slotchange=${(e: Event) => {
              (e.target as HTMLSlotElement).assignedElements();
            }}
          ></slot>

          <div class="footer-links">
            <slot name="footer-links" @slotchange=${this.handleLinksSlot}></slot>
          </div>

          <div class="footer-tags">
            <slot name="footer-tags" @slotchange=${this.handleTagsSlot}></slot>
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
