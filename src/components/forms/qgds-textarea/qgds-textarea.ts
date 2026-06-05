import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { QGDSFormField } from "../qgds-form-field";
import { IFormControl, FormVariant } from "../../../types/forms";

export const tagName = "qgds-textarea";

/**
 * Textareas are input fields typically used in forms that allow the user to enter multi-line text data.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-97997&m=dev
 * @website https://www.designsystem.qld.gov.au/components/text-input
 *
 * @tagname qgds-textarea
 *
 * @prop {FormVariant} [variant] - The visual style of the input, either "filled" or "outlined".
 * @prop {string} [value]
 * @prop {string} [placeholder] - Text to display when the value is empty.
 * @prop {string} [autocomplete] - Whether the value of the control can be automatically completed by the browser. See https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
 * @prop {number} [maxLength] - Maximum number of characters allowed.
 * @prop {number} [minLength] - Minimum number of characters required.
 * @prop {boolean} [spellcheck=false] - Enable browser spell checking.
 *
 * @slot details - Place any markup to be rendered within additional details.
 */
@customElement(tagName)
export class QGDSTextarea extends QGDSFormField implements IFormControl {
  @property({ type: String }) variant?: FormVariant;
  @property({ type: String }) value?: HTMLTextAreaElement["value"];
  @property({ type: String }) placeholder?: HTMLTextAreaElement["placeholder"];
  @property({ type: Number }) maxLength?: HTMLTextAreaElement["maxLength"]; // do not kebab case, default HTML attribute
  @property({ type: Number }) minLength?: HTMLTextAreaElement["minLength"]; // do not kebab case, default HTML attribute
  @property({ type: Boolean }) spellcheck: HTMLTextAreaElement["spellcheck"] = false;
  @property({ type: String }) autocomplete?: HTMLTextAreaElement["autocomplete"];

  protected renderInput(): TemplateResult {
    // The lit vscode plugin chokes on autocomplete attribute because the Typescript defines a dynamic type.
    // Casting to any disables the typecheck.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autocomplete: any = this.autocomplete === "" ? undefined : this.autocomplete;
    const {
      name,
      id,
      variant,
      validationState,
      value,
      placeholder,
      required,
      readOnly,
      disabled,
      spellcheck,
      maxLength,
      minLength,
      _ariaDescribedBy,
      handleChange,
    } = this;

    return html`<textarea
      name="${ifDefined(name)}"
      id=${id}
      class=${classMap({
        "qgds-form-control": true,
        "is-filled": variant === "filled",
        "is-valid": validationState === "success",
        "is-invalid": validationState === "error",
      })}
      placeholder=${ifDefined(placeholder)}
      autocomplete=${ifDefined(autocomplete)}
      ?required=${required}
      ?readonly=${readOnly}
      ?disabled=${disabled}
      ?spellcheck=${spellcheck ?? false}
      maxlength=${ifDefined(maxLength)}
      minlength=${ifDefined(minLength)}
      aria-describedby=${ifDefined(_ariaDescribedBy)}
      @change=${handleChange}
      .value=${value ?? ""}
    ></textarea>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSTextarea;
  }
}
