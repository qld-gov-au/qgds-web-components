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
import type { QGDSSearchInput } from "../qgds-search-input/qgds-search-input.js";

type QGDSPalette = keyof typeof palettes;

/**
 * The Coat of Arms logo is prioritised as 'main' row occupant.
 * It is always shown unless the `hide-coa-logo` attribute is set.
 */
const COA_LOGO = "coa-logo" as const;

/**
 * Optional content eligible for the mobile 'main' row when the COA logo is hidden.
 * `mobileTopContent` picks a preferred one of these (see `_getPreferredMain`).
 */
const MAIN_CONTENT_KEYS = ["brand-logo", "preheader-url", "site-name"] as const;

/**
 * Optional content eligible for the mobile 'sub' row.
 */
const SUB_CONTENT_KEYS = ["brand-logo", "site-name"] as const;

/** Any content (non-COA) key that is eligible for the main row when the COA logo is hidden. */
type MainContentKey = (typeof MAIN_CONTENT_KEYS)[number];

/** Content key that is eligible for the sub row. */
type SubContentKey = (typeof SUB_CONTENT_KEYS)[number];

/** Any content kind that can occupy the mobile main row: the COA logo, plus every optional main content. */
type MobileContentKey = typeof COA_LOGO | MainContentKey;

export const tagName = "qgds-header";

