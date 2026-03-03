import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { semanticHeading } from "../../utils";
import { ifDefined } from "lit/directives/if-defined.js"; // Uncomment if needed
//import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";

// ============================================================================
// IMPORT CSS (global and component-specific styles)
// ============================================================================
// import sharedStyles from "../../styles/shared-styles.ts";

import componentCSS from "./qgds-card.styles.scss?inline";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Define custom types for your component properties here */
type CardActions = "none" | "single" | "mutiple";

type CardFeatures =
  | "arrow"
  | "leading-icon"
  | "stacked-icon"
  | "image"
  | "links"
  | "footer"
  | "footer-tags";

/** Export the component's type for use in other files/stories */
export type QGDSCardProps = InstanceType<typeof QGDSCard>;

// ============================================================================
// COMPONENT DOCUMENTATION
// ============================================================================

/**
 * The card component is used to provide a brief summary of content or a task, often with a link to more detail.
 *
 * @uikit https://www.figma.com/design/fc8Ng3GB7fbkL37WGKXwai/Queensland-Government-Design-System--UI-Kit--Community-?node-id=120360-98159&m=dev
 * @website https://www.designsystem.qld.gov.au/components/card
 * @tagname qgds-card
 *
 * @property {string} action - Action describes the card's primary behaviour: No action (non clickable), Single Action, Multiple Actions.
 * @property {string} variant - The variant describes the range of configurations a card can have. Card with arrow, Card with image, stacked icon, leading icon, image and footer, footer
 *
 * @attribute action - The action attribute reflects the action property.
 * @attribute variant - The variant attribute reflects the variant property.
 * @attribute palette - A card can have a QGDS palette applied to it, or inherit palette settings form it's parent container(s). Default, Soft, Muted, Bold, Deep.
 *
 * @attribute heading - The card's heading text
 * @attribute heading-level - The heading-level attribute defines the semantic level of the card's heading, which can be used to ensure proper document structure and accessibility.
 * @attribute href - The href attribute is used when the card has a single action, and defines the URL the card links to.
 * @attribute target - The target attribute is used when the card has a single action, and defines where to open the linked document.
 * @attribute aria-label - The aria-label attribute is used to provide an accessible name for the card when the heading does not sufficiently describe the card's content or purpose.
 * @attribute elevation - The elevation attribute defines the card's shadow depth, which can be used to indicate hierarchy or interactivity. Options are 1 (low) through 4 (high).
 *
 * @slot main - Default slot description contains the card's main body text. Usually a brief summary of the content or task the card represents.
 * @slot image - The image slot is only available on image variant cards and accepts an image element.
 * @slot footer-links - The footer-links slot is only available on multi-action cards and accepts general content, but is typically used for links.
 * @slot footer-tags - The footer-tags slot is only available on multi-action cards and accepts either links or tags.
 *
 * @fires event-name - Description of custom event and when it's fired
 *
 * @cssprop {color} --custom-property - Description of CSS custom property
 *
 * @example
 * <qgds-card attribute="value">
 *   <p slot="main">Slot content</p>
 * </qgds-card>
 */

// ============================================================================
// COMPONENT CLASS
// ============================================================================

@customElement("qgds-card")
export class QGDSCard extends LitElement {
  // ==========================================================================
  // STYLES
  // ==========================================================================

  static styles = [
    // Add global styles if needed:
    /* css`
      ${unsafeCSS(sharedStyles)}
    `, */
    css`
      ${unsafeCSS(componentCSS)}
    `,
    // Add inline styles if needed:
    // css`
    //   :host {
    //     display: block;
    //   }
    // `,
  ];

  // ==========================================================================
  // PROPERTIES (Public API)
  // ==========================================================================

  @property({ type: String, useDefault: true })
  action: CardActions = "none";

  @property({ type: String, useDefault: true })
  variant: CardFeatures = "arrow";

