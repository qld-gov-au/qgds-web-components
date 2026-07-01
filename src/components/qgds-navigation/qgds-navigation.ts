import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-navigation.styles.scss?inline";
import "../qgds-link-item/qgds-link-item";
import type { QGDSLinkItem } from "../qgds-link-item/qgds-link-item";
import "../qgds-link-column/qgds-link-column";
import { classMap } from "lit/directives/class-map.js";
import { BreakpointController } from "../../utils";
import qgdsBreakpoint from "../../styles/qgds-tokens/qgds-breakpoint";

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
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  /** Visual variant: "default" (light) or "dark". */
  @property({ type: String, reflect: true }) variant: NavigationVariant = "default";

  /** Layout: "horizontal" (mega-menu on click) or "vertical" (inline accordion toggle). */
  @property({ type: String, reflect: true }) orientation: NavigationOrientation = "horizontal";

  /** Layout passed to the auto-generated `<qgds-link-column>` inside each dropdown. */
  @property({ type: String, reflect: true, attribute: "columns-layout" }) columnsLayout: NavigationOrientation =
    "horizontal";

  /** Number of columns for auto-generated mega-menu dropdowns. */
  @property({ type: Number, reflect: true }) columns = 3;

  /** Accessible label applied to the `<nav>` landmark. */
  // @property({ type: String, attribute: "aria-label" }) navLabel = "main";

  // private
  private _breakpoint = new BreakpointController(this);
  private get _isMobile() {
    return qgdsBreakpoint[this._breakpoint.current] < qgdsBreakpoint.LG;
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("orientation") || changed.has("columnsLayout") || changed.has("columns")) {
      this._syncLayout();
    }
  }

  private _syncLayout(): void {
    // Only sync direct slot children — nested items inside dropdowns stay in standard mode
    this.querySelectorAll<QGDSLinkItem>(":scope > qgds-link-item").forEach((item) => {
      item.layout = this.orientation as QGDSLinkItem["layout"];
      item.columnsLayout = this.columnsLayout as QGDSLinkItem["columnsLayout"];
      item.isNavItem = true;
      item.columns = this.orientation === "horizontal" ? this.columns : 1;
    });
  }

  private _onSlotChange = (): void => {
    this._syncLayout();
  };

  render() {
    return html`
      <nav
        class="navigation ${classMap({
          "qgds-palette-bold": this.variant === "dark",
          "is-horizontal": this.orientation === "horizontal",
          "is-vertical": this.orientation === "vertical", // || this.isMobileView
        })}"
      >
        <div class="container">
          ${html`<div class="navigation-list" role="list">
            <slot @slotchange="${this._onSlotChange}"></slot>
          </div>`}
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-navigation": QGDSNavigation;
  }
}
