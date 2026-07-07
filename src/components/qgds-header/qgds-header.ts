import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { palettes } from "../../utils";
import { baseStyles } from "../../styles";
import { QgdsEvents } from "../../utils/events/event-controller";
import componentCSS from "./qgds-header.styles.scss?inline";
// Side-effect imports register the elements used in the default slot content:
// <qgds-logo> for the brand logo and <qgds-icon> for the mobile Search/Menu buttons.
import "../qgds-logo/qgds-logo.js";
import "../qgds-icon/qgds-icon.js";
import "../qgds-tile-button/qgds-tile-button.js";
import { QGDSAttributionBar } from "../..";

type QGDSPalette = keyof typeof palettes;

export const tagName = "qgds-header";
export type QGDSHeaderProps = InstanceType<typeof QGDSHeader>;

/**
 * The site header is a composite container made up of stacked full-width bands:
 *
 * 1. **Pre-header** — typically a `<qgds-attribution-bar>` with site-wide links
 *    (e.g. qld.gov.au, Contact us). Hidden below the desktop breakpoint.
 * 2. **Header content** — the brand logo, site name and search input. On mobile
 *    this collapses into a blue bar showing the logo plus Search and Menu buttons,
 *    with the site name in a band below.
 * 3. **Navigation** — a navigation band at the bottom.
 *
 * The component provides the layout shell only. The search input and navigation
 * are exposed as slots so consumers can inject and configure their own elements.
 *
 * The brand logo is a stacked coat-of-arms `<qgds-logo>` rendered by default in the
 * `logo` slot. Override the slot to supply your own `<qgds-logo>` (e.g. a different
 * preset, or a co-brand/custom lockup). The optional `site-name` is shown beside it.
 *
 * On mobile, the header shows Search and Menu buttons. Each button only toggles its
 * own open state (to switch its icon) and fires a payload-less event — the slotted
 * search / navigation component is responsible for showing and hiding itself:
 *
 * - **Search** flips `searchOpen` and fires `qgds-toggle-search-mobile`.
 * - **Menu** flips `menuOpen` and fires `qgds-toggle-nav-menu`.
 *
 * @tagname qgds-header
 *
 * @prop {String} [palette="default"] - Colour palette for main section of the Header component.
 * @prop {String} [site-name] - Optional site name shown beside the logo (desktop) or in its own band (mobile).
 * @prop {Boolean} [search-open=false] - Mobile Search button toggle state (drives the button icon only).
 * @prop {Boolean} [menu-open=false] - Mobile Menu button toggle state (drives the button icon only).
 *
 * @slot pre-header - Top band. Typically a `<qgds-attribution-bar>`. Hidden on mobile.
 * @slot logo - The brand logo. Defaults to a responsive `<qgds-logo>`; override to supply your own co-brand or custom logo.
 * @slot site-name - Overrides the `site-name` attribute with custom markup.
 * @slot search - Search input, e.g. a `<qgds-search-input>` with its own config.
 * @slot navigation - Bottom navigation band, e.g. a nav bar or mobile mega menu that manages its own open state.
 *
 * @fires qgds-toggle-search-mobile - Fired when the mobile Search button is pressed.
 * @fires qgds-toggle-nav-menu - Fired when the mobile Menu button is pressed.
 *
 * @example Standard usage — coat-of-arms logo plus a site name.
 * ```html
 * <qgds-header palette="default" site-name="Insert site name">
 *   <qgds-attribution-bar slot="pre-header" palette="bold"> … </qgds-attribution-bar>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <nav slot="navigation"> … </nav>
 * </qgds-header>
 * ```
 *
 * @example Custom logo — override the default `<qgds-logo>` in the `logo` slot.
 * ```html
 * <qgds-header site-name="Insert site name">
 *   <qgds-logo slot="logo" custom-logo="/my-logo.svg" custom-logo-alt="My agency"></qgds-logo>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <nav slot="navigation"> … </nav>
 * </qgds-header>
 * ```
 */
