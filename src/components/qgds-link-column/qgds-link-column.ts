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
 * When used in isolation, it is recommended to add `role=navigation` and a relevant `aria-label` for accessibility purposes.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {LinkColumnDirection} [direction = "vertical"] - Tabbing direction: "vertical" (default) or "horizontal".
 * @property {1|2|3} [columns=1] - Number of columns (1–3). Defaults to 1
 *
 * @slot - Accepts `<qgds-link-item>` elements only. Non-conforming children are hidden with a console warning.
 * *
 * @example
 * ```html
 * <qgds-link-column aria-label="Our services" role="navigation" direction="vertical" columns="2" >
 *   <qgds-link-item label="Planning" href="/planning"></qgds-link-item>
 *   <qgds-link-item label="Environment" href="/environment"></qgds-link-item>
 * </qgds-link-column>
 * ```
 */
@customElement("qgds-link-column")
export class QGDSLinkColumn extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (val: string | null): LinkColumnDirection => (val === "horizontal" ? "horizontal" : "vertical"),
      toAttribute: (val: LinkColumnDirection): string => val,
    },
  })
  direction: LinkColumnDirection = "vertical";

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

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.ariaLabel) {
      console.warn(
        '<qgds-link-column>: No "aria-label" provided. Will use fallback label ("Related links"). For WCAG 2.4.1 compliance, provide a meaningful "aria-label" attribute that describes the purpose of this navigation.'
      );
    }
    this.ariaLabel = this.ariaLabel ?? "Related links";
  }

  protected firstUpdated(): void {
    // slotchange fires before the @slotchange listener is ready on first render;
    // configure any link-items already in the light DOM.
    this._applyIconsToItems(this.querySelectorAll<QGDSLinkItem>("qgds-link-item"));
  }

  protected updated(changedProps: Map<string, unknown>) {
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
      <div class="items" role="list">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-link-column": QGDSLinkColumn;
  }
}
