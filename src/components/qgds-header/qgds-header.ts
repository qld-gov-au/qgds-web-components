import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { generateUUID, scrubSlotContent } from "../../utils";
import { baseStyles } from "../../styles";
import { QgdsEvents } from "../../utils/events/event-controller";
import componentCSS from "./qgds-header.styles.scss?inline";
import type { QGDSPalette } from "../../types/common";

export type HeaderPalette = Extract<QGDSPalette, "default" | "bold" | "deep">;

// Component dependencies
import "../qgds-logo/qgds-logo.js";
import "../qgds-tile-button/qgds-tile-button.js";
import { QGDSAttributionBar } from "../..";
import type { QGDSSearchInput } from "../qgds-search-input/qgds-search-input.js";

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
 * `logo` slot. On mobile/tablet (below the desktop breakpoint) the default COA
 * logo always shows, regardless of any content provided in the `logo` slot —
 * a custom `logo` slot only takes effect at the desktop breakpoint. The optional
 * `site-name` is shown beside it.
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
 * @prop {HeaderPalette} [palette="default"] - Colour palette for the main content of the Header component. Header's colour palette is a subset of the QGDS colour palette.
 * @prop {String} [site-name] - Optional site name displayed besides COA, brand logo, or by its own.
 * @prop {String} [site-url="https://www.qld.gov.au"] - Site URL for linking the content in the header content (COA logo, brand logo, and site name). This is different from the Pre-header URL, which is set via the slotted `<qgds-attribution-bar>`.
 * @prop {Boolean} [hide-coa-logo=false] - Whether to hide the Coat of Arms logo. False by default. This can be used in Endorsed and Stand Alone brand sites where the Coat of Arms logo is not mandatory.
 * @prop {Boolean} [hide-mobile-bottom-row=false] - Whether to hide the bottom row on mobile / tablet screens.
 * @prop {MobileContentKey} [mobile-top-content="coa-logo"] - Preferred content for the top row on mobile/tablet. Defaults to `coa-logo` Coat of Arms logo. When the COA logo is set to be hidden, it falls back to available optional content (`brand-logo`, `preheader-url`, `site-name`).
 * @prop {Boolean} [search-open=false] - Mobile Search button toggle state (drives the button icon only).
 *
 * @slot pre-header - Pre-header content, typically a `<qgds-attribution-bar>`. Hidden below the desktop breakpoint.
 * @slot logo - Coat of Arms logo. Defaults to a stacked coat-of-arms `<qgds-logo>`. On mobile/tablet the default always shows, regardless of slot content — a custom logo here only takes effect at the desktop breakpoint. Mandatory on Master Brand, Sub Brand, and Co-Brand sites.
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
  palette: HeaderPalette = "default";

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

  @state() private _preHeaderPalette: HeaderPalette = "bold";

  @state() private _hasBrandLogo = false;

  @state() private _hasCustomCoaLogo = false;

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
   * Observes host light-DOM changes so brand-logo rendering can be controlled
   * without relying on slotchange bootstrap.
   */
  private _domObserver = new MutationObserver(() => {
    this._syncBrandLogoPresence();
  });

  /**
   * The url/label pair from the slotted attribution bar in the pre-header.
   */
  private _preHeaderURL: { url: string; label: string } = {
    url: "",
    label: "",
  };

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
    if (!this.hideCoaLogo) {
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
      "preheader-url": !!this._preHeaderURL.url,
      "site-name": !!this.siteName,
      "brand-logo": this._hasBrandLogo,
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
      [`qgds-palette-${this._preHeaderPalette}`]: main === key,
    };
  }

  protected firstUpdated(): void {
    this._syncCustomCoaLogoState();
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
    this._syncBrandLogoPresence();
    this._domObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["slot"],
    });
    document.addEventListener("click", this._handleOutsideSearchClick);
    document.addEventListener("qgds-navigation-closed", this._handleNavigationClosed);
    document.addEventListener("qgds-navigation-opened", this._handleNavigationOpened);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._domObserver.disconnect();
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

  private _handleBrandLogoSlotChange = (): void => {
    this._syncBrandLogoPresence();
    this._syncSlottedLogoHref("brand-logo");
  };

  private _syncBrandLogoPresence(): void {
    const hasBrandLogo = Array.from(this.children).some((el) => el.getAttribute("slot") === "brand-logo");
    if (this._hasBrandLogo === hasBrandLogo) return;

    this._hasBrandLogo = hasBrandLogo;
  }

  private _handleLogoSlotChange = (e: Event): void => {
    this._syncCustomCoaLogoState(e.target as HTMLSlotElement);
    this._syncSlottedLogoHref("logo");
  };

  private _syncCustomCoaLogoState(slot?: HTMLSlotElement): void {
    const logoSlot = slot ?? this.renderRoot.querySelector<HTMLSlotElement>('slot[name="logo"]');
    if (!logoSlot) return;

    // Check for user-provided light-DOM content assigned to `slot="logo"`.
    this._hasCustomCoaLogo = logoSlot.assignedElements().length > 0;
  }

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

  // Hide the search panel if the user clicks outside it or the toggle button.
  // This only updates local state; the public toggle event remains button-only.
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
  };

  private _handleNavSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    scrubSlotContent(slot, { "QGDS-NAVIGATION": 1 });
    const assigned = slot.assignedElements();
    const nav = assigned.length === 1 && assigned[0].tagName === "QGDS-NAVIGATION" ? assigned[0] : null;

    this._navElementId = nav ? (nav.id = nav.id || generateUUID()) : "";
  };

  /**
   * By default, the COA logo is always shown unless the `hide-coa-logo` attribute is set.
   *
   * Scenarios for COA logo rendering:
   * 1. When user does not provide a COA `logo`,
   * Renders the default COA (in 'logo' slot) for all viewports (mobile/tablet/desktop).
   *
   * 2. When user provides a COA logo,
   * Render the default COA logo on mobile/tablet regardless,
   * And only show the user-provided COA logo on desktop.
   */
  private _renderCoaLogo() {
    if (this.hideCoaLogo) return nothing;

    return html`
      <div
        class=${classMap({
          "header-coa-logo": true,
          ...this._positionClasses("coa-logo"),
        })}
      >
        ${this._hasCustomCoaLogo
          ? html`
              <qgds-logo
                class="coa-logo-mobile-default"
                logo="coa-delivering-for-qld"
                alt="Queensland Government"
                href=${this.siteUrl}
              ></qgds-logo>
            `
          : nothing}

        <slot
          name="logo"
          class=${classMap({
            "header-coa-logo-slot": true,
            "header-coa-logo-slot-custom": this._hasCustomCoaLogo,
          })}
          @slotchange=${this._handleLogoSlotChange}
        >
          <qgds-logo logo="coa-delivering-for-qld" alt="Queensland Government" href=${this.siteUrl}></qgds-logo>
        </slot>
      </div>
    `;
  }

  render() {
    return html`
      <header class="header">
        <div class="header-preheader">
          <slot name="pre-header" @slotchange=${this._handlePreHeaderSlotChange}></slot>
        </div>

        <div class="header-content">
          <div class="header-content-inner qgds-container">
            ${this._renderCoaLogo()}
            ${this._preHeaderURL.url
              ? html`
                  <div
                    class=${classMap({
                      "header-preheader-url": true,
                      ...this._positionClasses("preheader-url"),
                    })}
                  >
                    <a href=${this._preHeaderURL.url ?? "#"}>
                      ${this._preHeaderURL.label ? html`${this._preHeaderURL.label}` : nothing}
                    </a>
                  </div>
                `
              : nothing}
            ${this._hasBrandLogo
              ? html`
                  <div
                    class=${classMap({
                      "header-brand-logo": true,
                      ...this._positionClasses("brand-logo"),
                    })}
                  >
                    <slot name="brand-logo" @slotchange=${this._handleBrandLogoSlotChange}></slot>
                  </div>
                `
              : nothing}
            ${this.siteName
              ? html`
                  <div
                    class=${classMap({
                      "header-site-name": true,
                      ...this._positionClasses("site-name"),
                    })}
                  >
                    <a href=${this.siteUrl}> ${this.siteName ? html`${this.siteName}` : nothing} </a>
                  </div>
                `
              : nothing}

            <div
              class=${classMap({
                "header-actions": true,
                [`qgds-palette-${this._preHeaderPalette}`]: true,
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
