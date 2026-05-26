import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-table.styles.scss?inline";
import GLOBAL_TABLE_CSS from "./qgds-global-table.styles.scss?inline";

export type TableResponsive = "scroll" | "stack";

/**
 * A QGDS-styled visual wrapper for native HTML `<table>` elements.
 *
 * Place a standard `<table>` as the default slot child. The component applies
 * QGDS design tokens and interaction behaviour via document-level styles and
 * a shadow DOM scroll/border container — without modifying the table's DOM,
 * classes, or semantic meaning. This makes it safe to use with CMS-generated
 * or WYSIWYG table markup.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97592
 * @website https://www.designsystem.qld.gov.au/components/table
 *
 * @prop {TableResponsive} [responsive="scroll"] - Responsive behaviour:
 *   `"scroll"` (default, horizontal overflow on small screens) or
 *   `"stack"` (cells stack vertically with header labels on small screens).
 * @prop {boolean} [is-striped=false] - Alternating row shading.
 * @prop {boolean} [is-hovered=false] - Row background highlight on hover.
 * @prop {boolean} [has-border=false] - Visible border around the outer wrapper.
 * @prop {boolean} [has-sticky-header=false] - Sticks `<thead>` to the top of
 *   the scroll container during vertical scroll.
 *
 * @slot - Accepts one native `<table>` element with full semantic HTML.
 *   The component warns in the console if `<caption>`, `<thead>`, or `<th>`
 *   are missing.
 *
 * @cssprop --table-border-color - Override the wrapper border / cell separator colour.
 * @cssprop --table-scroll-max-height - Override the scroll container max-height
 *   (default `640px` mobile / `1000px` desktop when `has-sticky-header` is set).
 *
 * @example Scroll wrapper (default)
 * ```html
 * <qgds-table>
 *   <table>
 *     <caption>Monthly revenue</caption>
 *     <thead><tr><th scope="col">Month</th><th scope="col">Revenue</th></tr></thead>
 *     <tbody><tr><td>January</td><td>$12,000</td></tr></tbody>
 *   </table>
 * </qgds-table>
 * ```
 *
 * @example Bordered, striped, sticky header
 * ```html
 * <qgds-table has-border is-striped has-sticky-header>
 *   <table>...</table>
 * </qgds-table>
 * ```
 *
 * @example Stack responsive (mobile)
 * ```html
 * <qgds-table responsive="stack" has-border>
 *   <table>...</table>
 * </qgds-table>
 * ```
 */

/**
 * Document-level stylesheet injected once to style descendants of the slotted
 * `<table>`. Shadow DOM `::slotted()` cannot reach beyond the directly-slotted
 * element, so we use `document.adoptedStyleSheets` with `qgds-table`-scoped
 * selectors. Because slotted elements remain in the light DOM, standard CSS
 * descendant selectors work correctly.
 */

let globalStylesInjected = false;

function ensureGlobalStyles(): void {
  if (globalStylesInjected) return;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(GLOBAL_TABLE_CSS);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch {
    // Fallback for environments without constructable stylesheets support
    const style = document.createElement("style");
    style.setAttribute("data-qgds-table", "");
    style.textContent = GLOBAL_TABLE_CSS;
    document.head.appendChild(style);
  }
  globalStylesInjected = true;
}

