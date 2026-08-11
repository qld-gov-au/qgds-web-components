import { LitElement, PropertyValues, html, nothing, unsafeCSS } from "lit";
import { customElement, property, query, queryAssignedElements, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { QgdsEvents, scrubSlotContent } from "../../utils";

// styles
import { baseStyles } from "../../styles";
import { utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-navigation-item.styles.scss?inline";

// Component dependencies
import "../qgds-link/qgds-link";
import "../qgds-icon/qgds-icon";
import "../qgds-call-to-action/qgds-call-to-action";
import "../qgds-link-column/qgds-link-column";
// import { NavigationVariant } from "./qgds-navigation";
import { IconName } from "../qgds-icon/icon-names";

export const tagName = "qgds-navigation-item";

/**
 * QGDS Navigation Item – A single item within the primary navigation component.
 * Supports a link target, optional icon, dropdown behaviour, and nested navigation items.
 *
 * @tagname qgds-navigation-item
 *
 * @property {string} [href] - Optional destination URL for the item link.
 * @property {string} [label=""] - Visible label for the navigation item.
 * @property {"horizontal" | "vertical" | "mobile-cta" } [variant="horizontal"] - The navigation variant.
 * @property {1 | 2} [level=1] - Navigation depth level. Level 1 items may contain nested level 2 items.
 * @property {boolean} [isActive=false] - Marks the current page or active item.
 * @property {boolean} [isOpen=false] - Controls the open state for dropdown or mega-menu content.
 * @property {IconName} [iconName] - Optional icon identifier shown before the label.
 * @property {string} [description] - Optional supporting description displayed in the dropdown header.
 * @property {boolean} [hideLabel=false] - Hides the visible label while keeping it accessible to assistive technology.
 * @property {boolean} [isDisabled=false] - Disables the item interaction.
 * @property {string} [viewAllUrl] - Optional destination for the view-all CTA in a nested dropdown.
 * @property {string} [viewAllLabel] - Optional label for the view-all CTA.
 *
 * @slot - Accepts nested `<qgds-navigation-item>` elements for dropdown or mega-menu content.
 *
 * @event qgds-open - Fired when the dropdown opens.
 * @event qgds-close - Fired when the dropdown closes.
 *
 * @example
 * ```html
 * <qgds-navigation-item label="Services" href="/services" is-active>
 *   <qgds-navigation-item label="Planning" href="/planning"></qgds-navigation-item>
 *   <qgds-navigation-item label="Environment" href="/environment"></qgds-navigation-item>
 * </qgds-navigation-item>
 * ```
 */
@customElement(tagName)
export class QGDSNavigationItem extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS), utilitiesStyles];

  @property({ type: String }) href?: string;
  @property({ type: String, reflect: true }) label: string = "";
  @property({ type: String, reflect: true }) variant: "horizontal" | "vertical" | "mobile-cta" = "horizontal";
  @property({ type: Number, reflect: true }) level: 1 | 2 = 1;
  @property({ type: Boolean, attribute: "is-active", reflect: true }) isActive = false;
  @property({ type: Boolean, attribute: "is-open", reflect: true }) isOpen = false;
  @property({ type: String, attribute: "icon-name" }) iconName?: IconName;
  @property({ type: String }) description?: string;
  @property({ type: Boolean, attribute: "hide-label" }) hideLabel = false;
  @property({ type: Boolean, attribute: "is-disabled" }) isDisabled = false;
  // columns?
  @property({ type: String, attribute: "view-all-url" }) viewAllUrl?: string;
  @property({ type: String, attribute: "view-all-label" }) viewAllLabel?: string;

  @state() private _numChildren = 0;

  @query("a, button") private _level1Item!: HTMLAnchorElement | HTMLButtonElement | null;
  @queryAssignedElements() private _assignedItems!: HTMLElement[] | null;

  private _events = new QgdsEvents(this);

  private get _columnCount() {
    // if one item, use 1 column
    if (this._numChildren === 1) return 1;
    // If 2 or 4 items, use 2 columns
    if (this._numChildren === 2 || this._numChildren === 4) return 2;
    // else 3 columns
    return 3;
  }

  private get _allChildrenHaveDecription() {
    return Array.from(this.children).every((child) => {
      return child.tagName.toLowerCase() === "qgds-navigation-item" && (child as QGDSNavigationItem).description;
    });
  }

  // Lifecycle methods
  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleClickOrFocusOutside);
    document.removeEventListener("focusin", this._handleClickOrFocusOutside);
  }

  // Fire an event when isOpen changes
  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("isOpen")) {
      this._events.dispatch(this.isOpen ? "open" : "close");
    }
    if (changedProperties.has("variant")) {
      this._syncChildren();
    }
    // Add/remove click outside, focusin ouside, escape key listeners to close automatically
    if (changedProperties.has("isOpen") || changedProperties.has("variant") || changedProperties.has("level")) {
      // if any properties change, recheck all relevant properties
      if (this.isOpen && this.variant === "horizontal" && this.level === 1) {
        document.addEventListener("click", this._handleClickOrFocusOutside);
        document.addEventListener("focusin", this._handleClickOrFocusOutside); // focusin - same as focus but bubbling
        this.addEventListener("keydown", this._handleKeydown);
      } else if (!this.isOpen || this.variant === "vertical" || this.level === 2) {
        document.removeEventListener("click", this._handleClickOrFocusOutside);
        document.removeEventListener("focusin", this._handleClickOrFocusOutside);
        this.removeEventListener("keydown", this._handleKeydown);
      }
    }
  }

  // private methods
  private _syncChildren = () => {
    this._assignedItems?.forEach((item) => {
      if (item instanceof QGDSNavigationItem) {
        item.variant = this.variant;
      }
    });
  };

  // Unified document click and focusin handler
  private _handleClickOrFocusOutside = (e: Event) => {
    if (!this.contains(e.target as Node)) this.isOpen = false;
  };

  // Handle escape key press
  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this._level1Item?.focus();
      this.isOpen = false;
    }
  };

  private _handleSlotchange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    // Reset hasChildren before checking nodes
    this._numChildren = 0;
    for (const node of nodes) {
      if (node.nodeType === 3 && node.nodeValue?.trim()) {
        // if label is empty string or undefined, assign the text node value as label.
        this.label = this.label || node.nodeValue.trim();
        continue;
      } else if (node instanceof QGDSNavigationItem) {
        node.level = 2;
        node.role = "listitem";
        if (node.isActive) {
          // Need to wait for parent to sync before checking variant
          requestAnimationFrame(() => (this.isOpen = this.variant === "vertical"));
        }

        this._numChildren++;
      }
    }
    // then only allow qgds-navigation-items, 2 levels deep
    if (this.level === 1) scrubSlotContent(slot, "QGDS-NAVIGATION-ITEM");
    else scrubSlotContent(slot, null);
  };

  // Level 1 horizontal items
  private _renderHorizontalLevel1 = () => {
    const classes = classMap({
      "nav-item is-horizontal": true,
      "is-active": this.isActive,
      "is-open": this._numChildren > 0 && this.isOpen,
    });
    const icon = this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : nothing;
    const label = html`<span class=${this.hideLabel ? "sr-only" : "nav-item-label"}>${this.label}</span>`;

    return html`${this._numChildren === 0
      ? // Without dropdown
        html`<div class=${classes}><a class="nav-item-link" href=${ifDefined(this.href)}>${icon}${label}</a></div>
          <slot @slotchange=${this._handleSlotchange}></slot>`
      : // With dropdown and mega menu
        html`<div class=${classes}>
            <button
              class="nav-item-link"
              aria-controls="mega-menu"
              aria-expanded=${this.isOpen}
              @click=${() => (this.isOpen = !this.isOpen)}
            >
              ${icon}${label}<qgds-icon class="dropdown-icon" icon-id="chevron-down" size="xs"></qgds-icon>
            </button>
          </div>

          <div class=${classMap({ "mega-menu qgds-container": true, "is-open": this.isOpen })} id="mega-menu">
            <!-- Header -->
            <div class="mega-menu-header">
              <qgds-link
                class="mega-menu-link is-heading"
                label=${this.label}
                href=${ifDefined(this.href)}
                icon-name="arrow-right"
                icon-size="lg"
                animation="leftToRight"
                has-trailing-icon
                aria-current=${ifDefined(this.isActive ? "page" : undefined)}
                aria-describedby=${ifDefined(this.description ? "header-description" : undefined)}
              ></qgds-link>
              ${this.description
                ? html`<p class="description" id="header-description">${this.description}</p>`
                : nothing}
            </div>

            <!-- Columns -->
            <div
              class="${classMap({
                "mega-menu-items": true,
                [`column-count-${this._columnCount}`]: true,
                "has-descriptions": this._allChildrenHaveDecription,
              })}"
              role="list"
              aria-label="${this.label} submenu"
            >
              <slot @slotchange=${this._handleSlotchange}></slot>
            </div>

            <!-- Footer -->
            ${this.viewAllUrl
              ? html`<div class="mega-menu-footer">
                  <qgds-call-to-action
                    href=${this.viewAllUrl}
                    label=${this.viewAllLabel ?? "View all"}
                    class="inline-block mega-menu-link"
                    is-view-all
                  ></qgds-call-to-action>
                </div>`
              : nothing}
          </div>`}`;
  };

  // Level 2 horizontal items (mega menu items)
  private _renderHorizontalLevel2 = () => {
    return html`<div class="mega-menu-item">
      <qgds-link
        class="mega-menu-link is-sub-item"
        label=${this.label}
        href=${ifDefined(this.href)}
        icon-name="arrow-right"
        icon-size="md"
        animation="leftToRight"
        has-trailing-icon
        stretch
      ></qgds-link
      >${this.description ? html`<p class="description">${this.description}</p>` : nothing}
    </div>`;
  };

  private _renderVerticalLevel1 = () => {
    const classes = classMap({
      "nav-item is-vertical": true,
      "is-active": this.isActive,
      "has-children": this._numChildren > 0,
      "is-open": this._numChildren > 0 && this.isOpen,
    });
    const icon = this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : nothing;
    const label = html`<span class="nav-item-label">${this.label}</span>`;

    return this._numChildren === 0
      ? html`<div class=${classes}><a class="nav-item-link" href=${ifDefined(this.href)}>${icon}${label}</a></div>
          <slot @slotchange=${this._handleSlotchange}></slot>`
      : html`<div class=${classes}>
            <a class="nav-item-link" href=${ifDefined(this.href)}>${icon}${label}</a>

            <button
              class=${classMap({
                "dropdown-toggle flex-shrink-0": true,
              })}
              aria-label="${this.label} sub items"
              aria-controls="dropdown"
              aria-expanded=${this.isOpen}
              @click=${() => (this.isOpen = !this.isOpen)}
            >
              <div class="dropdown-toggle-inner qgds-palette-default">
                <qgds-icon aria-hidden="true" class="dropdown-icon  " icon-id="chevron-down" size="sm"></qgds-icon>
              </div>
            </button>
          </div>
          <div class="${classMap({ dropdown: true, "is-open": this.isOpen })}" id="dropdown" role="list">
            <slot @slotchange=${this._handleSlotchange}></slot>
            ${this.viewAllUrl
              ? html`<div class="nav-item is-vertical is-level-2" role="listitem">
                  <a class="nav-item-link is-view-all" href=${this.viewAllUrl}
                    >${this.viewAllLabel ?? "View all"} <qgds-icon size="xs" icon-id="view-all"></qgds-icon
                  ></a>
                </div>`
              : nothing}
          </div> `;
  };

  private _renderVerticalLevel2OrMobileCTA = () => {
    const classes = classMap({
      "nav-item": true,
      "is-vertical": this.variant === "vertical",
      "is-level-2": this.variant === "vertical" && this.level === 2,
      "is-mobile-cta": this.variant === "mobile-cta",
      "is-active": this.isActive,
    });
    const icon = this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : nothing;
    const label = html`<span class=${this.hideLabel ? "sr-only" : "nav-item-label"}>${this.label}</span>`;

    return html`<div class=${classes}><a class="nav-item-link" href=${ifDefined(this.href)}>${icon}${label}</a></div>`;
  };

  render() {
    return this.variant === "mobile-cta"
      ? this._renderVerticalLevel2OrMobileCTA()
      : this.variant === "horizontal"
        ? this.level === 1
          ? this._renderHorizontalLevel1()
          : this._renderHorizontalLevel2()
        : this.level === 1
          ? this._renderVerticalLevel1()
          : this._renderVerticalLevel2OrMobileCTA();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSNavigationItem;
  }
}
