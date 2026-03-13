import {  html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { QGDSFormField } from "../../utils/components/qgds-form-field";

type InputType = "text" | "email" | "password" | "number" | "tel" | "url";
export const tagName = "qgds-text-input";
/**
 *
 * Text inputs are input fields typically used in forms that allow the user to enter text data in a structured format.
 * Text inputs should be accompanied by labels.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97997&m=dev
 * @website https://www.designsystem.qld.gov.au/components/text-input
 *
 * @element qgds-text-input
 * @prop {String} id - Required for all form inputs.
 * @prop {VariantOptions} [variant="outline"] - The visual style of the input, either "outline" (default) or "filled".
 * @prop {String} [label] The input's label, defines what the input value represents.
 * @prop {Boolean} [required] - indicate whether the field is required. In addition to built in HTML validation, will display an asterix.
 * @prop {IndicateIfOptions} [indicateIf="required"] Display a red asterisk for required, or appended "(optional)" to the label if not required.
 * @prop {InputType} [type="text"] Provides built in validation for specific types. Either "text"(default), "email", "password", "number", "tel", "url".
 * @prop {String} [hint] - Hint text
 * @prop {String} [placeholder] - Text to display when the value is empty.
 * @prop {String} [value]
 * @prop {Boolean} [disabled]
 * @prop {Boolean} [readOnly]
 * @prop {Number} [maxLength]
 * @prop {Number} [minLength]
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
export class QGDSTextInput extends QGDSFormField {
  // @property({ type: String }) id!: HTMLElement["id"];
  // @property({ type: String }) variant: VariantOptions = "outline";
  // @property({ type: String }) label: string = "";
  // @property({ type: String, attribute: "indicate-if", useDefault: true }) indicateIf: IndicateIfOptions = "required";
  // @property({ type: String }) hint?: string;
  // @property({ type: String }) feedback?: string;
  // @property({ type: String, attribute: "validation-state" }) validationState?: "success" | "error";
  // forwarded html input attributes
  // @property({ type: Boolean }) required?: HTMLInputElement["required"];
  @property({ type: String }) type?: InputType;
  @property({ type: String }) placeholder?: HTMLInputElement["placeholder"];
  @property({ type: String }) value?: HTMLInputElement["value"];
  // @property({ type: Boolean }) disabled?: HTMLInputElement["disabled"];
  // @property({ type: Boolean, attribute: "readonly" }) readOnly?: HTMLInputElement["readOnly"];
  @property({ type: Number, attribute: "maxlength" }) maxLength?: HTMLInputElement["maxLength"];
  @property({ type: Number, attribute: "minlength" }) minLength?: HTMLInputElement["minLength"];
  @property({ type: RegExp }) pattern?: HTMLInputElement["pattern"];
  @property({ type: Boolean }) spellcheck: HTMLInputElement["spellcheck"] = false; // spellcheck is an attribute of HTMLElement already

  // static styles = [resetStyles, formStyles, utilitiesStyles];

  // updated(changedProperties: PropertyValues) {
  //   super.updated(changedProperties);

  //   if (changedProperties.has("id") && !this.id) {
  //     console.warn(`${tagName}: id attribute is required`);
  //   }
  // }

  // private renderRequiredIndicator() {
  //   return this.required && this.indicateIf === "required"
  //     ? html`<span class="qgds-form-label-required" aria-hidden="true">*</span><span class="sr-only">(Required)</span>`
  //     : nothing;
  // }

  // private renderOptionalIndicator() {
  //   return !this.required && this.indicateIf === "optional"
  //     ? html` <span class="qgds-form-label-optional">(optional)</span>`
  //     : nothing;
  // }

  renderInput(validationState?: "success" | "error"): TemplateResult {
    return html`<input
        id=${this.id}
        class=${classMap({
          "qgds-form-control": true,
          "is-filled": this.variant === "filled",
          "is-valid": validationState === "success",
          "is-invalid": validationState === "error",
        })}
        type=${this.type ?? "text"}
        value=${ifDefined(this.value)}
        placeholder=${ifDefined(this.placeholder)}
        ?required=${this.required}
        ?readonly=${this.readOnly}
        ?disabled=${this.disabled}
        ?spellcheck=${this.spellcheck}
        maxlength=${ifDefined(this.maxLength)}
        minlength=${ifDefined(this.minLength)}
        pattern=${ifDefined(this.pattern?.toString())}
      />`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSTextInput;
  }
}
