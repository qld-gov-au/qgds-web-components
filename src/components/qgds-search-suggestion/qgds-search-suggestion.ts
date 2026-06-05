import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-search-suggestion.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-icon/qgds-icon.js";

export type SuggestionIcon = "arrow-right" | "search" | "clock";

/**
 * Behaviour of a suggestion / its group:
 * - `"suggestion"` (default) — a navigating link with an `href`.
 * - `"autocomplete"` — a query completion with no `href`. Activating it fills the
 *   parent `<qgds-search-input>` and triggers a search instead of navigating.
 */
export type SuggestionType = "autocomplete" | "suggestion";

/**
 * A single item within a `<qgds-search-suggestion-group>` — the web-component
 * equivalent of the BS5 `.suggestions-category li > a`.
 *
 * In `"suggestion"` mode it renders a focusable link (a right arrow for
 * service/page links). In `"autocomplete"` mode it renders a button (a magnifier
 * for query completions) that, when activated, dispatches `qgds-suggestion-select`
 * so the search input can fill its value and run a search. A `view-more` item
 * renders without the leading icon and as an always-underlined link.
 *
 * @tagname qgds-search-suggestion
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - Visible text. Falls back to the default slot content.
 * @property {string} [href] - Destination URL (used in "suggestion" mode). Defaults to "#".
 * @property {SuggestionType} [type] - "suggestion" (link, default) or "autocomplete" (fills + searches).
 * @property {SuggestionIcon} [icon] - Leading icon. Defaults to "search" for autocomplete, "arrow-right" otherwise.
 * @property {boolean} [view-more] - Renders as a "View more" style link with no leading icon.
 *
 * @slot - Optional rich label content. Overrides the `label` attribute.
 *
 * @fires {CustomEvent<{ value: string }>} qgds-suggestion-select - Fired when an autocomplete item is activated.
 *
 * @example
 * ```html
 * <qgds-search-suggestion type="autocomplete" label="camping permits"></qgds-search-suggestion>
 * <qgds-search-suggestion label="Camping permits" href="/permits/camping"></qgds-search-suggestion>
 * ```
 */
@customElement("qgds-search-suggestion")
export class QGDSSearchSuggestion extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({ type: String }) label = "";
  @property({ type: String }) href = "#";
  @property({ type: String, reflect: true }) type: SuggestionType = "suggestion";
  @property({ type: String }) icon?: SuggestionIcon;
  @property({ type: Boolean, attribute: "view-more", reflect: true }) viewMore = false;

  connectedCallback() {
    super.connectedCallback?.();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "listitem");
    }
  }

  /** Resolve the leading icon, defaulting by `type` when not set explicitly. */
  private get _icon(): SuggestionIcon {
    return this.icon ?? (this.type === "autocomplete" ? "search" : "arrow-right");
  }

  private _handleAutocompleteClick = (e: Event): void => {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent("qgds-suggestion-select", {
        bubbles: true,
        composed: true,
        detail: { value: this.label },
      })
    );
  };

  private _renderIcon() {
    return this.viewMore
      ? nothing
      : html`<qgds-icon class="suggestion-icon" icon-id=${this._icon} size="sm" aria-hidden="true"></qgds-icon>`;
  }

  render() {
    // Autocomplete items are not links — they fill the field and search.
    if (this.type === "autocomplete" && !this.viewMore) {
      return html`
        <button type="button" class="suggestion-link" @click=${this._handleAutocompleteClick}>
          ${this._renderIcon()}
          <span class="suggestion-label"><slot>${this.label}</slot></span>
        </button>
      `;
    }

    return html`
      <a class="suggestion-link" href=${this.href} tabindex="0">
        ${this._renderIcon()}
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
