import { html, TemplateResult, nothing, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { QGDSFormField } from "../qgds-form-field";
import { resetStyles, formStyles, utilitiesStyles } from "../../../styles";
import componentCSS from "./qgds-textarea.styles.scss?inline";
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
 * @prop {String} [value]
 * @prop {String} [placeholder] - Text to display when the value is empty.
 * @prop {Number} [maxLength] - Maximum number of characters allowed.
 * @prop {Number} [minLength] - Minimum number of characters required.
 * @prop {Boolean} [spellcheck=false] - Enable browser spell checking.
 *
 * @slot details - Place any markup to be rendered within additional details.
 */
@customElement(tagName)
export class QGDSTextarea extends QGDSFormField implements IFormControl {
  @property({ type: String }) variant?: FormVariant;
  @property({ type: String }) value?: HTMLInputElement["value"];
  @property({ type: String }) placeholder?: HTMLTextAreaElement["placeholder"];
  @property({ type: Number, attribute: "maxlength" }) maxLength?: HTMLTextAreaElement["maxLength"];
  @property({ type: Number, attribute: "minlength" }) minLength?: HTMLTextAreaElement["minLength"];
  @property({ type: Boolean }) spellcheck: HTMLTextAreaElement["spellcheck"] = false;

  static styles = [
    resetStyles,
    formStyles,
    utilitiesStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  // private _handleInput = (e: Event): void => {
  //   this.value = (e.target as HTMLTextAreaElement).value;
  // };

  protected renderInput(): TemplateResult {
    return html`<textarea
      name="${ifDefined(this.name)}"
      id=${this.id}
      class=${classMap({
        "qgds-form-control is-full-width": true,
        "is-filled": this.variant === "filled",
        "is-valid": this.validationState === "success",
        "is-invalid": this.validationState === "error",
      })}
      placeholder=${ifDefined(this.placeholder)}
      ?required=${this.required}
      ?readonly=${this.readOnly}
      ?disabled=${this.disabled}
      ?spellcheck=${this.spellcheck}
      maxlength=${ifDefined(this.maxLength)}
      minlength=${ifDefined(this.minLength)}
      aria-describedby="${ifDefined(this._ariaDescribedBy)}"
    >
${this.value ?? nothing}</textarea
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSTextarea;
  }
}
