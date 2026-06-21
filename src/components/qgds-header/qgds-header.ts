import { LitElement, html, unsafeCSS, type PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { baseStyles } from "../../styles";
import { QgdsEvents } from "../../utils/events/event-controller";
import componentCSS from "./qgds-header.styles.scss?inline";
// The Queensland Government logo is hardcoded into the header, with two responsive
// variants: the stacked coat-of-arms on desktop and the wider "Delivering for
// Queensland" lockup on mobile. Both SVGs use `currentColor`, so they are inlined
// (not <img>) to be tinted via CSS (white on the blue bar, crest blue on desktop).
import logoStackedSVG from "./assets/coa-stacked.svg?raw";
import logoDeliveringSVG from "./assets/coa-delivering-for-qld.svg?raw";
// Side-effect import registers <qgds-icon> for the mobile Search/Menu buttons.
import "../qgds-icon/qgds-icon.js";

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
 * The main Queensland Government coat-of-arms logo is fixed and always shown — it
 * is not overridable. Beside it sits a secondary brand element with two usages:
 *
 * - **Standard** — set the optional `site-name` attribute. The site name is shown
 *   next to the coat-of-arms logo.
 * - **Co-brand** — omit `site-name` and slot your own logo into the `logo` slot.
 *   It takes the site name's place beside the fixed main logo.
 *
 * On mobile, the header shows Search and Menu buttons, both of which also dispatch
 * a `qgds-toggle` event (`detail.panel` of `"search"` / `"menu"` plus `detail.open`):
 *
 * - **Search** is presentational only (no mobile search design yet): reflect the
 *   event back via `search-open` to reveal the slotted search input.
 * - **Menu** toggles `menuOpen` and forwards it to the slotted navigation element
 *   as an `open` attribute, so a mega-menu component can show/hide itself. The
 *   header does not reveal the navigation band itself.
 *
 * @tagname qgds-header
 *
 * @prop {String} [site-name] - Optional site name shown beside the logo (desktop) or in its own band (mobile). Omit it for the custom-logo usage.
 * @prop {Boolean} [search-open=false] - When set, reveals the `search` slot on mobile.
 * @prop {Boolean} [menu-open=false] - Mobile menu open state. Forwarded to the slotted navigation element as an `open` attribute.
 *
 * @slot pre-header - Top band. Typically a `<qgds-attribution-bar>`. Hidden on mobile.
 * @slot logo - A co-brand logo shown beside the fixed main logo, in place of the site name. Only used when `site-name` is not set.
 * @slot site-name - Overrides the `site-name` attribute with custom markup.
 * @slot search - Search input, e.g. a `<qgds-search-input>` with its own config.
 * @slot navigation - Bottom navigation band, e.g. a nav bar or mobile mega menu. Receives an `open` attribute reflecting the mobile menu state.
 *
 * @fires {CustomEvent<{ panel: "search" | "menu", open: boolean }>} qgds-toggle - Fired when a mobile Search/Menu button is pressed.
 *
 * @example Standard usage — coat-of-arms logo plus a site name.
 * ```html
 * <qgds-header site-name="Insert site name">
 *   <qgds-attribution-bar slot="pre-header"> … </qgds-attribution-bar>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <nav slot="navigation"> … </nav>
 * </qgds-header>
 * ```
 *
 * @example Co-brand — no site name; the fixed main logo plus a slotted co-brand logo.
 * ```html
 * <qgds-header>
 *   <qgds-logo slot="logo" variant="co-brand"></qgds-logo>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <nav slot="navigation"> … </nav>
 * </qgds-header>
 * ```
 */
@customElement(tagName)
export class QGDSHeader extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String, attribute: "site-name" })
  siteName?: string;

  @property({ type: Boolean, attribute: "search-open", reflect: true })
  searchOpen = false;

  @property({ type: Boolean, attribute: "menu-open", reflect: true })
  menuOpen = false;

  @query('slot[name="navigation"]') private _navSlot?: HTMLSlotElement;

  /** Whether custom markup has been slotted into the `site-name` slot. */
  @state() private _hasSiteNameSlot = false;

  /** Whether a co-brand logo has been slotted into the `logo` slot. */
  @state() private _hasLogoSlot = false;

  private events = new QgdsEvents(this);

  /** The site name takes precedence; the co-brand logo only shows without it. */
  private get _showSiteName(): boolean {
    return !!this.siteName || this._hasSiteNameSlot;
  }

  /** The secondary brand area shows when there is a site name or a co-brand logo. */
  private get _showSecondary(): boolean {
    return this._showSiteName || this._hasLogoSlot;
  }

  // `assignedNodes()` (no flatten) returns only real assignments, ignoring the
  // `${this.siteName}` fallback — so this is true only for slotted custom markup.
  private _handleSiteNameSlotChange = (e: Event): void => {
    this._hasSiteNameSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private _handleLogoSlotChange = (e: Event): void => {
    this._hasLogoSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  // The mobile search panel has no design yet, so the Search button is purely
  // presentational: it announces intent via `qgds-toggle` and the consumer decides
  // what to do (e.g. reflect it back via `search-open`).
  private _toggleSearch = (): void => {
    this.events.dispatch("toggle", { panel: "search", open: !this.searchOpen });
  };

  // The navigation slot hosts a mega menu that styles itself on mobile, so the
  // Menu button just toggles `menuOpen` and forwards it to the slotted element as
  // an `open` attribute (see `_syncNavOpen`); the header does not reveal the band.
  private _toggleMenu = (): void => {
    this.menuOpen = !this.menuOpen;
    this.events.dispatch("toggle", { panel: "menu", open: this.menuOpen });
  };

  private _handleNavSlotChange = (): void => {
    this._syncNavOpen();
  };

  /** Forward the open state to the slotted navigation element(s) as `open`. */
  private _syncNavOpen(): void {
    for (const el of this._navSlot?.assignedElements() ?? []) {
      el.toggleAttribute("open", this.menuOpen);
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("menuOpen")) {
      this._syncNavOpen();
    }
  }

  render() {
    return html`
      <header class="header">
        <div class="header-preheader">
          <slot name="pre-header"></slot>
        </div>

        <div class="header-content">
          <div class="header-content-inner">
            <span class="header-logo" role="img" aria-label="Queensland Government">
              <span class="header-logo-stacked">${unsafeSVG(logoStackedSVG)}</span>
              <span class="header-logo-delivering">${unsafeSVG(logoDeliveringSVG)}</span>
            </span>

            <div class=${classMap({ "header-secondary": true, "is-empty": !this._showSecondary })}>
              <span class="header-site-name" ?hidden=${!this._showSiteName}>
                <slot name="site-name" @slotchange=${this._handleSiteNameSlotChange}>${this.siteName}</slot>
              </span>
              <span class="header-cobrand" ?hidden=${this._showSiteName}>
                <slot name="logo" @slotchange=${this._handleLogoSlotChange}></slot>
              </span>
            </div>

            <div class="header-actions">
              <button
                type="button"
                class="header-action"
                aria-controls="header-search-panel"
                aria-expanded=${this.searchOpen ? "true" : "false"}
                @click=${this._toggleSearch}
              >
                <qgds-icon
                  class="header-action-icon"
                  icon-id=${this.searchOpen ? "close" : "search"}
                  size="md"
                  aria-hidden="true"
                ></qgds-icon>
                <span class="header-action-label">Search</span>
              </button>
              <button
                type="button"
                class="header-action"
                aria-controls="header-nav-panel"
                aria-expanded=${this.menuOpen ? "true" : "false"}
                @click=${this._toggleMenu}
              >
                <qgds-icon
                  class="header-action-icon"
                  icon-id=${this.menuOpen ? "close" : "menu"}
                  size="md"
                  aria-hidden="true"
                ></qgds-icon>
                <span class="header-action-label">Menu</span>
              </button>
            </div>

            <div id="header-search-panel" class="header-search">
              <slot name="search"></slot>
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
