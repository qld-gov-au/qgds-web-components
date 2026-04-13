import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-search-input.styles.scss?inline";
import { FormVariant } from "../../types/forms";

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
 * @prop {String} [button-label="Search"] - Label for the search button. Also used as aria-label when icon-only.
 * @prop {Boolean} [icon-only=false] - Render an icon-only button instead of the labelled button.
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
 * <!-- Responsive / icon only -->
 * <qgds-search-input icon-only></qgds-search-input>
 * ```
 */
@customElement(tagName)
export class QGDSSearchInput extends LitElement {
  @property({ type: String })
  value: string = "";

  @property({ type: String })
  placeholder: string = "Search";

  @property({ type: String })
  name?: string;

  @property({ type: String, attribute: "button-label" })
  buttonLabel: string = "Search";

  @property({ type: Boolean, reflect: true, attribute: "icon-only" })
  iconOnly: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String })
  variant?: FormVariant;

  static styles = [
    ...baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  private _handleInput = (e: Event): void => {
    this.value = (e.target as HTMLInputElement).value;
  };

  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      this._dispatchSearch();
    }
  };

  private _handleButtonClick = (): void => {
    this._dispatchSearch();
  };

  private _dispatchSearch(): void {
    this.dispatchEvent(
      new CustomEvent("qgds-search", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
  }

  render() {
    return html`
      <div class=${classMap({ "search-input": true, "is-disabled": !!this.disabled })}>
        <div class="field-wrap">
          ${!this.iconOnly
            ? html`<qgds-icon
                class="search-icon"
                icon-id="search"
                size="md"
                aria-hidden="true"
              ></qgds-icon>`
            : null}
          <input
            class=${classMap({ input: true, "is-filled": this.variant === "filled" })}
            type="search"
            name=${ifDefined(this.name)}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            aria-label=${this.iconOnly ? this.buttonLabel : "Search"}
            @input=${this._handleInput}
            @keydown=${this._handleKeyDown}
          />
        </div>
        <button
          class=${classMap({ btn: true, "icon-only": this.iconOnly })}
          type="button"
          ?disabled=${this.disabled}
          aria-label=${this.iconOnly ? this.buttonLabel : ifDefined(undefined)}
          @click=${this._handleButtonClick}
        >
          ${this.iconOnly
            ? html`<qgds-icon icon-id="search" size="md" aria-hidden="true"></qgds-icon>`
            : this.buttonLabel}
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
