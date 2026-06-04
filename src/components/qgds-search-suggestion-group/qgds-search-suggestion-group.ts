import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-search-suggestion-group.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link-item/qgds-link-item.js";

/**
 * A titled group of search suggestions — the web-component equivalent of the BS5
 * `.suggestions-category` inside `.suggestions__group`. Holds a labelled list of
 * `<qgds-link-item>` elements, with an optional "View more" link.
 *
 * Drop one or more of these into the `suggestions` slot of `<qgds-search-input>`.
 *
 * @tagname qgds-search-suggestion-group
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [heading] - Category label rendered above the list (BS5 `.suggestions-category-label`).
 * @property {boolean} [feature] - Renders the highlighted "feature" treatment (BS5 `.feature`, e.g. "Related services").
 * @property {string} [view-more-label] - Label for the trailing view-more link. Defaults to "View more".
 * @property {string} [view-more-url] - URL for the trailing view-more link. When unset, no view-more link is shown.
 *
 * @slot - Accepts `<qgds-link-item>` elements.
 *
 * @example
 * ```html
 * <qgds-search-suggestion-group heading="Related services" feature view-more-url="/search?q=permit">
 *   <qgds-link-item label="Camping permits" href="/permits/camping"></qgds-link-item>
 *   <qgds-link-item label="Event permits" href="/permits/events"></qgds-link-item>
 * </qgds-search-suggestion-group>
 * ```
 */
@customElement("qgds-search-suggestion-group")
export class QGDSSearchSuggestionGroup extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({ type: String }) heading = "";
  @property({ type: Boolean, reflect: true }) feature = false;
  @property({ type: String, attribute: "view-more-label" }) viewMoreLabel = "View more";
  @property({ type: String, attribute: "view-more-url" }) viewMoreUrl = "";

  render() {
    const hasViewMore = this.viewMoreUrl.trim().length > 0;

    return html`
      <div class="suggestion-group">
        ${this.heading ? html`<strong class="group-label">${this.heading}</strong>` : nothing}
        <div class="group-list" role="list">
          <slot></slot>
          ${hasViewMore
            ? html`<qgds-link-item
                class="view-more"
                icon-name=""
                label=${this.viewMoreLabel}
                href=${this.viewMoreUrl}
              ></qgds-link-item>`
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
