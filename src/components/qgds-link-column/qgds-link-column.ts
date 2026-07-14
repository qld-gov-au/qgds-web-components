import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import componentCSS from "./qgds-link-column.styles.scss?inline";
import { resetStyles } from "../../styles";

import { QGDSLinkItem } from "../qgds-link-item/qgds-link-item";

// Component dependencies
import "../qgds-call-to-action/qgds-call-to-action";

export type LinkColumnDirection = "vertical" | "horizontal";

/**
 * A navigation landmark that organises a set of `<qgds-link-item>` elements into a column.
 * Supports vertical and horizontal layouts, multi-column grids, and an optional view-all CTA.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [aria-label] - Accessible label for the `<nav>` element (mapped to `navLabel`).
 * @property {LinkColumnDirection} [direction = "vertical"] - Layout direction: "vertical" (default) or "horizontal".
 * @property {1|2|3} [columns] - Number of columns (1–3). Defaults to 1.
 * @property {string} [view-all-label] - Label for the view-all CTA. Defaults to "View all services".
 * @property {string} [view-all-url] - URL for the view-all CTA.
 *
 * @slot - Accepts `<qgds-link-item>` elements only. Non-conforming children are hidden with a console warning.
 *
 * @cssprop {length|string} --qgds-icon-spacing-start - Override icon spacing at the start.
 * @cssprop {length|string} --qgds-icon-spacing-end - Override icon spacing at the end.
 * @cssprop {length|string} --qgds-icon-margin-start - Override icon inline-start margin.
 *
 * @example
 * ```html
 * <qgds-link-column aria-label="Our services" layout="vertical" columns="2" view-all-url="/services">
 *   <qgds-link-item label="Planning" href="/planning"></qgds-link-item>
 *   <qgds-link-item label="Environment" href="/environment"></qgds-link-item>
 * </qgds-link-column>
 * ```
 */
@customElement("qgds-link-column")
export class QGDSLinkColumn extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({ type: String, attribute: "aria-label" })
  navLabel = "";

  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (val: string | null): LinkColumnDirection => (val === "horizontal" ? "horizontal" : "vertical"),
      toAttribute: (val: LinkColumnDirection): string => val,
    },
  })
  direction: LinkColumnDirection = "vertical";

  @property({ type: String, reflect: true, attribute: "view-all-label" })
  viewAllLabel = "View all services";

  @property({ type: String, attribute: "view-all-url" })
  viewAllURL = "#";

  /** When true, suppresses automatic icon-name / animation assignment on child link-items.
   * Set automatically by `<qgds-link-item>` when the parent navigation uses a non-horizontal layout. */
  @property({ type: Boolean, attribute: "suppress-icons", reflect: true }) suppressIcons = false;

  private _columns = 1;
  @property({ type: Number, reflect: true })
  get columns() {
    return this._columns;
  }

  set columns(val: number) {
    const old = this._columns;
    const safe = Number.isFinite(val) ? val : old;
    this._columns = Math.min(3, Math.max(1, Math.round(safe)));
    this.requestUpdate("columns", old);
  }

  protected firstUpdated(): void {
    if (!this.navLabel) {
      console.warn(
        '<qgds-link-column>: No "aria-label" provided. The <nav> landmark is using a generic fallback label ("Navigation"). For WCAG 2.4.1 compliance, provide a meaningful "aria-label" attribute that describes the purpose of this navigation.'
      );
    }
    // slotchange fires before the @slotchange listener is ready on first render;
    // configure any link-items already in the light DOM.
    this._applyIconsToItems(this.querySelectorAll<QGDSLinkItem>("qgds-link-item"));
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("suppressIcons")) {
      this._applyIconsToItems(this.querySelectorAll<QGDSLinkItem>("qgds-link-item"));
    }
  }

  private _applyIconsToItems(items: NodeListOf<QGDSLinkItem> | QGDSLinkItem[]): void {
    items.forEach((item) => {
      if (this.suppressIcons) {
        item.iconName = "";
        item.animation = "";
      } else {
        if (!item.iconName) item.iconName = "arrow-right";
        if (!item.animation) item.animation = "leftToRight";
      }
    });
  }

  private _onSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    slot.assignedElements().forEach((el) => {
      if (el.tagName.toLowerCase() !== "qgds-link-item") {
        console.warn(
          `qgds-link-column only accepts <qgds-link-item> children. Found <${el.tagName.toLowerCase()}> — hiding it. Replace with <qgds-link-item>.`
        );
        (el as HTMLElement).style.display = "none";
      } else {
        this._applyIconsToItems([el as QGDSLinkItem]);
      }
    });
  };

  render() {
    return html`
      <nav class="link-column" aria-label=${this.navLabel || "Navigation"}>
        <div class="items" role="list">
          <slot @slotchange=${this._onSlotChange}></slot>
          ${!!this.viewAllURL && this.viewAllURL.trim().length > 0 && this.viewAllURL.trim() !== "#"
            ? html`<qgds-call-to-action
                is-view-all
                label=${this.viewAllLabel}
                href=${this.viewAllURL.trim()}
              ></qgds-call-to-action>`
            : ""}
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-link-column": QGDSLinkColumn;
  }
}
