import { LitElement, html, unsafeCSS, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import componentCSS from "./qgds-button.styles.scss?inline";
import { resetStyles, animationsStyles } from "../../styles";
import { QgdsEvents } from "../../utils";

import "../qgds-icon/qgds-icon";
import type { IconName } from "../qgds-icon/icon-names";

// Define types for properties to ensure type safety and better autocompletion
type ButtonVariant = "primary" | "secondary" | "tertiary";
type AnchorTarget = "_self" | "_blank" | "_parent" | "_top";
type IconPosition = "leading" | "trailing";

/**
 * QGDS Button Component
 *
 * A web component for displaying buttons with various styles and states.
 * Supports primary, secondary, and tertiary variants.
 * Can include icons and handle loading states.
 * Accessible via aria-labels and keyboard interactions.
 *
 * @attr {string} label - The label of the button.
 * @attr {ButtonVariant} variant - The variant of the button ("primary", "secondary", "tertiary").  Default is "primary"
 * @attr {boolean} disabled - Whether the button is disabled.  Default is "false"
 * @attr {AnchorTarget} target - The target for the link ("_self", "_blank", "_parent", "_top"). Default is "_self"
 * @attr {ButtonType} [type="button"] - The type of the button ("button", "submit", "reset"). Default is "button"
 * @attr {string} aria-label - The aria-label for the button for accessibility.
 * @attr {IconName} icon-name - The qgds-icon icon-id rendered in shadow DOM when provided.
 * @attr {IconPosition} icon-position - The position of the icon relative to the label ("leading", "trailing"). If omitted, the icon renders in the leading position.
 * @attr {string} id - A unique ID for the button.
 * @attr {string} href - The URL the button links to (if it's a link).
 * @attr {string} loading-label - Optional loading text shown when the button is in a loading state. If omitted, "Loading..." is used.
 * @attr {boolean} is-loading - Whether the button is in a loading state. Default is "false".
 *
 * @cssprop --btn-border-colour - The color of the button border.
 * @cssprop --btn-text - The color of the button text.
 *
 * @event qgds-click - Fires when the button is clicked.
 *
 * @example
 * ```html
 * <qgds-button type="button" label="Button" variant="primary"></qgds-button>
 * ```
 */

export type QGDSButtonProps = InstanceType<typeof QGDSButton>;

@customElement("qgds-button")
export class QGDSButton extends LitElement {
  constructor() {
    super();

    // Initialize events controller
    this._events = new QgdsEvents(this, { prefix: "qgds" });
  }

  @property({ type: String }) label: string = "";
  @property({ type: String, useDefault: true }) variant: ButtonVariant = "primary";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: String }) target?: AnchorTarget;
  @property({ type: String }) type: HTMLButtonElement["type"] = "button";
  @property({ type: String, attribute: "aria-label" }) ariaLabel: string | null = null;
  @property({ type: String, attribute: "icon-name" }) iconName?: IconName;
  @property({ type: String, reflect: true, attribute: "icon-position" })
  iconPosition?: IconPosition;
  @property({ type: String, reflect: true, attribute: "id" })
  uniqueID?: string;
  @property({ type: String, reflect: true, attribute: "href" })
  href?: string;
  @property({ type: String, attribute: "loading-label" }) loadingLabel: string = "Loading...";
  @property({ type: Boolean, reflect: true, attribute: "is-loading" })
  isLoading = false;

  // Internal state management for interaction states
  @state() private _isHovered: boolean = false;
  @state() private _isActive: boolean = false;
  @state() private _isFocused: boolean = false;

  static styles = [resetStyles, animationsStyles, unsafeCSS(componentCSS)];

  render() {
    const labelContent = this.label.trim().length > 0 ? this.label : html`<slot></slot>`;

    // Check if it's a link or button
    if (this.href !== undefined) {
      return this.renderLink(labelContent);
    } else {
      return this.renderButton(labelContent);
    }
  }

  // Render link version of the button (anchor tag with href)
  private renderLink(labelContent: string | TemplateResult) {
    const classes = {
      btn: true,
      loading: this.isLoading,
      [`btn-${this.variant}`]: true,
      disabled: this.disabled || this.isLoading,
      "has-icon": !!this.iconName || this.isLoading,
    };

    return html`
      <a
        href=${this.href ?? "#"}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        class=${classMap(classes)}
        target="${ifDefined(this.target)}"
        tabindex="${this.disabled || this.isLoading ? -1 : 0}"
        rel="${this.target === "_blank" ? "noopener noreferrer" : ifDefined(undefined)}"
        @click=${this._handleClick}
      >
        ${this.isLoading
          ? html`<qgds-icon icon-id="spinner-step-1" size="md"></qgds-icon>`
          : html`${this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : null}`}
        ${this.isLoading ? this.loadingLabel : labelContent}
      </a>
    `;
  }

  // Render button version of the button
  private renderButton(labelContent: string | TemplateResult) {
    const classes = {
      btn: true,
      loading: this.isLoading,
      [`btn-${this.variant}`]: true,
      "has-icon": !!this.iconName || this.isLoading,
    };

    return html`
      <button
        ?disabled=${this.disabled || this.isLoading}
        type=${this.type}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        class=${classMap(classes)}
        tabindex="0"
        @click=${this._handleClick}
      >
        ${this.isLoading
          ? html`<qgds-icon icon-id="spinner-step-1" size="md" aria-hidden="true"></qgds-icon>`
          : html`${this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : null}`}
        ${this.isLoading ? this.loadingLabel : labelContent}
      </button>
    `;
  }

  // Getter for combined button state
  get buttonState() {
    return {
      isDisabled: this.disabled,
      isLoading: this.isLoading,
    };
  }

  private _events: QgdsEvents;

  private _handleClick = (e: PointerEvent) => {
    if (this.disabled || this.isLoading) {
      e.preventDefault();
      return;
    }

    const dispatchEvent = this._events.dispatch("click", {
      id: this.uniqueID ?? null,
      href: this.href,
      label: this.label,
      variant: this.variant,
      type: this.type,
    });

    //Handle the case where the event was canceled by a listener
    if (!dispatchEvent) {
      e.preventDefault();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-button": QGDSButton;
  }
}
