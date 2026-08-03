import { LitElement, PropertyValues, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
import { NavigationVariant } from "./qgds-navigation";
import { IconName } from "../qgds-icon/icon-names";

export const tagName = "qgds-navigation-item";

/**
 * @tagname qgds-navigation-item
 *
 *  @event qgds-open - fired when the dropdown opens
 * @event qgds-close - fired when the dropdown closes
 */
@customElement(tagName)
export class QGDSNavigationItem extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS), utilitiesStyles];

  @property({ type: String }) href?: string;
  @property({ type: String, reflect: true }) label: string = "";
  @property({ type: String, reflect: true }) variant: NavigationVariant = "horizontal";
  @property({ type: Number, reflect: true }) level: 1 | 2 = 1;
  @property({ type: Boolean, attribute: "is-active" }) isActive = false;
  @property({ type: Boolean, attribute: "is-open" }) isOpen = false;
  @property({ type: String, attribute: "icon-name" }) iconName?: IconName;
  @property({ type: String }) description?: string;
  @property({ type: Boolean, attribute: "hide-label" }) hideLabel = false;
  @property({ type: Boolean, attribute: "is-disabled" }) isDisabled = false;
  // columns?
  @property({ type: String, attribute: "view-all-url" }) viewAllUrl?: string;
  @property({ type: String, attribute: "view-all-label" }) viewAllLabel? = "View all";

  @state() private _numChildren = 0;

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
  // Fire an event when isOpen changes
  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("isOpen")) {
      this._events.dispatch(this.isOpen ? "open" : "close");
    }
  }

  // private methods
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
      } else if (node.nodeName === "QGDS-NAVIGATION-ITEM") {
        (node as QGDSNavigationItem).level = 2;
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

          <div class=${classMap({ "mega-menu": true, "is-open": this.isOpen })} id="mega-menu">
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
                    label=${ifDefined(this.viewAllLabel)}
                    class="inline-block"
                    is-view-all
                  ></qgds-call-to-action>
                </div>`
              : nothing}
          </div>`}`;
  };

  // Level 2 horizontal items (mega menu items)
  private _renderHorizontalLevel2 = () => {
    return html`<div role="listitem" class="mega-menu-item">
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
    const label = html`<span class=${this.hideLabel ? "sr-only" : "nav-item-label"}>${this.label}</span>`;

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
          <div class="${classMap({ dropdown: true, "is-open": this.isOpen })}" id="dropdown">
            <slot @slotchange=${this._handleSlotchange}></slot>
            ${this.viewAllUrl
              ? html`<div class="nav-item is-vertical is-level-2">
                  <a class="nav-item-link is-view-all" href=${this.viewAllUrl}
                    >${this.viewAllLabel ?? "View all"} <qgds-icon size="xs" icon-id="view-all"></qgds-icon
                  ></a>
                </div>`
              : nothing}
          </div> `;
  };

  private _renderVerticalLevel2 = () => {
    const classes = classMap({
      "nav-item is-vertical is-level-2": true,
      "is-active": this.isActive,
    });
    const icon = this.iconName ? html`<qgds-icon icon-id=${this.iconName} size="md"></qgds-icon>` : nothing;
    const label = html`<span class=${this.hideLabel ? "sr-only" : "nav-item-label"}>${this.label}</span>`;

    return html`<div class=${classes}><a class="nav-item-link" href=${ifDefined(this.href)}>${icon}${label}</a></div>`;
  };

  render() {
    return this.variant === "horizontal"
      ? this.level === 1
        ? this._renderHorizontalLevel1()
        : this._renderHorizontalLevel2()
      : this.level === 1
        ? this._renderVerticalLevel1()
        : this._renderVerticalLevel2();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSNavigationItem;
  }
}
