import { LitElement, html, css, unsafeCSS } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import { customElement, property } from "lit/decorators.js";
import componentCSS from "./qgds-link-column.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link-item/qgds-link-item.js";
import "../qgds-call-to-action/qgds-call-to-action.js";

export type LinkColumnDirection = "vertical" | "horizontal";

@customElement("qgds-link-column")
export class QgdsLinkColumn extends LitElement {
  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  // SEN
  // Note: we want to have a dynamic grid flow
  // So we will need a way to set the colunm minmax width value
  // Also maybe a way to also set the number of columns and use media queries to
  // control when to manipulate column numbers.

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
