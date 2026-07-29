import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, queryAssignedElements, query } from "lit/decorators.js";
import { baseStyles } from "../../styles";
import { classMap } from "lit/directives/class-map.js";
import componentCSS from "./qgds-tabs.styles.scss?inline";
import "../qgds-icon/qgds-icon.js";
import { ICON_NAMES, type IconName } from "../qgds-icon/icon-names";
import { palettes } from "../../utils";

interface TabItem {
  label: string;
  iconName?: IconName;
}

const ICON_NAME_SET = new Set<string>(ICON_NAMES as readonly string[]);

/**
 * Tabs are UI controls used to organise the content of a page into multiple panes where users can see one pane at a time.
 *
 * @tag qgds-tabs
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=25951-236134&p=f&m=dev
 * @website https://www.designsystem.qld.gov.au/components/tabs
 *
 * @example
 * <qgds-tabs palette="deep" palette-underlay="bold">
 *    <qgds-tabs-item label="Tab label 1" icon-name="home" >Tab1 Content</qgds-tabs-item>
 *    <qgds-tabs-item label="Tab label 2" icon-name="user" >Tab2 Content</qgds-tabs-item>
 *    <qgds-tabs-item label="Tab label 3" icon-name="settings" >Tab3 Content</qgds-tabs-item>
 * </qgds-tabs>
 *
 * @slot - The tabs items, which should be implemented using {@link qgds-tabs-item}
 *
 */

