import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import componentCSS from "./qgds-search-suggestion.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-icon/qgds-icon.js";

export type SuggestionIcon = "arrow-right" | "search" | "clock";

/**
 * A single item within a `<qgds-search-suggestion-group>` — the web-component
 * equivalent of the BS5 `.suggestions-category li > a`.
 *
 * Renders a focusable link with a leading icon (a right arrow for service/page
 * links, a magnifier for query suggestions). A `view-more` item renders without
 * the leading icon and as an always-underlined link, matching the BS5 `.view-more`.
 *
 * @tagname qgds-search-suggestion
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - Visible link text. Falls back to the default slot content.
 * @property {string} [href] - Destination URL. Defaults to "#".
 * @property {SuggestionIcon} [icon] - Leading icon: "arrow-right" (default), "search", or "clock".
 * @property {boolean} [view-more] - Renders as a "View more" style link with no leading icon.
 *
 * @slot - Optional rich label content. Overrides the `label` attribute.
 *
 * @example
 * ```html
 * <qgds-search-suggestion icon="search" label="camping permits" href="#"></qgds-search-suggestion>
 * <qgds-search-suggestion view-more label="View more" href="/search?q=camping"></qgds-search-suggestion>
 * ```
 */
@customElement("qgds-search-suggestion")
export class QGDSSearchSuggestion extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({ type: String }) label = "";
  @property({ type: String }) href = "#";
  @property({ type: String }) icon: SuggestionIcon = "arrow-right";
  @property({ type: Boolean, attribute: "view-more", reflect: true }) viewMore = false;

  connectedCallback() {
    super.connectedCallback?.();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "listitem");
    }
  }

  render() {
    return html`
      <a class="suggestion-link" href=${this.href} tabindex="0">
        ${this.viewMore
          ? nothing
          : html`<qgds-icon
              class="suggestion-icon"
              icon-id=${ifDefined(this.icon)}
              size="sm"
              aria-hidden="true"
            ></qgds-icon>`}
        <span class="suggestion-label"><slot>${this.label}</slot></span>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-search-suggestion": QGDSSearchSuggestion;
  }
}