/**
 * The site header is a composite container made up of stacked full-width bands:
 *
 * 1. **Pre-header** — typically a `<qgds-attribution-bar>` with site-wide links
 *    (e.g. qld.gov.au, Contact us). Hidden below the desktop breakpoint.
 * 2. **Header content** — the Coat of Arms logo, site name, and search input. On mobile
 *    this collapses into a blue bar showing the content plus Search and Menu buttons,
 *    with either site name or user selected mobile content in a band below.
 * 3. **Navigation** — a navigation band on desktop; a modal drawer on mobile.
 *
 * The component provides the layout shell only. The search input and navigation
 * are exposed as slots so consumers can inject and configure their own elements.
 *
 * The logo is a stacked coat-of-arms `<qgds-logo>` rendered by default in the
 * `logo` slot. The optional `site-name` is shown beside it.
 * Optional `brand-logo` slot is available for Endorsed and Stand Alone brand sites.
 * `brand-logo` can render with or without the COA logo, depending on layout and viewport rules.
 *
 * On mobile, the header shows Search and Menu buttons. Each button only toggles its
 * own open state (to switch its icon) and fires a payload-less event — the slotted
 * search / navigation component is responsible for showing and hiding itself:
 *
 * - **Search** flips `searchOpen` and fires `qgds-toggle-search-mobile`.
 * - **Menu** fires `qgds-navigation-open`.
 *
 * @tagname qgds-header
 *
 * @prop {String} [palette="default"] - Colour palette for main section of the Header component.
 * @prop {String} [site-name] - Optional site name displayed besides COA, brand logo, or by its own.
 * @prop {String} [site-url="https://www.qld.gov.au"] - Site URL for linking the content in the main and sub grid areas, which are the COA logo, brand logo, and site name.
 * @prop {Boolean} [hide-coa-logo=false] - Whether to hide the Coat of Arms logo. False by default.
 * @prop {Boolean} [hide-mobile-bottom-row=false] - Whether to hide the bottom row on mobile.
 * @prop {String} [mobile-top-content="coa-logo"] - Preferred content for the top row on mobile. Defaults to `coa-logo`. When the COA logo is hidden, `coa-logo` is ignored and the top row falls back to available optional content (`brand-logo`, `preheader-url`, `site-name`).
 * @prop {Boolean} [search-open=false] - Mobile Search button toggle state (drives the button icon only).
 *
 * @slot pre-header - Pre-header content, typically a `<qgds-attribution-bar>`. Hidden below the desktop breakpoint.
 * @slot logo - Coat of Arms logo. Defaults to a stacked coat-of-arms `<qgds-logo>`. Mandatory on Master Brand, Sub Brand, and Co-Brand sites.
 * @slot brand-logo - Optional brand logo. Can render with or without the COA logo, depending on layout and viewport rules.
 * @slot search - Optional search input component. Typically a `<qgds-search-input>`.
 * @slot navigation - Optional navigation component. Must be a single `<qgds-navigation>` element.
 *
 * @fires qgds-toggle-search-mobile - Fired when the mobile Search button is pressed.
 * @fires qgds-navigation-open - Fired when the mobile Menu button is pressed.
 *
 * @example Standard usage - for qld.gov.au.
 * ```html
 * <qgds-header>
 *   <qgds-attribution-bar slot="pre-header" palette="bold"> … </qgds-attribution-bar>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <qgds-navigation slot="navigation"> … </qgds-navigation>
 * </qgds-header>
 * ```
 *
 * @example Standard usage — coat-of-arms logo plus a site name.
 * ```html
 * <qgds-header site-name="Insert site name">
 *   <qgds-attribution-bar slot="pre-header" palette="bold"> … </qgds-attribution-bar>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <qgds-navigation slot="navigation"> … </qgds-navigation>
 * </qgds-header>
 * ```
 *
 * @example Custom brand logo (COA hidden) with a site name.
 * ```html
 * <qgds-header site-name="Insert site name" hide-coa-logo>
 *   <qgds-logo slot="brand-logo" custom-logo="/my-logo.svg" custom-logo-alt="My agency"></qgds-logo>
 *   <qgds-search-input slot="search"></qgds-search-input>
 *   <qgds-navigation slot="navigation"> … </qgds-navigation>
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

  @property({ type: String, attribute: "site-url", useDefault: true })
  siteUrl = "https://www.qld.gov.au";

  @property({ type: Boolean, attribute: "hide-coa-logo", reflect: true })
  hideCoaLogo = false;

  @property({ type: Boolean, attribute: "hide-mobile-bottom-row", reflect: true })
  hideMobileBottomRow = false;

  @property({ type: String, attribute: "mobile-top-content", reflect: true, useDefault: true })
  mobileTopContent: MobileContentKey = COA_LOGO;

  @property({ type: Boolean, attribute: "search-open", reflect: true })
  searchOpen = false;

  @state() private _preHeaderPalette: QGDSPalette = "bold";

  @state() private _hasBrandLogo = false;

  /**
   * The slotted search element, or `null` if the `search` slot is empty.
   * Doubles as the "is there a search element" flag — no separate boolean to
   * keep in sync.
   */
  @state() private _searchEl: QGDSSearchInput | null = null;

  /**
   * The `id` of the slotted `<qgds-navigation>` element (assigned one via
   * `generateUUID()` if it doesn't already have one), or `""` if the slot is
   * empty / doesn't contain exactly one `<qgds-navigation>`. Doubles as the
   * "is there a nav element" flag.
   */
  @state() private _navElementId = "";

  /**
   * Whether the mobile menu is open.
   */
  @state() private _menuOpen = false;

  /**
   * Event manager instance for this component.
   */
  private events = new QgdsEvents(this);

  /**
   * The url/label pair from the slotted attribution bar in the pre-header.
   */
  private _preHeaderURL: { url: string; label: string } = {
    url: "",
    label: "",
  };

  /**
   * The COA logo always renders something, unless it isn't explicitly hidden.
   * Either user-supplied content in the `logo` slot, or the default `<qgds-logo>` fallback
   * `hideCoaLogo` flag prevents the COA logo from rendering.
   */
  private get _showCoaLogo(): boolean {
    return !this.hideCoaLogo;
  }

  private get _showSiteName(): boolean {
    return !!this.siteName;
  }

  private get _showBrandLogo(): boolean {
    return this._hasBrandLogo;
  }

  private get _showPreHeaderURL(): boolean {
    return !!this._preHeaderURL.url;
  }

  /**
   * Determines the user preferred main mobile content when the COA logo is hidden.
   */
  private _getPreferredMain(preferred: MobileContentKey, hasContent: Record<MainContentKey, boolean>): MainContentKey {
    const preferredOptional: MainContentKey = preferred === COA_LOGO ? "preheader-url" : preferred;
    if (hasContent[preferredOptional]) return preferredOptional;

    return MAIN_CONTENT_KEYS.find((key) => hasContent[key]) ?? "site-name";
  }

  /**
   * Returns content for the mobile 'main' row.
   * COA Logo is always preferred if it is visible, otherwise the user preferred content is used.
   */
  private _getMobileMain(preferred: MobileContentKey, hasContent: Record<MainContentKey, boolean>): MobileContentKey {
    if (this._showCoaLogo) {
      return COA_LOGO;
    }

    return this._getPreferredMain(preferred, hasContent);
  }

  /**
   * Returns the non-main optional content for the mobile 'sub' row.
   */
  private _getMobileSub(main: MobileContentKey, hasContent: Record<MainContentKey, boolean>): SubContentKey {
    const availableSubContent = SUB_CONTENT_KEYS.find((key) => key !== main && hasContent[key]);

    return availableSubContent ?? SUB_CONTENT_KEYS.find((key) => key !== main) ?? "site-name";
  }

  /**
   * Returns the current mobile layout, including 'main' and 'sub' rows content.
   */
  private get _mobileLayout(): { main: MobileContentKey; sub: SubContentKey | null } {
    const hasContent: Record<MainContentKey, boolean> = {
      "preheader-url": this._showPreHeaderURL,
      "site-name": this._showSiteName,
      "brand-logo": this._showBrandLogo,
    };

    const main = this._getMobileMain(this.mobileTopContent, hasContent);

    if (this.hideMobileBottomRow) {
      return { main, sub: null };
    }

    const sub = this._getMobileSub(main, hasContent);

    return { main, sub };
  }

  /**
   * Returns classMap fragment for an element that can occupy the mobile main or sub row.
   */
  private _positionClasses(key: MobileContentKey) {
    const { main, sub } = this._mobileLayout;
    return {
      "is-mobile-main": main === key,
      "is-mobile-sub": sub === key,
      [`top-row-palette-${this._preHeaderPalette}`]: main === key,
    };
  }

  protected firstUpdated(): void {
    this._syncSlottedLogoHref("logo");
    this._syncSlottedLogoHref("brand-logo");
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("siteUrl")) {
      this._syncSlottedLogoHref("logo");
      this._syncSlottedLogoHref("brand-logo");
    }
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

  private _handleNavigationClosed = (): void => {
    this._menuOpen = false;
  };

  private _handleNavigationOpened = (): void => {
    this._menuOpen = true;
  };

  private _handleBrandLogoSlotChange = (e: Event): void => {
    const hasContent = (e.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
    if (this._hasBrandLogo === hasContent) return;

    this._hasBrandLogo = hasContent;
    this._syncSlottedLogoHref("brand-logo");
  };

  private _handleLogoSlotChange = (): void => {
    this._syncSlottedLogoHref("logo");
  };

  private _syncSlottedLogoHref(slotName: "logo" | "brand-logo"): void {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>(`slot[name="${slotName}"]`);
    if (!slot) return;

    const slottedLogo = slot
      .assignedElements({ flatten: true })
      .find((el): el is HTMLElement => el.tagName === "QGDS-LOGO");

    if (!slottedLogo) return;

    slottedLogo.setAttribute("href", this.siteUrl);
  }

  /**
   * Gets the palette of the slotted `<qgds-attribution-bar>` in the `pre-header` slot, if present.
   * If not present, defaults to "bold" (the default palette for `<qgds-attribution-bar>`).
   * This palette is applied to the mobile 'main' row.
   */
  private _handlePreHeaderSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;

    const attributionBar = slot
      .assignedElements({ flatten: true })
      .find((el): el is QGDSAttributionBar => el.tagName.toLowerCase() === "qgds-attribution-bar");

    this._preHeaderPalette = attributionBar?.palette ?? "bold";
    this._preHeaderURL = {
      url: attributionBar?.url ?? "",
      label: attributionBar?.label ?? "",
    };
  };

  /**
   * Toggles the mobile search button, to switch its icon and dispatches the `qgds-toggle-search-mobile` event.
   */
  private _toggleSearch = (): void => {
    this.searchOpen = !this.searchOpen;
    this.events.dispatch("toggle-search-mobile");

    if (this.searchOpen) {
      void this.updateComplete.then(() => this._searchEl?.focus());
    }
  };

  private _handleSearchSlotChange = (e: Event): void => {
    const assigned = (e.target as HTMLSlotElement).assignedElements({ flatten: true });
    this._searchEl = (assigned[0] as QGDSSearchInput | undefined) ?? null;
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

    if (!this.searchOpen) return;
    this.searchOpen = false;
    this.events.dispatch("toggle-search-mobile");
  };

  private _handleNavSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    scrubSlotContent(slot, { "QGDS-NAVIGATION": 1 });
    const assigned = slot.assignedElements();
    const nav = assigned.length === 1 && assigned[0].tagName === "QGDS-NAVIGATION" ? assigned[0] : null;

    this._navElementId = nav ? (nav.id = nav.id || generateUUID()) : "";
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
                "header-coa-logo": true,
                ...this._positionClasses("coa-logo"),
              })}
              ?hidden=${this.hideCoaLogo}
            >
              <slot name="logo" @slotchange=${this._handleLogoSlotChange}>
                ${!this.hideCoaLogo
                  ? html`<qgds-logo
                      logo="coa-delivering-for-qld"
                      alt="Queensland Government"
                      href=${this.siteUrl}
                    ></qgds-logo>`
                  : nothing}
              </slot>
            </div>

            <div
              class=${classMap({
                "header-preheader-url": true,
                ...this._positionClasses("preheader-url"),
              })}
              ?hidden=${!this._showPreHeaderURL}
            >
              <a href=${this._preHeaderURL.url ?? "#"}>
                ${this._preHeaderURL.label ?? this._preHeaderURL.url ?? nothing}
              </a>
            </div>

            <div
              class=${classMap({
                "header-brand-logo": true,
                ...this._positionClasses("brand-logo"),
              })}
              ?hidden=${!this._showBrandLogo}
            >
              <slot name="brand-logo" @slotchange=${this._handleBrandLogoSlotChange}></slot>
            </div>

            <div
              class=${classMap({
                "header-site-name": true,
                ...this._positionClasses("site-name"),
              })}
              ?hidden=${!this._showSiteName}
            >
              <a href=${this.siteUrl}> ${this.siteName ? html`${this.siteName}` : nothing} </a>
            </div>

            <div
              class=${classMap({
                "header-actions": true,
                [`top-row-palette-${this._preHeaderPalette}`]: true,
              })}
            >
              ${this._searchEl
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
              ${this._navElementId
                ? html`
                    <qgds-tile-button
                      label="Menu"
                      icon-name="menu"
                      class="header-action"
                      aria-controls=${this._navElementId}
                      aria-expanded=${this._menuOpen ? "true" : "false"}
                      @click=${() => this.events.dispatch("navigation-open")}
                    ></qgds-tile-button>
                  `
                : nothing}
            </div>

            <div id="header-search-panel" class="header-search">
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
