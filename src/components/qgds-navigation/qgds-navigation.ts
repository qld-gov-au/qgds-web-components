import { LitElement, PropertyValues, html, unsafeCSS } from "lit";
import { customElement, property, query, queryAssignedElements, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { BreakpointController, QgdsEvents } from "../../utils";
import qgdsBreakpoint from "../../styles/qgds-tokens/qgds-breakpoint";

// Styles
import { baseStyles, utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-navigation.styles.scss?inline";

// Component dependencies
import { QGDSNavigationItem } from "./qgds-navigation-item";
import "../qgds-tile-button/qgds-tile-button";
import { QGDSPalette } from "../../types/common";

export type NavigationPalette = Extract<QGDSPalette, "default" | "bold">;
export type NavigationMobilePalette = Extract<QGDSPalette, "default" | "bold" | "deep">;
export type NavigationVariant = "horizontal" | "vertical";
export const tagName = "qgds-navigation";

/**
 * QGDS Navigation – Responsive navigation bar for primary site navigation.
 * Accepts `<qgds-navigation-item>` elements in the default slot and renders them
 * as a horizontal bar on desktop or a mobile drawer below the large breakpoint.
 *
 * @tagname qgds-navigation
 *
 * @website https://www.designsystem.qld.gov.au/components/navigation-horizontal
 * @uikit   https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-Kit?node-id=5990-97604
 *
 * @property {NavigationPalette} [palette="default"] - "default" (light bar) or "bold" (dark bar) theme.
 * @property {NavigationMobilePalette} [paletteMobile] - Apply a palette to the Mobile drawer, will be applied to the drawer header, and mobile items. If left blank, will be the inverse of "palette" value.
 * @property {NavigationVariant} [variant="horizontal"] - Layout variant. Horizontal by default, switching to vertical in the mobile drawer view.
 * @property {string} [navigationLabel="Main"] - Accessible label for the inner `<nav>` landmark.
 *
 * @slot - Accepts `<qgds-navigation-item>` elements for the main navigation list.
 * @slot mobile-links - Optional additional links shown inside the mobile drawer beneath the main navigation list.
 *
 * @event qgds-navigation-opened - Fired when the mobile drawer opens.
 * @event qgds-navigation-closed - Fired when the mobile drawer closes.
 *
 * @example
 * ```html
 * <qgds-navigation palette="default" variant="horizontal" navigation-label="Primary">
 *   <qgds-navigation-item label="Home" href="/"></qgds-navigation-item>
 *   <qgds-navigation-item label="Services" href="/services">
 *     <qgds-navigation-item label="Planning" href="/planning"></qgds-navigation-item>
 *     <qgds-navigation-item label="Environment" href="/environment"></qgds-navigation-item>
 *   </qgds-navigation-item>
 *   <qgds-navigation-item label="Contact" href="/contact"></qgds-navigation-item>
 * </qgds-navigation>
 * ```
 */
@customElement(tagName)
export class QGDSNavigation extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS), utilitiesStyles];

  @property({ type: String, reflect: true, useDefault: true }) palette: NavigationPalette = "default";
  @property({ type: String, reflect: true, attribute: "palette-mobile" }) paletteMobile?: NavigationMobilePalette;
  @property({ type: String, reflect: true, useDefault: true }) variant: "horizontal" | "vertical" = "horizontal";
  @property({ type: String, attribute: "navigation-label", useDefault: true }) navigationLabel = "Main";

  // internal orientation also responds to mobile view, independent of public variant property.
  @state() private _orientation: NavigationVariant = this.variant === "horizontal" ? "horizontal" : "vertical";
  @state() private _isMobileOpen = false;

  @query("dialog") private _dialogElement!: HTMLDialogElement | null;
  @queryAssignedElements() private _assignedItems!: HTMLElement[];
  @queryAssignedElements({ slot: "mobile-cta" }) private _assignedMobileCTAItems!: HTMLElement[];

  // private
  private _breakpoint = new BreakpointController(this);
  private get _isMobile() {
    return qgdsBreakpoint[this._breakpoint.current] < qgdsBreakpoint.LG;
  }
  private _events = new QgdsEvents(this);
  private get _paletteMobile(): NavigationMobilePalette {
    return (this.paletteMobile ?? this.palette === "default") ? "bold" : "default";
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("qgds-open", this._handleItemOpen);
    document.addEventListener("qgds-navigation-toggle", this._toggleMobileNav);
    document.addEventListener("qgds-navigation-open", this._openMobileNav);
    document.addEventListener("qgds-navigation-close", this._closeMobileNav);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("qgds-open", this._handleItemOpen);
    document.removeEventListener("qgds-navigation-toggle", this._toggleMobileNav);
    document.removeEventListener("qgds-navigation-open", this._openMobileNav);
    document.removeEventListener("qgds-navigation-close", this._closeMobileNav);
  }

  protected willUpdate(): void {
    this._orientation = this._isMobile ? "vertical" : this.variant;
    if (!this._isMobile) this._isMobileOpen = false;
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("_orientation")) {
      this._syncChildren();
    }
    if (changed.has("_isMobileOpen")) {
      if (this._isMobileOpen) {
        this._dialogElement?.showModal();
        this._events.dispatch("navigation-opened");
      } else {
        this._dialogElement?.close();
        this._events.dispatch("navigation-closed");
      }
    }
  }

  private _openMobileNav = () => {
    if (this._isMobile) this._isMobileOpen = true;
  };

  private _closeMobileNav = () => {
    if (this._isMobile) this._isMobileOpen = false;
  };

  private _toggleMobileNav = () => {
    if (this._isMobile) this._isMobileOpen = !this._isMobileOpen;
  };

  private _syncChildren = (): void => {
    this._assignedItems.forEach((item) => {
      if (item instanceof QGDSNavigationItem) {
        item.variant = this._orientation;
        item.setAttribute("role", "listitem");
      }
    });
  };

  private _syncCTAItems = (): void => {
    this._assignedMobileCTAItems.forEach((item) => {
      if (item instanceof QGDSNavigationItem) {
        item.variant = "mobile-cta";
      }
    });
  };

  // When the mobile backdrop is clicked, close the menu
  // Because we use a native HTML dialog, the backdrop is a pseudoelement cannot have event listener directly
  private _handleDialogClick = (e: MouseEvent) => {
    // A synthetic click event will be fired when dropdown button is triggered via keypress.
    // In this case, do not do anything since the pointer coordinates are not relevant.
    // event.detail = 0 for click events fired via keypress.
    if (e.detail === 0) return;

    const rect = this._dialogElement?.getBoundingClientRect();
    const isInDialog =
      rect &&
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      this._closeMobileNav();
    }
  };

  private _handleItemOpen = (e: Event) => {
    if (this._orientation === "horizontal") {
      this._assignedItems.forEach((item) => {
        if (item !== e.target && item instanceof QGDSNavigationItem) {
          item.isOpen = false;
        }
      });
    }
  };

  private _renderNav = () => {
    return html`
      <nav
        class="navigation ${classMap({
          "qgds-palette-bold": this.palette === "bold",
          "qgds-palette-default": this.palette !== "bold",
          "is-vertical": this._orientation === "vertical",
          "is-horizontal": this._orientation === "horizontal",
        })}"
        aria-label=${this.navigationLabel || "Main"}
      >
        ${html`<div
          class="navigation-list ${classMap({ "qgds-container": this._orientation === "horizontal" })}"
          role="list"
        >
          <slot @slotchange="${this._syncChildren}"></slot>
        </div>`}
      </nav>
    `;
  };

  render() {
    return this._isMobile
      ? // The native dialog already has key event handling
        // eslint-disable-next-line lit-a11y/click-events-have-key-events
        html`<dialog
          class="drawer ${classMap({
            "qgds-palette-bold": this._paletteMobile === "bold",
            "qgds-palette-default": this._paletteMobile === "default",
            "qgds-palette-deep": this._paletteMobile === "deep",
          })}"
          @close=${() => {
            this._isMobileOpen = false;
          }}
          @click=${this._handleDialogClick}
        >
          <div class="drawer-header flex align-items-center">
            <span class="flex-1">Menu</span>
            <qgds-tile-button
              class="align-self-end"
              icon-name="close"
              label="Close"
              @click=${this._closeMobileNav}
            ></qgds-tile-button>
          </div>
          ${this._renderNav()}
          <slot name="mobile-cta" @slotchange=${this._syncCTAItems}></slot>
        </dialog>`
      : this._renderNav();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSNavigation;
  }
}