@customElement("qgds-table")
export class QGDSTable extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  /** Responsive behaviour: `"scroll"` (default) or `"stack"`. */
  @property({ type: String, reflect: true })
  responsive: TableResponsive = "scroll";

  /** Applies alternating (striped/banded) row shading. */
  @property({ type: Boolean, attribute: "is-striped", reflect: true })
  isStriped = false;

  /** Highlights table rows on mouse hover. */
  @property({ type: Boolean, attribute: "is-hovered", reflect: true })
  isHovered = false;

  /** Renders a visible border around the outer scroll/wrapper container. */
  @property({ type: Boolean, attribute: "has-border", reflect: true })
  hasBorder = false;

  /**
   * Makes `<thead>` sticky at the top of the scroll container during vertical
   * scroll. Automatically applies a `max-height` to the wrapper.
   */
  @property({ type: Boolean, attribute: "has-sticky-header", reflect: true })
  hasStickyHeader = false;

  // ── Private observer state ────────────────────────────────────────────────
  private _mql: MediaQueryList | null = null;
  private _mqlListener: ((e: MediaQueryListEvent) => void) | null = null;
  private _headerObserver: MutationObserver | null = null;

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line -- LitElement lifecycle
    ensureGlobalStyles();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback(); // eslint-disable-line -- LitElement lifecycle
    this._teardownMediaQuery();
    this._teardownHeaderObserver();
  }

  /** Returns the first slotted `<table>` element, or `undefined`. */
  private _getSlottedTable(): HTMLTableElement | undefined {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>("slot");
    return slot?.assignedElements({ flatten: true }).find((el): el is HTMLTableElement => el.tagName === "TABLE");
  }

  /**
   * Warns in the console when required accessibility elements are absent.
   * Does not throw — graceful degradation for CMS-generated markup.
   */
  private _validateAccessibility(table: HTMLTableElement): void {
    if (!table.querySelector("caption")) {
      console.warn("[qgds-table] Accessibility: <caption> is missing. All tables require a descriptive caption.");
    }
    if (!table.querySelector("thead")) {
      console.warn("[qgds-table] Accessibility: <thead> is missing. Tables should have a clearly defined header row.");
    }
    if (!table.querySelector("th")) {
      console.warn(
        "[qgds-table] Accessibility: No <th> elements found. Use <th scope='col'> or <th scope='row'> to define header cells."
      );
    }
  }

  /** Removes all `data-label` attributes previously set on `<tbody td>` cells. */
  private _clearStackLabels(table: HTMLTableElement): void {
    table.querySelectorAll("tbody td[data-label]").forEach((cell) => {
      cell.removeAttribute("data-label");
    });
  }

  /**
   * For `responsive="stack"`, reads column header text from `<thead th>` and
   * writes it as `data-label` attributes on corresponding `<tbody td>` cells.
   * These labels are displayed via a CSS `::before` pseudo-element on mobile.
   * Only attribute values are modified — cell content is never mutated.
   *
   * Skips (no-op) when the viewport is above bp.$md (699px) — labels are
   * hidden by CSS at that width and will have been cleared by the mql listener.
   */
  private _applyStackLabels(table: HTMLTableElement): void {
    if (this.responsive !== "stack") return;
    if (this._mql && !this._mql.matches) return; // desktop — skip
    const headers = Array.from(table.querySelectorAll("thead tr:first-child th")).map(
      (th) => th.textContent?.trim() ?? ""
    );
    if (headers.length === 0) return;
    table.querySelectorAll("tbody tr").forEach((row) => {
      row.querySelectorAll("td").forEach((cell, i) => {
        const label = headers[i];
        if (label) {
          cell.setAttribute("data-label", label);
        } else {
          cell.removeAttribute("data-label");
        }
      });
    });
  }

  /**
   * Watches `<thead>` for text or structure mutations and re-syncs
   * `data-label` attributes so stale column headers are never shown.
   */
  private _setupHeaderObserver(table: HTMLTableElement): void {
    this._teardownHeaderObserver();
    const thead = table.querySelector("thead");
    if (!thead) return;
    this._headerObserver = new MutationObserver(() => {
      this._applyStackLabels(table);
    });
    this._headerObserver.observe(thead, { subtree: true, childList: true, characterData: true });
  }

  private _teardownHeaderObserver(): void {
    this._headerObserver?.disconnect();
    this._headerObserver = null;
  }

  /**
   * Watches the viewport width against bp.$md (699px).
   * — Crossing into mobile: applies stack labels when `responsive="stack"`.
   * — Crossing into desktop: clears all `data-label` attributes.
   */
  private _setupMediaQuery(table: HTMLTableElement): void {
    this._teardownMediaQuery();
    this._mql = window.matchMedia("(width <= 699px)");
    this._mqlListener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        this._applyStackLabels(table);
      } else {
        this._clearStackLabels(table);
      }
    };
    this._mql.addEventListener("change", this._mqlListener);
  }

  private _teardownMediaQuery(): void {
    if (this._mql && this._mqlListener) {
      this._mql.removeEventListener("change", this._mqlListener);
    }
    this._mql = null;
    this._mqlListener = null;
  }

  private _onSlotChange = (): void => {
    const table = this._getSlottedTable();
    if (!table) {
      console.warn("[qgds-table] No <table> element found in the default slot. Place a <table> as the direct child.");
      return;
    }
    this._validateAccessibility(table);
    this._setupMediaQuery(table);
    this._setupHeaderObserver(table);
    this._applyStackLabels(table);
  };

  /**
   * Handles keyboard-driven horizontal scrolling of the wrapper container
   * when `responsive="scroll"`. Arrow keys move left/right; Space moves right.
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    const wrapper = this.renderRoot?.querySelector<HTMLElement>(".table-wrapper");
    if (!wrapper) return;
    const STEP = 80;
    if (e.key === "ArrowLeft") {
      wrapper.scrollLeft -= STEP;
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key === " ") {
      wrapper.scrollLeft += STEP;
      e.preventDefault();
    }
  };

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has("responsive")) {
      const table = this._getSlottedTable();
      if (table) {
        if (this.responsive !== "stack") {
          this._clearStackLabels(table);
        } else {
          this._applyStackLabels(table);
        }
      }
    }
  }

  render() {
    const isScroll = this.responsive === "scroll";

    const wrapperClasses = classMap({
      "table-wrapper": true,
      "is-scroll": isScroll,
      "is-stack": this.responsive === "stack",
    });

    return html`
      <div
        class=${wrapperClasses}
        tabindex=${isScroll ? "0" : nothing}
        role=${isScroll ? "region" : nothing}
        aria-label=${isScroll ? "Scrollable table" : nothing}
        @keydown=${isScroll ? this._handleKeyDown : nothing}
      >
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-table": QGDSTable;
  }
}