@customElement("qgds-tabs")
export class QGDSTabs extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @state() private _activeIndex = 0;
  @state() private _tabs: TabItem[] = [];
  @state() private _showLeftScroll = false;
  @state() private _showRightScroll = false;
  @state() private _parentContext = "default";

  @query(".nav") private _nav!: HTMLElement;

  private _observer?: MutationObserver;

  @queryAssignedElements({ flatten: true }) private _slottedItems!: HTMLElement[];

  // Track parent palette class changes so scroll overlays can match surrounding context.
  connectedCallback() {
    super.connectedCallback();
    this._updateParentContext();

    this._observer = new MutationObserver(() => {
      this._updateParentContext();
    });
    const parent = this.parentElement;

    if (!parent) return;

    this._observer.observe(parent, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // Remove observers and listeners attached during component lifecycle setup.
  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._nav?.removeEventListener("scroll", this._handleNavScroll);

    window.removeEventListener("resize", this._handleNavScroll);
  }

  // Delay nav setup until first paint so dimensions and overflow state are measurable.
  firstUpdated() {
    requestAnimationFrame(() => {
      this._initTabsScroll();
    });
  }

  // Derive the nearest supported palette from parent classes and store a safe default.
  private _updateParentContext() {
    const paletteList = Object.keys(palettes);

    const classList = this.parentElement?.classList;

    this._parentContext = paletteList.find((palette) => classList?.contains(`qgds-palette-${palette}`)) ?? "default";
  }

  // Slot changes can add/remove tabs, so re-sync labels/icons and panel visibility.
  private _handleSlotChange = () => {
    this._syncTabs();
  };

  // Build the render model from slotted tab items using their public attributes.
  private _syncTabs() {
    this._tabs = this._slottedItems.map((item) => ({
      // Ignore unknown icon tokens so qgds-icon only receives supported icon ids.
      iconName: (() => {
        const rawIconName = item.getAttribute("icon-name");
        return rawIconName && ICON_NAME_SET.has(rawIconName) ? (rawIconName as IconName) : undefined;
      })(),
      label: item.getAttribute("label") ?? "",
    }));

    this._updatePanels();
  }

  // Keep aria linkage and hidden state in sync with the active tab index.
  private _updatePanels() {
    this._slottedItems.forEach((item, index) => {
      item.setAttribute("aria-labelledby", `tab-${index}`);

      item.setAttribute("id", `panel-${index}`);
      item.setAttribute("role", "tabpanel");

      item.toggleAttribute("hidden", index !== this._activeIndex);
    });
  }

  // Activate a tab, then keep the trigger visible and focused for keyboard users.
  private _selectTab(index: number) {
    this._activeIndex = index;
    this._updatePanels();

    const btn = this.shadowRoot?.querySelector<HTMLButtonElement>(`#tab-${index}`);
    btn?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
    btn?.focus();
  }

  // Support left/right keyboard navigation and nudge horizontal scroll as focus moves.
  private _handleKeydown(event: KeyboardEvent) {
    const total = this._tabs.length;
    if (total === 0) return;

    const previousIndex = this._activeIndex;
    const btnWidth = this.shadowRoot?.querySelector<HTMLButtonElement>(`#tab-${previousIndex}`)?.offsetWidth ?? 0;
    const scrollBtnWidth = this.shadowRoot?.querySelector<HTMLButtonElement>(`.scroll.show`)?.offsetWidth ?? 48;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        this._selectTab((previousIndex + 1) % total);

        // If navigation wraps to the first tab, force exact start alignment.
        if (this._activeIndex === 0) {
          this._nav.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          this._nav.scrollBy({
            left: btnWidth - scrollBtnWidth,
            behavior: "smooth",
          });
        }
        break;

      case "ArrowLeft":
        event.preventDefault();
        this._selectTab((previousIndex - 1 + total) % total);

        // If navigation wraps to the last tab, align to the far end.
        if (this._activeIndex === total - 1) {
          this._nav.scrollTo({
            left: this._nav.scrollWidth - this._nav.clientWidth,
            behavior: "smooth",
          });
        } else {
          this._nav.scrollBy({
            left: -1 * (btnWidth - scrollBtnWidth),
            behavior: "smooth",
          });
        }
        break;
    }
  }

  // Toggle left/right scroll controls based on the current horizontal scroll position.
  private _handleNavScroll = () => {
    if (!this._nav) return;

    const maxScrollLeft = this._nav.scrollWidth - this._nav.clientWidth;

    this._showLeftScroll = this._nav.scrollLeft > 0;

    this._showRightScroll = this._nav.scrollLeft < maxScrollLeft - 1;
  };

  // Scroll the tablist by a fixed amount when arrow controls are clicked.
  private _scrollTabs(direction: "left" | "right") {
    if (!this._nav) return;

    const amount = 200;

    this._nav.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  // Register scroll observers and compute initial control visibility.
  private _initTabsScroll() {
    if (!this._nav) return;

    this._handleNavScroll();

    this._nav.addEventListener("scroll", this._handleNavScroll);

    window.addEventListener("resize", this._handleNavScroll);
  }

  // Render tab controls, overflow scroll buttons, and slotted tab panels.
  render() {
    return html`
      <header class="parent-context-${this._parentContext}">
        <button
          class=${classMap({
            scroll: true,
            "scroll-left": true,
            show: this._showLeftScroll,
          })}
          aria-label="Scroll tab buttons left"
          tabindex="-1"
          @click=${() => this._scrollTabs("left")}
        >
          <qgds-icon aria-label="Scroll tab buttons left" icon-id="chevron-left" size="sm"></qgds-icon>
        </button>
        <nav role="tablist" class="nav" @keydown=${(e: KeyboardEvent) => this._handleKeydown(e)}>
          ${this._tabs.map(
            (tab, index) => html`
              <button
                id="tab-${index}"
                aria-selected=${this._activeIndex === index}
                class=${classMap({
                  "tab-button": true,
                  active: this._activeIndex === index,
                })}
                role="tab"
                tabindex=${this._activeIndex === index ? "0" : "-1"}
                @click=${() => this._selectTab(index)}
              >
                <span class="wrapper"
                  >${tab.iconName
                    ? html` <qgds-icon aria-label="${tab.iconName} icon" icon-id=${tab.iconName}></qgds-icon> `
                    : null}
                  <span>${tab.label}</span>
                </span>
              </button>
            `
          )}
        </nav>
        <button
          class=${classMap({
            scroll: true,
            "scroll-right": true,
            show: this._showRightScroll,
          })}
          aria-label="Scroll tab buttons right"
          tabindex="-1"
          @click=${() => this._scrollTabs("right")}
        >
          <qgds-icon aria-label="Scroll tab buttons right" icon-id="chevron-right" size="sm"></qgds-icon>
        </button>
      </header>
      <section>
        <slot @slotchange=${this._handleSlotChange}></slot>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-tabs": QGDSTabs;
  }
}
