import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-table.styles.scss?inline";

export type TableResponsive = "scroll" | "stack";

/**
 * Document-level stylesheet injected once to style descendants of the slotted
 * `<table>`. Shadow DOM `::slotted()` cannot reach beyond the directly-slotted
 * element, so we use `document.adoptedStyleSheets` with `qgds-table`-scoped
 * selectors. Because slotted elements remain in the light DOM, standard CSS
 * descendant selectors work correctly.
 */
const GLOBAL_TABLE_CSS = /* css */ `
  /* ── Base table ─────────────────────────────────────────────────────────── */

  qgds-table {
    &[is-striped] tbody tr:nth-child(even) td,
    &[is-striped] tbody tr:nth-child(even) th {
      background-color: var(--qgds-color-background-shade, #f5f5f5);
    }
  
    &[has-sticky-header] thead th {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  
    &[has-sticky-header] tfoot {
        position: sticky;
        inset-block-end: 0;
        box-shadow: 0 -2px 0 var(--qgds-color-border-alt, #848484);

        td {
            border-block-start: 0;}
    }
    /* ── Stack mode — mobile responsive stacking ────────────────────────────── */
  
    @media (max-width: 699px) {
      &[responsive="stack"] {
        thead {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }
  
        tbody {
          tr {
            display: block;
            border-bottom: 2px solid var(--qgds-color-border-alt, #848484);          
          }
  
          td {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--qgds-color-border, #ebebeb);
            border-radius: inherit;

            &::before {
              content: attr(data-label);
              font-weight: 700;
              color: var(--qgds-color-text-heading, #000053);
              flex: 0 0 40%;
              text-align: left;
            }
          }
        }
  
        tfoot { 
          border-radius: inherit;
          td {
            display: flex;
            gap: 1rem;
          }
        }
      }
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      font-size: 1rem;
  
      caption {
        caption-side: top;
        text-align: left;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--qgds-color-text-heading, #000053);
        padding-block: 0.75rem;
        padding-inline: 0.75rem;
        border-block-end: 1px solid var(--qgds-color-border, #ebebeb);
      }
  
      .caption-subtitle, .subtitle {
        display: block;
        font-weight: 400;
        font-size: 0.875rem;
        color: var(--qgds-color-text-default, #353535);
        margin-block-start: 0.25rem;
      }
  
      thead th {
        background-color: var(--qgds-table-header-bg, #f5f5f5);
        color: var(--qgds-color-text-heading, #000053);
        font-weight: 600;
        text-align: left;
        padding-inline: 0.75rem;
        padding-block: 1.25rem;
        border-block-end: 2px solid var(--qgds-color-accent-design-accent, #84d3ff);
      }

      thead th[rowspan] {
        border-inline-end: 1px solid var(--qgds-color-border, #ebebeb);
      }

      tbody th {
        border-inline-end: 1px solid var(--qgds-color-border, #ebebeb);
      }

      tbody td,
      tbody th,
      tfoot td {
        font-weight: 400;
        color: var(--qgds-color-text-default, #353535);
        padding-inline: 0.75rem calc(0.75rem - 1px);
        padding-block: 0.75rem;
        border-bottom: 1px solid var(--qgds-color-border, #ebebeb);
        text-align: left;
        vertical-align: top;
      }
  
      tfoot td {
        font-weight: 600;
        border-top: 2px solid var(--qgds-color-accent-design-accent, #84d3ff);
        border-bottom: none;
        padding-block: 0.75rem;
        background-color: var(--qgds-color-background, #fff);
        border-radius: inherit;
      }
  
      ::-webkit-scrollbar {
        width: 0;
      }

      /* ── Utility classes (for CMS-authored markup) ──────────────────────────── */
      .cell--numeric {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      
      .bg-default,
      .bg-default > th,
      .bg-default > td {
        background-color: var(--qgds-color-background, #fff);
      }

      .bg-shade,
      .bg-shade > th,
      .bg-shade > td {
        background-color: var(--qgds-color-background-shade);
      }

      .cell-left-border {
        border-left: 2px solid var(--qgds-color-border-alt, #848484) !important;
      }
  
      .cell--middle {
        vertical-align: middle !important;
      }
  
      .header--width-10 {
        width: 10%;
      }
      .header--width-15 {
        width: 15%;
      }
      .header--width-20 {
        width: 20%;
      }
      .header--width-25 {
        width: 25%;
      }
      .header--width-33 {
        width: 33.333%;
      }
      .header--width-40 {
        width: 40%;
      }
      .header--width-50 {
        width: 50%;
      }
      .header--width-75 {
        width: 75%;
      }
    }
  }
`;

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

  /** Renders a visible border around the outer scroll/wrapper container. */
  @property({ type: Boolean, attribute: "has-border", reflect: true })
  hasBorder = false;

  /**
   * Makes `<thead>` sticky at the top of the scroll container during vertical
   * scroll. Automatically applies a `max-height` to the wrapper.
   */
  @property({ type: Boolean, attribute: "has-sticky-header", reflect: true })
  hasStickyHeader = false;

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line -- LitElement lifecycle
    ensureGlobalStyles();
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

  /**
   * For `responsive="stack"`, reads column header text from `<thead th>` and
   * writes it as `data-label` attributes on corresponding `<tbody td>` cells.
   * These labels are displayed via a CSS `::before` pseudo-element on mobile.
   * Only attribute values are modified — cell content is never mutated.
   */
  private _applyStackLabels(table: HTMLTableElement): void {
    if (this.responsive !== "stack") return;
    const headers = Array.from(table.querySelectorAll("thead tr:first-child th")).map(
      (th) => th.textContent?.trim() ?? ""
    );
    if (headers.length === 0) return;
    table.querySelectorAll("tbody tr").forEach((row) => {
      row.querySelectorAll("td").forEach((cell, i) => {
        const label = headers[i];
        if (label) {
          cell.setAttribute("data-label", label);
        }
      });
    });
  }

  private _onSlotChange = (): void => {
    const table = this._getSlottedTable();
    if (!table) {
      console.warn("[qgds-table] No <table> element found in the default slot. Place a <table> as the direct child.");
      return;
    }
    this._validateAccessibility(table);
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
      if (table) this._applyStackLabels(table);
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