@customElement(tagName)
export class QGDSHeader extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true, useDefault: true })
  palette: QGDSPalette = "default";

  @property({ type: String, attribute: "site-name" })
  siteName?: string;

  @property({ type: Boolean, attribute: "search-open", reflect: true })
  searchOpen = false;

  @property({ type: Boolean, attribute: "menu-open", reflect: true })
  menuOpen = false;

  @state() private _preHeaderPalette: QGDSPalette = "bold";

  /** Whether custom markup has been slotted into the `site-name` slot. */
  @state() private _hasSiteNameSlot = false;

  /** Whether the `search` slot has content — drives the mobile Search button. */
  @state() private _hasSearchSlot = false;

  /** Whether the `navigation` slot has content — drives the mobile Menu button. */
  @state() private _hasNavSlot = false;

  private events = new QgdsEvents(this);

  /** The site name region shows only when there is a name to show. */
  private get _showSiteName(): boolean {
    return !!this.siteName || this._hasSiteNameSlot;
  }

  // `assignedNodes()` (no flatten) returns only real assignments, ignoring the
  // `${this.siteName}` fallback — so this is true only for slotted custom markup.
  private _handleSiteNameSlotChange = (e: Event): void => {
    this._hasSiteNameSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  // Look for a `<qgds-attribution-bar>` and, if found, reads its `palette`
  // to apply to the mobile Search/Menu buttons.
  // If not found, defaults to "bold" (the default palette for `<qgds-attribution-bar>`).
  private _handlePreHeaderSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;

    const attributionBar = slot
      .assignedElements({ flatten: true })
      .find((el): el is QGDSAttributionBar => el.tagName.toLowerCase() === "qgds-attribution-bar");

    this._preHeaderPalette = attributionBar?.palette ?? "bold";
  };

  // The Search button only flips `searchOpen` to switch its icon and emits
  // `qgds-toggle-search-mobile`; the slotted search component owns what happens next.
  private _toggleSearch = (): void => {
    this.searchOpen = !this.searchOpen;
    this.events.dispatch("toggle-search-mobile");
  };

  // Likewise, the Menu button only flips `menuOpen` for its icon and emits
  // `qgds-toggle-nav-menu`; the slotted mega menu opens/closes itself.
  private _toggleMenu = (): void => {
    this.menuOpen = !this.menuOpen;
    this.events.dispatch("toggle-nav-menu");
  };

  private _handleSearchSlotChange = (e: Event): void => {
    this._hasSearchSlot = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private _handleNavSlotChange = (e: Event): void => {
    this._hasNavSlot = (e.target as HTMLSlotElement).assignedElements().length > 0;
  };

  render() {
    return html`
      <header class="header">
        <div class="header-preheader">
          <slot name="pre-header" @slotchange=${this._handlePreHeaderSlotChange}></slot>
        </div>

        <div class="header-content">
          <div class="header-content-inner qgds-container">
            <div
              class=${classMap({
                "header-logo": true,
                [`header-mobile-palette-${this._preHeaderPalette}`]: true,
              })}
            >
              <slot name="logo">
                <qgds-logo logo="coa-stacked" alt="Queensland Government"></qgds-logo>
              </slot>
            </div>

            <div
              class=${classMap({
                "header-secondary": true,
                "is-empty": !this._showSiteName,
              })}
            >
              <span class="header-site-name" ?hidden=${!this._showSiteName}>
                <slot name="site-name" @slotchange=${this._handleSiteNameSlotChange}>${this.siteName}</slot>
              </span>
            </div>

            <div
              class=${classMap({
                "header-actions": true,
                [`header-mobile-palette-${this._preHeaderPalette}`]: true,
              })}
            >
              ${this._hasSearchSlot
                ? html`
                    <qgds-tile-button
                      label="Search"
                      icon-name="search"
                      class="header-action"
                      aria-controls="header-search-panel"
                      aria-expanded=${this.searchOpen ? "true" : "false"}
                      @click=${this._toggleSearch}
                    ></qgds-tile-button>
                  `
                : nothing}
              ${this._hasNavSlot
                ? html`
                    <qgds-tile-button
                      label="Menu"
                      icon-name="menu"
                      class="header-action"
                      aria-controls="header-nav-panel"
                      aria-expanded=${this.menuOpen ? "true" : "false"}
                      @click=${this._toggleMenu}
                    ></qgds-tile-button>
                  `
                : nothing}
            </div>

            <div id="header-search-panel" class="header-search">
              <slot name="search" @slotchange=${this._handleSearchSlotChange}></slot>
            </div>
          </div>
        </div>

        <div id="header-nav-panel" class="header-navigation">
          <slot name="navigation" @slotchange=${this._handleNavSlotChange}></slot>
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSHeader;
  }
}
