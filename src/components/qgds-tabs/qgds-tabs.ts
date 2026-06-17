import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, queryAssignedElements, query } from "lit/decorators.js";
import { baseStyles } from "../../styles";
import { classMap } from "lit/directives/class-map.js";
import componentCSS from "./qgds-tabs.styles.scss?inline";
import "../qgds-icon/qgds-icon.js";
import { palettes } from "../../utils";

export type QGDSTabsProps = InstanceType<typeof QGDSTabs>;

interface TabItem {
  label: string;
  iconName?: string;
}

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

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line -- linter fails to recognise that LitElement always contains connectedCallback
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

  firstUpdated() {
    requestAnimationFrame(() => {
      this._initTabsScroll();
    });
  }
  private _updateParentContext() {
    const paletteList = Object.keys(palettes);

    const classList = this.parentElement?.classList;

    this._parentContext = paletteList.find((palette) => classList?.contains(`qgds-palette-${palette}`)) ?? "default";
  }

  private _handleSlotChange = () => {
    this._syncTabs();
  };

  private _syncTabs() {
    this._tabs = this._slottedItems.map((item) => ({
      label: item.getAttribute("label") ?? "",
      iconName: item.getAttribute("icon-name") ?? "",
    }));

    this._updatePanels();
  }

  private _updatePanels() {
    this._slottedItems.forEach((item, index) => {
      item.setAttribute("aria-labelledby", `tab-${index}`);

      item.setAttribute("id", `panel-${index}`);
      item.setAttribute("role", "tabpanel");

      item.toggleAttribute("hidden", index !== this._activeIndex);
    });
  }

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

  private _handleKeydown(event: KeyboardEvent) {
    const total = this._tabs.length;
    const btnWidth = this.shadowRoot?.querySelector<HTMLButtonElement>(`#tab-${this._activeIndex}`)?.offsetWidth ?? 0;
    const scrollBtnWidth = this.shadowRoot?.querySelector<HTMLButtonElement>(`.scroll.show`)?.offsetWidth ?? 48;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        this._selectTab((this._activeIndex + 1) % total);
        this._nav.scrollBy({
          left: btnWidth - scrollBtnWidth,
          behavior: "smooth",
        });
        break;

      case "ArrowLeft":
        event.preventDefault();
        this._selectTab((this._activeIndex - 1 + total) % total);
        this._nav.scrollBy({
          left: -1 * (btnWidth - scrollBtnWidth),
          behavior: "smooth",
        });
        break;
    }
  }

  private _handleNavScroll = () => {
    if (!this._nav) return;

    const maxScrollLeft = this._nav.scrollWidth - this._nav.clientWidth;

    this._showLeftScroll = this._nav.scrollLeft > 0;

    this._showRightScroll = this._nav.scrollLeft < maxScrollLeft - 1;
  };

  private _scrollTabs(direction: "left" | "right") {
    if (!this._nav) return;

    const amount = 200;

    this._nav.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  private _initTabsScroll() {
    if (!this._nav) return;

    this._handleNavScroll();

    this._nav.addEventListener("scroll", this._handleNavScroll);

    window.addEventListener("resize", this._handleNavScroll);
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    super.disconnectedCallback(); // eslint-disable-line -- linter fails to recognise that LitElement always contains disconnectedCallback
    this._nav?.removeEventListener("scroll", this._handleNavScroll);

    window.removeEventListener("resize", this._handleNavScroll);
  }

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
                aria-controls="panel-${index}"
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
