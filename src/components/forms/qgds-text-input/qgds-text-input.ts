import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { QGDSFormField } from "../qgds-form-field";
import { IFormControl, FormVariant } from "../../../types/forms";

type InputType = "text" | "email" | "password" | "number" | "tel" | "url";
export type Size = "full" | number;

const sizeConverter = {
  fromAttribute: (value: string | null): Size | undefined => {
    if (value === null) return undefined;
    if (value === "full") return "full";
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  },
  toAttribute: (value: Size | undefined | null): string | null => {
    if (value === undefined || value === null) return null;
    if (value === "full") return "full";
    return isNaN(value) ? null : String(value);
  },
};

export const tagName = "qgds-text-input";
/**
 *
 * Text inputs are input fields typically used in forms that allow the user to enter text data in a structured format.
 * Text inputs should be accompanied by labels.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97997&m=dev
 * @website https://www.designsystem.qld.gov.au/components/text-input
 *
 * @tagname qgds-text-input
 *
 * @prop {FormVariant} [variant] - The visual style of the input, either "filled" or "outlined".
 * @prop {InputType} [type="text"] Provides built in validation for specific types. Either "text"(default), "email", "password", "number", "tel", "url".
 * @prop {string} [placeholder] - Text to display when the value is empty.
 * @prop {Size} [size] - Defines the number of visible characters displayed within the input. Also accept the string "full", to create a full-width input.
 * @prop {string} [autocomplete] - Whether the value of the control can be automatically completed by the browser. See https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
 * @prop {string} [value]
 * @prop {number} [maxLength] - Indicates the maximum number of characters allowed to be entered for the value of the `<input>` element, and the maximum number of characters allowed for the value to be valid.
 * @prop {number} [minLength]
 * @prop {Regex} [pattern] - specifies a regular expression the form control's value should match. If a non-null value doesn't conform to the constraints set by the pattern value, the ValidityState object's read-only patternMismatch property will be true.
 * @prop {boolean} [spellcheck=false] - defines whether the element may be checked for spelling errors. Unlike most html boolean attributes this attribute may be set to "false" rather than omitted, to override inheritance.
 *
 * @slot details - place any markup to be rendered within the "Summary" dropdown
 *
 * @example
 * ```html
 * <qgds-text-input variant="filled" value="Highly respected" placeholder="Enter a value"></qgds-text-input>
 * ```
 */

@customElement(tagName)
export class QGDSTextInput extends QGDSFormField implements IFormControl {
  @property({ type: String }) variant?: FormVariant;
  @property({ type: String }) type?: InputType;
  @property({ type: String }) placeholder?: HTMLInputElement["placeholder"];
  @property({ type: Number }) maxLength?: HTMLInputElement["maxLength"]; // do not kebab case, default HTML attribute
  @property({ type: Number }) minLength?: HTMLInputElement["minLength"]; // do not kebab case, default HTML attribute
  @property({ type: String }) pattern?: HTMLInputElement["pattern"];
  @property({ type: Boolean }) spellcheck: HTMLInputElement["spellcheck"] = false; // spellcheck is an attribute of HTMLElement already
  @property({ converter: sizeConverter }) size?: Size;
  @property({ type: String }) autocomplete?: HTMLInputElement["autocomplete"];

  protected renderInput(): TemplateResult {
    const size = typeof this.size === "number" ? this.size : undefined;

    // The lit vscode plugin chokes on autocomplete attribute because the Typescript defines a dynamic type.
    // Casting to any disables the typecheck.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autocomplete: any = this.autocomplete === "" ? undefined : this.autocomplete;
    const {
      name,
      id,
      variant,
      validationState,
      type,
      value,
      placeholder,
      required,
      readOnly,
      disabled,
      spellcheck,
      maxLength,
      minLength,
      pattern,
      _ariaDescribedBy,
      handleChange,
    } = this;

    return html`<input
      name="${ifDefined(name)}"
      id=${id}
      class=${classMap({
        "qgds-form-control": true,
        "is-filled": variant === "filled",
        "is-valid": validationState === "success",
        "is-invalid": validationState === "error",
        "is-full-width": this.size === "full",
      })}
      size=${ifDefined(size)}
      type=${type ?? "text"}
      value=${ifDefined(value)}
      placeholder=${ifDefined(placeholder)}
      autocomplete=${ifDefined(autocomplete)}
      ?required=${required}
      ?readonly=${readOnly}
      ?disabled=${disabled}
      spellcheck=${ifDefined(spellcheck)}
      maxlength=${ifDefined(maxLength)}
      minlength=${ifDefined(minLength)}
      pattern=${ifDefined(pattern)}
      aria-describedby=${ifDefined(_ariaDescribedBy)}
      @change=${handleChange}
    />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSTextInput;
  }
}
