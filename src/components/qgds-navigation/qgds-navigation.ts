import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-navigation.styles.scss?inline";
import "../qgds-link-item/qgds-link-item";
import type { QGDSLinkItem } from "../qgds-link-item/qgds-link-item";
import "../qgds-link-column/qgds-link-column";

export type NavigationVariant = "default" | "dark";
export type NavigationLayout = "horizontal" | "vertical";

/**
 * QGDS Navigation – Horizontal navigation bar.
 * Accepts `<qgds-link-item>` elements as slotted children.
 *
 * @tagname qgds-navigation
 *
 * @website https://www.designsystem.qld.gov.au/components/navigation-horizontal
 * @uikit   https://www.figma.com/design/Si3LOWFTxpzSRCC8cvHGZ5/Sen-Test\?node-id\=292-1416
 *
 * @property {NavigationVariant} [variant="default"] - "default" (light bar) or "dark" (dark bar).
 * @property {string} [aria-label="main"] - Accessible label for the `<nav>` landmark.
 *
 * @slot - Accepts `<qgds-link-item>` elements.
 *
 * @example
 * ```html
 * <qgds-navigation aria-label="main" columns="3" layout="horizontal" columns-layout="horizontal">
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
  @property({ type: String, reflect: true }) layout: NavigationLayout = "horizontal";

  /** Layout passed to the auto-generated `<qgds-link-column>` inside each dropdown. */
  @property({ type: String, reflect: true, attribute: "columns-layout" }) columnsLayout: NavigationLayout =
    "horizontal";

  /** Number of columns for auto-generated mega-menu dropdowns. */
  @property({ type: Number, reflect: true }) columns = 3;

  /** Accessible label applied to the `<nav>` landmark. */
  @property({ type: String, attribute: "aria-label" }) navLabel = "main";

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("layout") || changed.has("columnsLayout") || changed.has("columns")) {
      this._syncLayout();
    }
  }

  private _syncLayout(): void {
    // Only sync direct slot children — nested items inside dropdowns stay in standard mode
    this.querySelectorAll<QGDSLinkItem>(":scope > qgds-link-item").forEach((item) => {
      item.layout = this.layout as QGDSLinkItem["layout"];
      item.columnsLayout = this.columnsLayout as QGDSLinkItem["columnsLayout"];
      item.isNavItem = true;
      item.columns = this.layout === "horizontal" ? this.columns : 1;
    });
  }

  private _onSlotChange = (): void => {
    this._syncLayout();
  };

  render() {
    return html`
      <nav class="navbar" aria-label="${this.navLabel}" role="navigation">
        <div class="container">
          ${
            // eslint-disable-next-line lit-a11y/list -- slotted qgds-link-item elements each set role="listitem" on their host
            html`<ul class="navbar-nav">
              <slot @slotchange="${this._onSlotChange}"></slot>
            </ul>`
          }
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
