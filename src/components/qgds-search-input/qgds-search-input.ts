import { LitElement, html, unsafeCSS, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { baseStyles, formStyles, utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-search-input.styles.scss?inline";
import { FormVariant } from "../../types/forms";
import { QgdsEvents } from "../../utils/events/event-controller";
import { debounce } from "../../utils";
// Side-effect imports register the suggestion sub-components so consumers can
// inject them into the `suggestions` slot without importing them separately.
import "../qgds-search-suggestion-group/qgds-search-suggestion-group.js";
import "../qgds-search-suggestion/qgds-search-suggestion.js";

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
 * @prop {String} [placeholder="Search"] - Placeholder text for the input.
 * @prop {String} [name] - Name attribute passed to the underlying input.
 * @prop {Boolean} [disabled=false] - Disables the input and button.
 * @prop {FormVariant} [variant] - Visual style of the input. "filled" uses a shaded background with only a bottom border.
 * @prop {Number} [debounce=100] - Milliseconds to debounce the `qgds-input` event by. Submitting (Enter/button) cancels any pending debounced `qgds-input` and fires `qgds-search` immediately.
 *
 * @slot suggestions - Search results / suggestions rendered inside the dropdown panel.
 *   Fill this in response to `qgds-input` after calling your own API. The panel is
 *   hidden automatically when the slot is empty.
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
   * Close the dropdown when focus leaves the component entirely.
   * `relatedTarget` is null when focus moves outside the shadow tree.
   */
  private _handleFocusOut = (e: FocusEvent): void => {
    const next = e.relatedTarget as Node | null;
    if (!next || !this.contains(next)) {
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

  /** The panel is open when the field has focus and there is something to show. */
  private _syncOpen(): void {
    const focused = this.matches(":focus-within");
    this._open = focused && this._hasSuggestions;
  }

  private _dispatchSearch = (): void => {
    // An explicit submit supersedes any in-flight typing — cancel the pending
    // debounced suggestion lookup so it can't fire after the user has searched.
    this._dispatchInputDebounced.cancel();
    this.events.dispatch("search", { value: this.value });
  };

  render() {
    const showPanel = this._open && this._hasSuggestions;

    return html`
      <div
        class=${classMap({ "search-input-wrapper": true, "is-disabled": !!this.disabled })}
        @focusin=${this._handleFocusIn}
        @focusout=${this._handleFocusOut}
      >
        <qgds-icon class="search-icon" icon-id="search" size="md" aria-hidden="true"></qgds-icon>
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
          <slot name="suggestions" @slotchange=${this._handleSuggestionsSlotChange}></slot>
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
