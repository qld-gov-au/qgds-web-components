import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { generateUUID, palettes, scrubSlotContent } from "../../utils";
import { baseStyles } from "../../styles";
import { QgdsEvents } from "../../utils/events/event-controller";
import componentCSS from "./qgds-header.styles.scss?inline";

// Component dependencies
import "../qgds-logo/qgds-logo.js";
import "../qgds-tile-button/qgds-tile-button.js";
import { QGDSAttributionBar } from "../..";

type QGDSPalette = keyof typeof palettes;
type MobileTopRow = "brand-logo" | "tagline" | "site-name";

export const tagName = "qgds-header";

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
 * @prop {String} [tagline] - Optional site tagline displayed on mobile only. Can be used for a tagline, URL or other secondary text. Hidden on desktop.
 * @prop {Boolean} [hide-coa-logo=false] - Whether to hide the brand logo. False by default.
 * @prop {Boolean} [hide-mobile-secondary-container=true] - Whether to show the secondary (bottom) container on mobile. True by default.
 * @prop {String} [mobile-top-container="site-name"] - Which element to display in the mobile top container. Options are "siteName" or "tagline".
 * @prop {Boolean} [search-open=false] - Mobile Search button toggle state (drives the button icon only).
 * @prop {Boolean} [menu-open=false] - Mobile Menu button toggle state (drives the button icon only).
 *
 * @slot pre-header - Top band. Typically a `<qgds-attribution-bar>`. Hidden on mobile.
 * @slot logo - The brand logo. Defaults to a responsive `<qgds-logo>`; override to supply your own co-brand or custom logo.
 * @slot site-name - Overrides the `site-name` attribute with custom markup.
 * @slot tagline - Overrides the `tagline` attribute with custom markup.
 * @slot search - Search input, e.g. a `<qgds-search-input>` with its own config.
 * @slot navigation - Bottom navigation band, e.g. a nav bar or mobile mega menu that manages its own open state.
 *
 * @fires qgds-toggle-search-mobile - Fired when the mobile Search button is pressed.
 * @fires qgds-toggle-nav-menu - Fired when the mobile Menu button is pressed.
 *
 * @example Standard usage - for qld.gov.au.
 * <qgds-header>
 *   <qgds-attribution-bar slot="pre-header" palette="bold"> … </qgds-attribution-bar>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <nav slot="navigation"> … </nav>
 * </qgds-header>
 *
 * @example Standard usage — coat-of-arms logo plus a site name.
 * ```html
 * <qgds-header site-name="Insert site name">
 *   <qgds-attribution-bar slot="pre-header" palette="bold"> … </qgds-attribution-bar>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <nav slot="navigation"> … </nav>
 * </qgds-header>
 * ```
 *
 * @example Custom brand logo — override the default `<qgds-logo>` in the `logo` slot.
 * ```html
 * <qgds-header site-name="Insert site name">
 *   <qgds-logo slot="brand-logo" custom-logo="/my-logo.svg" custom-logo-alt="My agency"></qgds-logo>
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

  @property({ type: String, attribute: "tagline" })
  tagline?: string;

  @property({ type: Boolean, attribute: "hide-coa-logo", reflect: true })
  hideCoaLogo = false;

  @property({ type: Boolean, attribute: "hide-mobile-secondary-container", reflect: true })
  hideMobileBottomRow = false;

  @property({ type: String, attribute: "mobile-top-container", reflect: true })
  mobileTopRow: MobileTopRow = "brand-logo";

  @property({ type: Boolean, attribute: "search-open", reflect: true })
  searchOpen = false;

  @state() private _preHeaderPalette: QGDSPalette = "bold";

  @state() private _hasLogoSlot = false;
  @state() private _hasSiteNameSlot = false;
  @state() private _hasBrandLogoSlot = false;
  @state() private _hasTaglineSlot = false;
  @state() private _hasSearchElement = false;

  @state() private _searchEl: (HTMLElement & { focusInput?: () => void; blurInput?: () => void }) | null = null;

  /** Whether the `navigation` slot has content — drives the mobile Menu button. */
  @state() private _hasNavElement = false;
  @state() private _navElementId = "";
  @state() private _menuOpen = false;

  private events = new QgdsEvents(this);

  private get _showCoaLogo(): boolean {
    return !this.hideCoaLogo && this._hasLogoSlot;
  }

  private get _showSiteName(): boolean {
    return !!this.siteName || this._hasSiteNameSlot;
  }

  private get _showBrandLogo(): boolean {
    return this._hasBrandLogoSlot;
  }

  private get _showTagline(): boolean {
    return !!this.tagline || this._hasTaglineSlot;
  }

  private get _bottomRowContent(): MobileTopRow {
    if (this._showCoaLogo) return "site-name"; // When COA logo is present, the bottom row is always the site brand.
    return this.mobileTopRow === "tagline" ? "brand-logo" : "tagline";
  }

  private get _siteNameIsTop(): boolean {
    return !this._showCoaLogo && this.mobileTopRow === "site-name";
  }

  private get _brandLogoIsTop(): boolean {
    return !this._showCoaLogo && this.mobileTopRow === "brand-logo";
  }

  private get _taglineIsTop(): boolean {
    return !this._showCoaLogo && this.mobileTopRow === "tagline";
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this._handleOutsideSearchClick);
    document.addEventListener("qgds-navigation-closed", this._handleNavigationClosed);
    document.addEventListener("qgds-navigation-opened", this._handleNavigationOpened);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleOutsideSearchClick);
    document.removeEventListener("qgds-navigation-closed", this._handleNavigationClosed);
    document.removeEventListener("qgds-navigation-opened", this._handleNavigationOpened);
  }

  firstUpdated(): void {
    const slot = this.shadowRoot?.querySelector('slot[name="logo"]') as HTMLSlotElement;
    this._hasLogoSlot = slot?.assignedElements({ flatten: true }).length > 0;

    const brandSlot = this.shadowRoot?.querySelector('slot[name="brand-logo"]') as HTMLSlotElement;
    this._hasBrandLogoSlot = brandSlot?.assignedElements({ flatten: true }).length > 0;
    console.log("_hasBrandLogoSlot firstUpdated:", this._hasBrandLogoSlot);
  }

  private _handleNavigationClosed = (): void => {
    this._menuOpen = false;
  };

  private _handleNavigationOpened = (): void => {
    this._menuOpen = true;
  };

  private _handleLogoSlotChange = (e: Event): void => {
    this._hasLogoSlot = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  };

  private _handleSiteNameSlotChange = (e: Event): void => {
    this._hasSiteNameSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private _handleBrandLogoSlotChange = (e: Event): void => {
    this._hasBrandLogoSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private _handleTaglineSlotChange = (e: Event): void => {
    this._hasTaglineSlot = (e.target as HTMLSlotElement).assignedNodes().length > 0;
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

    if (this.searchOpen) {
      // Focus on the search when search is opened.
      void this.updateComplete.then(() => this._searchEl?.focus());
    }
  };

  private _handleSearchSlotChange = (e: Event): void => {
    const assigned = (e.target as HTMLSlotElement).assignedElements({ flatten: true });
    this._hasSearchElement = assigned.length > 0;
    this._searchEl = (assigned[0] as (HTMLElement & { focusInput?: () => void }) | undefined) ?? null;
  };

  // Hide the search panel if the user clicks outside it or the toggle button
  private _handleOutsideSearchClick = (e: MouseEvent): void => {
    const path = e.composedPath();
    const searchPanel = this.renderRoot.querySelector("#header-search-panel");
    const toggleBtn = this.renderRoot.querySelector(".header-action[aria-controls='header-search-panel']");

    // Click landed inside the search panel or on the toggle button itself — ignore.
    if ((searchPanel && path.includes(searchPanel)) || (toggleBtn && path.includes(toggleBtn))) {
      return;
    }

    this.searchOpen = false;
  };

  private _handleNavSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    scrubSlotContent(slot, { "QGDS-NAVIGATION": 1 });
    const assignedElements = slot.assignedElements();
    if (assignedElements.length === 1 && assignedElements[0].tagName === "QGDS-NAVIGATION") {
      this._hasNavElement = true;
      const navigationElement = assignedElements[0];
      this._navElementId = navigationElement.id = navigationElement.id || generateUUID();
    }
  };

  // Default render - with COA as default logo, if no logo is slotted in
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
                "header-coa-logo": true,
                [`header-mobile-palette-${this._preHeaderPalette}`]: true,
              })}
              ?hidden=${this.hideCoaLogo}
            >
              <slot name="logo" ?hidden=${this.hideCoaLogo} @slotchange=${this._handleLogoSlotChange}>
                ${!this.hideCoaLogo
                  ? html`<qgds-logo logo="coa-delivering-for-qld" alt="Queensland Government"></qgds-logo>`
                  : nothing}
              </slot>
            </div>

            <div
              class=${classMap({
                "header-brand-logo": true,
                [`header-mobile-palette-${this._preHeaderPalette}`]: true,
                "is-mobile-top-row": this._brandLogoIsTop,
              })}
              ?hidden=${!this.hideCoaLogo && this._showBrandLogo}
            >
              <slot name="brand-logo" @slotchange=${this._handleBrandLogoSlotChange}> </slot>
            </div>
            ${this._taglineIsTop
              ? html`
                  <div
                    class=${classMap({
                      "header-tagline": true,
                      [`header-mobile-palette-${this._preHeaderPalette}`]: true,
                      "is-mobile-top-row": this._taglineIsTop,
                    })}
                    ?hidden=${!this._showTagline}
                  >
                    <slot name="tagline" @slotchange=${this._handleTaglineSlotChange}>
                      ${this.tagline ? html`<span class="tagline">${this.tagline}</span>` : nothing}
                    </slot>
                  </div>
                `
              : nothing}

            <!-- By default, when COA exists, site name display on 'sub' grid area on desktop & mobile -->
            <!-- When COA is hidden, site name grid area is 'sub' by default. Or when specified by mobile-top-container -->
            <div
              class=${classMap({
                "header-site-name": true,
                "is-mobile-top-row": this.hideCoaLogo && this._siteNameIsTop,
                [`header-mobile-palette-${this._preHeaderPalette}`]: this.hideCoaLogo && this._siteNameIsTop,
                "hide-mobile": this.hideMobileBottomRow && !this._siteNameIsTop,
              })}
              ?hidden=${!this._showSiteName}
            >
              <slot name="site-name" @slotchange=${this._handleSiteNameSlotChange}>
                ${this.siteName ? html`<span>${this.siteName}</span>` : nothing}
              </slot>
            </div>

            <div
              class=${classMap({
                "header-actions": true,
                [`header-mobile-palette-${this._preHeaderPalette}`]: true,
              })}
            >
              ${this._hasSearchElement
                ? html`
                    <qgds-tile-button
                      label=${this.searchOpen ? "Close" : "Search"}
                      icon-name=${this.searchOpen ? "close" : "search"}
                      class="header-action"
                      aria-controls="header-search-panel"
                      aria-expanded=${this.searchOpen ? "true" : "false"}
                      @click=${this._toggleSearch}
                    ></qgds-tile-button>
                  `
                : nothing}
              ${this._hasNavElement
                ? html`
                    <qgds-tile-button
                      label="Menu"
                      icon-name="menu"
                      class="header-action"
                      aria-controls=${this._navElementId}
                      aria-expanded=${this._menuOpen}
                      @click=${() => this.events.dispatch("navigation-open")}
                    ></qgds-tile-button>
                  `
                : nothing}
            </div>

            <div
              id="header-search-panel"
              class="header-search ${this.searchOpen ? "searchOpenTrue" : "searchOpenFalse"}"
            >
              <slot name="search" @slotchange=${this._handleSearchSlotChange}></slot>
            </div>
          </div>
        </div>

        <slot name="navigation" @slotchange=${this._handleNavSlotChange}></slot>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSHeader;
  }
}