  @property({ type: String, useDefault: true })
  palette: string = "default";

  @property({ type: String, useDefault: true })
  heading: string = "";

  @property({ type: String, attribute: "heading-level", useDefault: true })
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6" = "h3";

  @property({ type: String, useDefault: true })
  href: string = "";

  @property({ type: String, useDefault: true })
  target: string = "_self";

  @property({ type: String, attribute: "aria-label", useDefault: true })
  ariaLabel: string = "";

  @property({ type: Number })
  elevation?: 0 | 1 | 2 | 3 | 4;

  // ==========================================================================
  // LIFECYCLE METHODS
  // ==========================================================================

  /**
   * Called when component is added to DOM
   * Use for setup that needs DOM access
   */
  // connectedCallback() {
  //   super.connectedCallback();
  //   // Setup code here
  // }

  /**
   * Called when component is removed from DOM
   * Use for cleanup (remove event listeners, etc.)
   */
  // disconnectedCallback() {
  //   super.disconnectedCallback();
  //   // Cleanup code here
  // }

  /**
   * Called after updates complete
   * Use to react to property changes
   */
  // updated(changedProperties: Map<PropertyKey, unknown>) {
  //   super.updated(changedProperties);
  //
  //   if (changedProperties.has('propertyName')) {
  //     // React to property change
  //   }
  // }

  // ==========================================================================
  // RENDER METHODS
  // ==========================================================================

  /**
   * Main render method - defines the component's template
   */

  render() {
    const cardClasses = {
      "has-footer": this.hasFooterLinks || this.hasFooterTags,
      "has-footer-links": this.hasFooterLinks,
      "has-footer-tags": this.hasFooterTags,
      "has-arrow": this.variant === "arrow",
      "has-image": this.variant === "image",
      "has-stacked-icon": this.variant === "stacked-icon",
      "has-leading-icon": this.variant === "leading-icon",
      "has-elevation-1": this.elevation === 1,
      "has-elevation-2": this.elevation === 2,
      "has-elevation-3": this.elevation === 3,
      "has-elevation-4": this.elevation === 4,
    };

    return html`
      <div class="card ${classMap(cardClasses)} " aria-label="${ifDefined(this.ariaLabel)}">
        ${
          this.hasImage
            ? html`
                <div class="image-wrapper">
                  <slot name="image" @slotchange=${this.handleImageSlot}></slot>
                </div>
              `
            : ""
        }  
        
          <div class="content-wrapper">
            <div class="heading">
            ${semanticHeading(this.heading, this.headingLevel, "heading")}
            </div>

            <div class="content">
            <slot name="main"></slot>
            </div>
          </div>

        ${
          this.hasFooterLinks || this.hasFooterTags
            ? html`
                <div class="footer">
                  <slot
                    name="footer-links"
                    @slotchange=${this.handleLinksSlot}
                  ></slot>
                  <slot
                    name="footer-tags"
                    @slotchange=${this.handleTagsSlot}
                  ></slot>
                </div>
              `
            : ""
        }


        </div>
      </div>
    `;
  }

  // ==========================================================================
  // STATE (Private, reactive)
  // ==========================================================================

  @state() private hasFooterLinks = false;
  @state() private hasFooterTags = false;
  @state() private hasImage = false;
  @state() private hasFooterContent: boolean = false;

  // ==========================================================================
  // PRIVATE METHODS (Event handlers, helpers)
  // ==========================================================================

  private handleImageSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasImage = slot.assignedElements().length > 0;
  };

  private handleLinksSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasFooterLinks = slot.assignedElements().length > 0;
  };

  private handleTagsSlot = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    this.hasFooterTags = slot.assignedElements().length > 0;
  };
}

// ============================================================================
// TYPE DECLARATIONS (if needed for Storybook)
// ============================================================================

declare global {
  interface HTMLElementTagNameMap {
    "qgds-card": QGDSCard;
  }
}
