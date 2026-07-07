import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { BreakpointController } from "../../utils";
import qgdsBreakpoint from "../../styles/qgds-tokens/qgds-breakpoint";

// Styles
import { baseStyles, utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-navigation.styles.scss?inline";

// Component dependencies
import "../qgds-link-item/qgds-link-item";
import type { QGDSLinkItem } from "../qgds-link-item/qgds-link-item";
import "../qgds-link-column/qgds-link-column";
import { LinkColumnDirection } from "../qgds-link-column/qgds-link-column";
import "../qgds-tile-button/qgds-tile-button";

export type NavigationVariant = "default" | "dark";
export type NavigationOrientation = "horizontal" | "vertical";

/**
 * QGDS Navigation – Horizontal navigation bar.
 * Accepts `<qgds-link-item>` elements as children.
 *
 * @tagname qgds-navigation
 *
 * @website https://www.designsystem.qld.gov.au/components/navigation-horizontal
 * @uikit   https://www.figma.com/design/Si3LOWFTxpzSRCC8cvHGZ5/Sen-Test\?node-id\=292-1416
 *
 * @property {NavigationVariant} [variant="default"] - "default" (light bar) or "dark" (dark bar).
 * @property {string} [aria-label] - Accessible label for the `<nav>` landmark.
 *
 * @slot - Accepts `<qgds-link-item>` elements.
 *
 * @example
 * ```html
 * <qgds-navigation columns="3" layout="horizontal" columns-layout="horizontal">
 *   <qgds-link-item label="Home" href="/" only-icon icon-name="home" is-current></qgds-link-item>
 *   <qgds-link-item label="Services" href="/services" view-all-url="/services">
 *     <qgds-link-item label="Planning" href="/planning"></qgds-link-item>
 *     <qgds-link-item label="Environment" href="/environment"></qgds-link-item>
 *   </qgds-link-item>
 *   <qgds-link-item label="Contact" href="/contact"></qgds-link-item>
 * </qgds-navigation>
 * ```
 */
@customElement("qgds-navigation")
export class QGDSNavigation extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS), utilitiesStyles];

  /** Visual variant: "default" (light) or "dark". */
  @property({ type: String, reflect: true }) variant: NavigationVariant = "default";

  /** Layout: "horizontal" (mega-menu on click) or "vertical" (inline accordion toggle). */
  @property({ type: String, reflect: true }) orientation: NavigationOrientation = "horizontal";

  /** Layout passed to the auto-generated `<qgds-link-column>` inside each dropdown. */
  @property({ type: String, reflect: true, attribute: "columns-direction" }) columnsDirection: LinkColumnDirection =
    "horizontal";

  /** Number of columns for mega-menu dropdowns. */
  @property({ type: Number, reflect: true }) columns = 3;

  /** Accessible label applied to the `<nav>` landmark. */
  // @property({ type: String, attribute: "aria-label" }) navLabel = "main";

  /** internal orientation also responds to mobile view, independent of public orientation property. */
  @state() private _orientation = this.orientation;
  @state() private _isMobileOpen = false;

  @query("dialog") private _dialogElement!: HTMLDialogElement | null;

  // private
  private _breakpoint = new BreakpointController(this);
  private get _isMobile() {
    return qgdsBreakpoint[this._breakpoint.current] < qgdsBreakpoint.LG;
  }

  connectedCallback(): void {
    super.connectedCallback?.();

    document.addEventListener("qgds-navigation-toggle", this._toggleMobileNav);
    document.addEventListener("qgds-navigation-open", this._openMobileNav);
    document.addEventListener("qgds-navigation-close", this._closeMobileNav);
  }

  disconnectedCallback(): void {
    document.removeEventListener("qgds-navigation-toggle", this._toggleMobileNav);
    document.removeEventListener("qgds-navigation-open", this._openMobileNav);
    document.removeEventListener("qgds-navigation-close", this._closeMobileNav);
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

  protected willUpdate(): void {
    this._orientation = this._isMobile ? "vertical" : this.orientation;
    if (!this._isMobile) this._isMobileOpen = false;
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("_orientation") || changed.has("columnsDirection") || changed.has("columns")) {
      this._syncLayout();
    }
    if (changed.has("_isMobileOpen")) {
      if (this._isMobileOpen) this._dialogElement?.showModal();
      else this._dialogElement?.close();
    }
  }

  private _syncLayout(): void {
    // Only sync direct slot children — nested items inside dropdowns stay in standard mode
    this.querySelectorAll<QGDSLinkItem>(":scope > qgds-link-item").forEach((item) => {
      item.navigationOrientation = this._orientation;
      item.columnsDirection = this.columnsDirection;
      item.isNavItem = true;
      item.columns = this._orientation === "horizontal" ? this.columns : 1;
    });
  }

  private _onSlotChange = (): void => {
    this._syncLayout();
  };

  // When the mobile backdrop is clicked, close the menu
  private _handleDialogClick = (e: MouseEvent) => {
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

  private _renderNav = () => {
    const shouldRenderAsVertical = this.orientation === "vertical" || this._isMobile;

    return html`
      <nav
        class="navigation ${classMap({
          "qgds-palette-bold": this.variant === "dark",
          "qgds-palette-default": this.variant !== "dark",
          "is-vertical": this._orientation === "vertical",
          "is-horizontal": this._orientation === "horizontal",
        })}"
      >
        ${html`<div class="navigation-list ${classMap({ "qgds-container": !shouldRenderAsVertical })}" role="list">
          <slot @slotchange="${this._onSlotChange}"></slot>
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
            // "is-open": this._isMobileOpen,
            "qgds-palette-bold": this.variant !== "dark",
            "qgds-palette-default": this.variant === "dark",
          })}"
          @close=${() => (this._isMobileOpen = false)}
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
          <slot name="mobile-links"></slot>
        </dialog>`
      : this._renderNav();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-navigation": QGDSNavigation;
  }
}
