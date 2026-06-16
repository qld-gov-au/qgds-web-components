import { LitElement, html, unsafeCSS, nothing, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-search-suggestion-group.styles.scss?inline";
import { resetStyles } from "../../styles";
import { QGDSSearchSuggestion, type SuggestionType } from "../qgds-search-suggestion/qgds-search-suggestion.js";

export type { SuggestionType };

/**
 * A titled group of search suggestions — the web-component equivalent of the BS5
 * `.suggestions-category` inside `.suggestions__group`. Holds a labelled list of
 * `<qgds-search-suggestion>` items, with an optional "View more" link.
 *
 * Drop one or more of these into the `suggestions` slot of `<qgds-search-input>`.
 *
 * @tagname qgds-search-suggestion-group
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {SuggestionType} [type] - Behaviour of the group's items: "suggestion" (navigating links, default) or "autocomplete" (query completions that fill the field and search). Propagated to slotted `<qgds-search-suggestion>` items.
 * @property {string} [heading] - Category label rendered above the list (BS5 `.suggestions-category-label`).
 * @property {boolean} [feature] - Renders the highlighted "feature" treatment (BS5 `.feature`, e.g. "Related services").
 * @property {string} [view-more-label] - Label for the trailing view-more link. Defaults to "View more".
 * @property {string} [view-more-url] - URL for the trailing view-more link. When unset, no view-more link is shown.
 *
 * @slot - Accepts `<qgds-search-suggestion>` items.
 *
 * @example
 * ```html
 * <qgds-search-suggestion-group heading="Related services" feature view-more-url="/search?q=permit">
 *   <qgds-search-suggestion label="Camping permits" href="/permits/camping"></qgds-search-suggestion>
 *   <qgds-search-suggestion label="Event permits" href="/permits/events"></qgds-search-suggestion>
 * </qgds-search-suggestion-group>
 * ```
 */
@customElement("qgds-search-suggestion-group")
export class QGDSSearchSuggestionGroup extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true }) type: SuggestionType = "suggestion";
  @property({ type: String }) heading = "";
  @property({ type: Boolean, reflect: true }) feature = false;
  @property({ type: String, attribute: "view-more-label" }) viewMoreLabel = "View more";
  @property({ type: String, attribute: "view-more-url" }) viewMoreUrl = "";

  protected updated(changed: PropertyValues): void {
    if (changed.has("type")) {
      this._propagateType();
    }
  }

  /** Apply this group's `type` to every slotted suggestion item. */
  private _propagateType(): void {
    this.querySelectorAll<QGDSSearchSuggestion>("qgds-search-suggestion").forEach((item) => {
      item.type = this.type;
    });
  }

  private _onSlotChange = (e: Event): void => {
    (e.target as HTMLSlotElement).assignedElements({ flatten: true }).forEach((el) => {
      if (el instanceof QGDSSearchSuggestion) {
        el.type = this.type;
      }
    });
  };

  render() {
    const hasViewMore = this.viewMoreUrl.trim().length > 0;

    return html`
      <div class="suggestion-group">
        ${this.heading ? html`<strong class="group-label">${this.heading}</strong>` : nothing}
        <div class="group-list" role="list">
          <slot @slotchange=${this._onSlotChange}></slot>
          ${hasViewMore
            ? html`<qgds-search-suggestion
                view-more
                label=${this.viewMoreLabel}
                href=${this.viewMoreUrl}
              ></qgds-search-suggestion>`
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-search-suggestion-group": QGDSSearchSuggestionGroup;
  }
}
