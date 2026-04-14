import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { baseStyles, utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-search-input.styles.scss?inline";
import { FormVariant } from "../../types/forms";
import { QgdsEvents } from "../../utils/events/event-controller";

export const tagName = "qgds-search-input";
export type QGDSSearchInputProps = InstanceType<typeof QGDSSearchInput>;

/**
 * A composite search input that pairs a text field with a search button.
 * Standalone component — does not extend QGDSFormField and has no form association.
 *
 * @tagname qgds-search-input
 *
 * @prop {String} [value] - The current value of the search field.
 * @prop {String} [placeholder="Search"] - Placeholder text for the input.
 * @prop {String} [name] - Name attribute passed to the underlying input.
 * @prop {Boolean} [disabled=false] - Disables the input and button.
 * @prop {FormVariant} [variant] - Visual style of the input. "filled" uses a shaded background with only a bottom border.
 *
 * @fires {CustomEvent<{ value: string }>} qgds-search - Fired on button click or Enter key.
 *
 * @example
 * ```html
 * <!-- Default -->
 * <qgds-search-input placeholder="Search this site"></qgds-search-input>
 *
 * <!-- Responsive behavior handled automatically via container queries -->
 * <qgds-search-input></qgds-search-input>
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

  // Shared helper for dispatching qgds custom events.
  private events = new QgdsEvents(this);

  static styles = [
    baseStyles,
    utilitiesStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  /**
   * Input event handler to update the `value` property as the user types.
   * @param e
   */
  private _handleInput = (e: Event): void => {
    this.value = (e.target as HTMLInputElement).value;
  };

  /**
   * Handle Enter key to trigger search without needing to click the button.
   * @param e
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      this._dispatchSearch();
    }
  };

  /**
   * Dispatch the custom "qgds-search" event with the current value when the search button is clicked.
   */
  private _handleButtonClick = (): void => {
    this._dispatchSearch();
  };

  private _dispatchSearch(): void {
    this.events.dispatch("search", { value: this.value });
  }

  render() {
    return html`
      <div class=${classMap({ "search-input": true, "is-disabled": !!this.disabled })}>
        <div class="field-wrap">
          <qgds-icon class="search-icon" icon-id="search" size="md" aria-hidden="true"></qgds-icon>
          <input
            class=${classMap({ input: true, "is-filled": this.variant === "filled" })}
            type="search"
            name=${ifDefined(this.name)}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            aria-label="Search"
            @input=${this._handleInput}
            @keydown=${this._handleKeyDown}
          />
        </div>
        <button
          class="btn"
          type="button"
          ?disabled=${this.disabled}
          aria-label="Search"
          @click=${this._handleButtonClick}
        >
          <qgds-icon class="btn-icon" icon-id="search" size="md" aria-hidden="true"></qgds-icon>
          <span class="btn-label">Search</span>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSSearchInput;
  }
}
