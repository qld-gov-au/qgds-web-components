import { LitElement, html, unsafeCSS, PropertyValues, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { baseStyles, formStyles, utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-search-input.styles.scss?inline";
import { FormVariant } from "../../types/forms";
import { QgdsEvents } from "../../utils/events/event-controller";
import { debounce } from "../../utils";
import {
  normalizeSuggestions,
  parseSuggestionsAttribute,
  type SuggestionGroupData,
} from "./suggestions-data.js";
// Side-effect imports register the suggestion sub-components so consumers can
// inject them into the `suggestions` slot without importing them separately.
import "../qgds-search-suggestion-group/qgds-search-suggestion-group.js";
import "../qgds-search-suggestion/qgds-search-suggestion.js";

export type { SuggestionGroupData, SuggestionItemData } from "./suggestions-data.js";

export const tagName = "qgds-search-input";
export type QGDSSearchInputProps = InstanceType<typeof QGDSSearchInput>;

/**
 * A composite search input that pairs a text field with a search button and an
 * optional suggestions dropdown.
 *
 * The component is headless with respect to data: it does **not** fetch anything.
 * Listen for the `qgds-input` event, call your own search/suggestions API, then
 * inject the results into the `suggestions` slot. The dropdown panel is shown
 * automatically whenever the field is focused and the slot has content.
 *
 * @tagname qgds-search-input
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97871
 * @website https://www.designsystem.qld.gov.au/components/search-input
 *
 * @prop {String} [value] - The current value of the search field.
 * @prop {String} [placeholder] - Placeholder text for the input.
 * @prop {String} [name] - Name attribute passed to the underlying input.
 * @prop {Boolean} [disabled=false] - Disables the input and button.
 * @prop {FormVariant} [variant] - Visual style of the input. "filled" uses a shaded background with only a bottom border.
 * @prop {Number} [debounce=100] - Milliseconds to debounce the `qgds-input` event by. Submitting (Enter/button) cancels any pending debounced `qgds-input` and fires `qgds-search` immediately.
 * @prop {SuggestionGroupData[]} [suggestions=[]] - Suggestion groups to render. Settable as a JS array or as a JSON-string attribute. Malformed input is ignored. Takes precedence over the `suggestions` slot.
 *
 * @slot suggestions - Custom suggestions markup, used when the `suggestions` property is empty.
 *   Fill this in response to `qgds-input` after calling your own API. The panel is
 *   hidden automatically when there is nothing to show.
 *
 * @fires {CustomEvent<{ value: string }>} qgds-input - Fired as the user types (debounced by `debounce` ms). Use this to drive an async suggestions lookup.
 * @fires {CustomEvent<{ value: string }>} qgds-search - Fired on button click or Enter key.
 *
 * @csspart panel - The floating suggestions dropdown container.
 *
 * @example
 * ```html
 * <qgds-search-input placeholder="Search this site">
 *   <!-- inject results here after calling your API -->
 *   <div slot="suggestions"> … </div>
 * </qgds-search-input>
 * ```
 */
@customElement(tagName)
export class QGDSSearchInput extends LitElement {
  @property({ type: String, reflect: true })
  value: string = "";

  @property({ type: String })
  placeholder?: string;

  @property({ type: String })
  name?: string;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String })
  variant?: FormVariant;

  @property({ type: Number })
  debounce: number = 100;

  /**
   * Suggestion groups to render inside the dropdown. Set as a JS array, or
   * declaratively as a JSON string attribute (e.g.
   * `suggestions='[{"heading":"…","items":[{"label":"…","href":"…"}]}]'`).
   * Malformed input is ignored rather than thrown. When provided, this takes
   * precedence over the `suggestions` slot.
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) => parseSuggestionsAttribute(value) ?? [],
      // Never reflect a (potentially large) array back to an attribute.
      toAttribute: () => null,
    },
  })
  suggestions: SuggestionGroupData[] = [];

  /** Validated/normalised view of `suggestions`, recomputed in `willUpdate`. */
  @state() private _groups: SuggestionGroupData[] = [];

  /** Whether the suggestions slot currently has content. */
  @state() private _hasSuggestions = false;

  /** Whether the dropdown is currently expanded. */
  @state() private _open = false;

  // Shared helper for dispatching qgds custom events.
  private events = new QgdsEvents(this);

  /**
   * Debounced `qgds-input` dispatcher. Rebuilt whenever `debounce` changes
   * (see `willUpdate`) so the delay always matches the current property.
   */
  private _dispatchInputDebounced = debounce(() => this._dispatchInput(), this.debounce);

  static styles = [baseStyles, formStyles, unsafeCSS(componentCSS), utilitiesStyles];

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("debounce")) {
      this._dispatchInputDebounced = debounce(() => this._dispatchInput(), Math.max(0, this.debounce));
    }
    if (changed.has("suggestions")) {
      // Validate whatever was set (JS array or parsed JSON attribute) before render.
      this._groups = normalizeSuggestions(this.suggestions);
      this._syncOpen();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this._dispatchInputDebounced.cancel();
  }

  private get _listboxId(): string {
    return `${this.id || "qgds-search"}-suggestions`;
  }

  /**
   * Input event handler — updates `value` and notifies listeners so they can
   * fetch suggestions. The `qgds-input` dispatch is debounced by `debounce` ms.
   * The component itself performs no data fetching.
   */
  private _handleInput = (e: Event): void => {
    this.value = (e.target as HTMLInputElement).value;
    this._syncOpen();
    this._dispatchInputDebounced();
  };

  private _dispatchInput(): void {
    this.events.dispatch("input", { value: this.value });
  }

  /**
   * Handle Enter key to trigger search without needing to click the button.
   * Escape closes the dropdown.
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      this._dispatchSearch();
    } else if (e.key === "Escape" && this._open) {
      e.stopPropagation();
      this._open = false;
    }
  };

  private _handleFocusIn = (): void => {
    this._syncOpen();
  };

  /**
   * Close the dropdown when focus leaves the component entirely. Focus may land
   * on a slotted item (light DOM, `this.contains`) or on a suggestion rendered
   * from the `suggestions` data (shadow DOM, `renderRoot.contains`) — neither of
   * which should close the panel. `Node.contains` does not cross shadow roots,
   * so both trees must be checked.
   */
  private _handleFocusOut = (e: FocusEvent): void => {
    const next = e.relatedTarget as Node | null;
    const stillInside = !!next && (this.contains(next) || this.renderRoot.contains(next));
    if (!stillInside) {
      this._open = false;
    }
  };

  private _handleSuggestionsSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this._hasSuggestions = slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE) return !!(node.textContent ?? "").trim();
      return false;
    });
    this._syncOpen();
  };

  /** True when there are suggestions to show — from data or the slot. */
  private get _hasContent(): boolean {
    return this._groups.length > 0 || this._hasSuggestions;
  }

  /** The panel is open when the field has focus and there is something to show. */
  private _syncOpen(): void {
    this._open = this.matches(":focus-within") && this._hasContent;
  }

  private _dispatchSearch = (): void => {
    // An explicit submit supersedes any in-flight typing — cancel the pending
    // debounced suggestion lookup so it can't fire after the user has searched.
    this._dispatchInputDebounced.cancel();
    this.events.dispatch("search", { value: this.value });
  };

  /**
   * An autocomplete item was chosen — fill the field with its value, close the
   * dropdown, and run a search. Suggestion (link) items navigate instead and
   * never reach here.
   */
  private _handleSuggestionSelect = (e: Event): void => {
    const detail = (e as CustomEvent<{ value: string }>).detail;
    if (!detail || typeof detail.value !== "string") return;
    this.value = detail.value;
    this._open = false;
    this._dispatchSearch();
  };

  /** Render validated suggestion groups from the `suggestions` data. */
  private _renderGroups() {
    return repeat(
      this._groups,
      (group, i) => `${group.heading ?? ""}:${i}`,
      (group) => html`
        <qgds-search-suggestion-group
          type=${group.type}
          heading=${ifDefined(group.heading)}
          ?feature=${group.feature}
          view-more-url=${ifDefined(group.viewMoreUrl)}
          view-more-label=${ifDefined(group.viewMoreLabel)}
        >
          ${group.items.map(
            (item) => html`
              <qgds-search-suggestion
                type=${group.type}
                label=${item.label}
                href=${ifDefined(item.href)}
                target=${ifDefined(item.target)}
                icon=${ifDefined(item.icon)}
              ></qgds-search-suggestion>
            `
          )}
        </qgds-search-suggestion-group>
      `
    );
  }

  render() {
    const showPanel = this._open && this._hasContent;
    const hasData = this._groups.length > 0;

    return html`
      <div
        class=${classMap({ "search-input-wrapper": true, "is-disabled": !!this.disabled })}
        @focusin=${this._handleFocusIn}
        @focusout=${this._handleFocusOut}
        @qgds-suggestion-select=${this._handleSuggestionSelect}
      >
        <qgds-icon class="search-icon" icon-id="search" size="sm" aria-hidden="true"></qgds-icon>
        <input
          class=${classMap({
            "qgds-form-control": true,
            "search-input": true,
            "is-filled": this.variant === "filled",
          })}
          type="search"
          role="combobox"
          name=${ifDefined(this.name)}
          .value=${this.value}
          placeholder=${ifDefined(this.placeholder)}
          ?disabled=${this.disabled}
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded=${showPanel ? "true" : "false"}
          aria-controls=${this._listboxId}
          autocomplete="off"
          @input=${this._handleInput}
          @keydown=${this._handleKeyDown}
        />
        <button
          class="search-btn"
          type="button"
          ?disabled=${this.disabled}
          aria-label="Search"
          @click=${this._dispatchSearch}
        >
          <qgds-icon class="search-btn-icon" icon-id="search" size="md" aria-hidden="true"></qgds-icon>
          <span class="search-btn-label">Search</span>
        </button>

        <div
          part="panel"
          id=${this._listboxId}
          class=${classMap({ "search-suggestions": true, "is-open": showPanel })}
          role="region"
          aria-label="Search suggestions"
          ?hidden=${!showPanel}
        >
          ${hasData ? this._renderGroups() : nothing}
          <slot
            name="suggestions"
            ?hidden=${hasData}
            @slotchange=${this._handleSuggestionsSlotChange}
          ></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSSearchInput;
  }
}
