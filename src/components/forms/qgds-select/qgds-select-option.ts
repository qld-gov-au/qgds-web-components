import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * QGDS Select Option Web Component
 * Used as a child element within {@link QGDSSelect} or {@link QGDSSelectOptgroup} to define individual options.
 *
 * @tagname qgds-select-option
 *
 * @example
 * ```html
 * <qgds-select label="Choose an option">
 *   <qgds-select-option value="option1" label="Option 1"></qgds-select-option>
 *   <qgds-select-option value="option2" label="Option 2" selected></qgds-select-option>
 *   <qgds-select-option value="option3" label="Option 3" disabled></qgds-select-option>
 * </qgds-select>
 * ```
 *
 * @attribute {string} value - The value submitted when this option is selected.
 * @attribute {string} label - Optional label text (defaults to value if not specified).
 * @attribute {boolean} disabled - Whether this option is disabled.
 * @attribute {boolean} selected - Whether this option is initially selected.
 */

export type QGDSSelectOptionProps = InstanceType<typeof QGDSSelectOption>;

@customElement("qgds-select-option")
export class QGDSSelectOption extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
  `;

  @property({ type: String }) value: string = "";
  @property({ type: String }) label?: string = "";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: Boolean, reflect: true }) selected: boolean = false;

  /**
   * Get the text content of the option
   */
  getTextContent(): string {
    // Use label if provided and not empty, otherwise use value
    // Using || instead of ?? because we want empty string to be falsy
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.label || this.value;
  }

  /**
   * Convert this custom element to a native HTMLOptionElement
   */
  toNativeOption(): HTMLOptionElement {
    const option = document.createElement("option");
    option.value = this.value;
    option.textContent = this.getTextContent();
    option.disabled = this.disabled;
    option.selected = this.selected;
    return option;
  }

  render() {
    // Render a semantic <option> element in shadow DOM for accessibility
    // Display label if provided, otherwise use value
    return html`
      <option .value=${this.value} ?disabled=${this.disabled} ?selected=${this.selected}>
        ${
          // Using || instead of ?? because we want empty string to be falsy
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          this.label || this.value
        }
      </option>
    `;
  }
}

// Augment global types
declare global {
  interface HTMLElementTagNameMap {
    "qgds-select-option": QGDSSelectOption;
  }
}
