import { LitElement, html, PropertyValues, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { resetStyles, formStyles } from "../../styles";

type Variant = "filled" | "outline";
type InputType = "text" | "email" | "password" | "number" | "tel" | "url";
const tagName = "qgds-text-input";
/**
 * QGDS Text input
 *
 * Text inputs are input fields typically used in forms that allow the user to enter text data in a structured format.
 * Text inputs should be accompanied by labels.
 *
 * @element qgds-text-input
 * @prop {String} id - Required for all form inputs.
 * @prop {Variant} [variant="outline"] - The visual style of the input, either "outline" (default) or "filled".
 * @prop {String} [label] The input's label, defines what the input value represents.
 * @prop {Boolean} [required] - indicate whether the field is required. In addition to built in HTML validation, will display an asterix.
 * @prop {String} [indicateIf="required"] Display a red asterisk for required, or appended "(optional)" to the label if not required.
 * @prop {InputType} [type="text"] Provides built in validation for specific types. Either "text"(default), "email", "password", "number", "tel", "url".
 * @prop {String} [hint] - Hint text
 * @prop {String} [placeholder] - Text to display when the value is empty.
 * @prop {String} [value]
 * @prop {Boolean} [disabled]
 * @prop {Boolean} [readonly]
 * @prop {Number} [maxlength]
 * @prop {Number} [minlength]
 * @prop {Regex} [pattern]
 * @prop {String} [feedback] The Validation feedback text, only displays if `validation-state` is one of `success` or `error`
 * @prop {Boolean} [spellcheck]
 * @prop {String} [detailsSummary="More information"] - If details slot is used, this text will be displayed as the clickable summary.
 *
 * @slot details - place any markup to be rendered within the "Summary" dropdown
 *
 * @example
 * ```html
 * <qgds-text-input variant="filled" value="Highly respected" placeholder="Enter a value"></qgds-text-input>
 * ```
 */

@customElement(tagName)
export class QGDSTextInput extends LitElement {
  @property({ type: String }) id!: string;
  @property({ type: String }) variant: Variant = "outline";
  @property({ type: String }) label: string = "";
  @property({ type: Boolean }) required?: boolean;
  @property({ type: String, attribute: "indicate-if", useDefault: true }) indicateIf: "required" | "optional" | "none" =
    "required";
  @property({ type: String }) type?: InputType;
  @property({ type: String }) hint?: string;
  @property({ type: String }) placeholder?: string;
  @property({ type: String }) value?: string;
  @property({ type: Boolean }) disabled?: boolean;
  @property({ type: Boolean }) readonly?: boolean;
  @property({ type: Number }) maxlength?: number;
  @property({ type: Number }) minlength?: number;
  @property({ type: RegExp }) pattern?: RegExp;
  @property({ type: String }) feedback?: string;
  @property({ type: String, attribute: "validation-state" }) validationState?: "success" | "error";
  @property({ type: Boolean }) spellcheck: boolean = false; // spellcheck is an attribute of HTMLElement already
  @property({ type: String, attribute: "details-summary" }) detailsSummary?: string = "More information";

  static styles = [resetStyles, formStyles];

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("id") && !this.id) {
      console.warn(`${tagName}: id attribute is required`);
    }
  }

  private renderRequiredIndicator() {
    return this.required && this.indicateIf === "required"
      ? html`<span class="qgds-form-label-required">*</span>`
      : nothing;
  }

  private renderOptionalIndicator() {
    return !this.required && this.indicateIf === "optional"
      ? html` <span class="qgds-form-label-optional">(optional)</span>`
      : nothing;
  }

  render() {
    if (!this.id) {
      console.warn(`${tagName}: id attribute is required`);
      return html`<p style="color: red;">Error: id attribute is required</p>`;
    }

    return html`
      ${this.label
        ? html`<label class="qgds-form-label">
            ${this.renderRequiredIndicator()} ${this.label}${this.renderOptionalIndicator()}
          </label>`
        : nothing}
      ${this.hint ? html`<p class="qgds-form-hint">${this.hint}</p>` : nothing}
      <slot name="details"></slot>
      <input
        id=${this.id}
        class=${classMap({
          "qgds-form-control": true,
          "is-filled": this.variant === "filled",
        })}
        type=${this.type ?? "text"}
        value=${ifDefined(this.value)}
        placeholder=${ifDefined(this.placeholder)}
        ?required=${this.required}
        ?readonly=${this.readonly}
        ?disabled=${this.disabled}
        maxlength=${ifDefined(this.maxlength)}
        minlength=${ifDefined(this.minlength)}
        pattern=${ifDefined(this.pattern?.toString())}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSTextInput;
  }
}
