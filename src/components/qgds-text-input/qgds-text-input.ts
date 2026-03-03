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
 * @attr {Variant} [variant="outline"] - The visual style of the input, either "outline" (default) or "filled".
 * @attr {string} id - required for all form inputs.
 * @attr {string} [label] The input's label, defines what the input value represents.
 * @attr {Boolean} [required] - indicate whether the field is required. In addition to built in HTML validation, will display an asterix.
 * @attr {string} [indicate-if="required"] Display a red asterisk for required, or appended "(optional)" to the label if not required.
 * @attr {InputType} [type="text"] Provides built in validation for specific types. Either "text"(default), "email", "password", "number", "tel", "url".
 * @attr {string} [hint] - Hint text
 * @attr {string} [placeholder=""] - Text to display when the value is empty.
 * @attr {string} [value]
 * @attr {boolean} [disabled]
 * @attr {Boolean} [readonly]
 * @attr {Number} [maxlength]
 * @attr {Number} [minlength]
 * @attr {Regex} [pattern]
 * @attr {Boolean} [spellcheck]
 * @attr {String} [details-summary="More information"] - If details slot is used, this text will be displayed as the clickable summary.
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
  @property({ type: String }) validationState?: "success" | "error";
  // @property({type:Boolean})spellcheck: boolean = false; // spellcheck is an attribute of HTMLElement already

  static styles = [resetStyles, formStyles];

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("id") && !this.id) {
      console.warn(`${tagName}: id attribute is required for accessibility`);
    }
  }

  private renderLabel = () =>
    this.label
      ? html`<label class="qgds-form-label"
          >${this.required && this.indicateIf === "required"
            ? html`<span class="qgds-form-label-required">*</span>`
            : nothing}
          ${this.label}${!this.required && this.indicateIf === "optional"
            ? html` <span class="qgds-form-label-optional">(optional)</span>`
            : nothing}</label
        >`
      : nothing;

  private renderHint = () => (this.hint ? html`<qgds-form-hint>${this.hint}</qgds-form-hint>` : nothing);

  private renderDetails = () => html`<slot name="details"></slot>`;

  private renderFormControl = () =>
    html`<input
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
      pattern=${ifDefined(this.pattern)}
      feedback=${ifDefined(this.feedback)}
    />`;

  render() {
    if (!this.id) {
      console.warn(`${tagName}: id attribute is required`);
      return html`<p style="color: red;">Error: id attribute is required</p>`;
    }

    // TODO: render summary
    // TODO: render validation feedback

    // The .form-control class is directly on the input element. More complex features may require .form-control to be placed on a wrapping element instead (eg clearable button)

    return html` ${this.renderLabel()} ${this.renderHint()} ${this.renderDetails()} ${this.renderFormControl()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSTextInput;
  }
}
