import { LitElement, html, css, unsafeCSS } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import { customElement, property } from "lit/decorators.js";
import componentCSS from "./qgds-link-column.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link-item/qgds-link-item.js";
import "../qgds-call-to-action/qgds-call-to-action.js";

export type LinkColumnDirection = "vertical" | "horizontal";

/**
 * A navigation landmark that organises a set of `<qgds-link-item>` elements into a titled column.
 * Supports vertical and horizontal layouts, multi-column grids, and an optional view-all CTA.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [heading] - The visible heading text rendered above the link list.
 * @property {string} [aria-label] - Accessible label for the `<nav>` element. Falls back to `heading`.
 * @property {number} [heading-level] - Heading rank for the heading element (1–6). Defaults to 3.
 * @property {LinkColumnDirection} [layout] - Layout direction: "vertical" (default) or "horizontal".
 * @property {number} [columns] - Number of columns (1–3). Defaults to 1.
 * @property {boolean} [has-view-all] - When true and `view-all-url` is set, renders a `<qgds-call-to-action>` at the end.
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
 * <qgds-link-column heading="Our services" heading-level="2" layout="vertical" columns="2" has-view-all view-all-url="/services">
 *   <qgds-link-item label="Planning" href="/planning"></qgds-link-item>
 *   <qgds-link-item label="Environment" href="/environment"></qgds-link-item>
 * </qgds-link-column>
 * ```
 */
@customElement("qgds-link-column")
export class QgdsLinkColumn extends LitElement {
  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, reflect: true }) heading = "";
  @property({ type: String, reflect: true, attribute: "aria-label" })
  ariaLabel = "";
  @property({ type: Number, reflect: true, attribute: "heading-level" })
  headingLevel = 3;
  @property({
    type: String,
    reflect: true,
    attribute: "layout",
    converter: {
      fromAttribute: (val: string | null): LinkColumnDirection => (val === "horizontal" ? "horizontal" : "vertical"),
      toAttribute: (val: LinkColumnDirection): string => val,
    },
  })
  direction: LinkColumnDirection = "vertical";

  @property({ type: Boolean, reflect: true, attribute: "has-view-all" })
  hasViewAll = false;

  @property({ type: String, reflect: true, attribute: "view-all-label" })
  viewAllLabel = "View all services";

  @property({ type: String, reflect: true, attribute: "view-all-url" })
  viewAllURL = "";
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
    if (!this.heading && !this.ariaLabel) {
      console.warn(
        '<qgds-link-column>: No "heading" or "aria-label" provided. The <nav> landmark is using a generic fallback label ("Navigation"). For WCAG 2.4.1 compliance, provide a meaningful "heading" or "aria-label" attribute that describes the purpose of this navigation.'
      );
    }
  }

  render() {
    const tag = unsafeStatic(`h${this.headingLevel}`);
    return html`
      <nav class="link-column" aria-label=${this.ariaLabel || this.heading || "Navigation"}>
        ${this.heading ? staticHtml`<${tag} class="heading">${this.heading}</${tag}>` : ""}
        <div class="items" role="list">
          <slot @slotchange=${this._onSlotChange}></slot>
          ${this.hasViewAll && this.viewAllURL.trim().length > 0
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

  private _onSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    slot.assignedElements().forEach((el) => {
      if (el.tagName.toLowerCase() !== "qgds-link-item") {
        console.warn(
          `qgds-link-column only accepts <qgds-link-item> children. Found <${el.tagName.toLowerCase()}> — hiding it. Replace with <qgds-link-item>.`
        );
        (el as HTMLElement).style.display = "none";
      }
    });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-link-column": QgdsLinkColumn;
  }
}
