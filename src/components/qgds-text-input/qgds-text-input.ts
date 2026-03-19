import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { QGDSFormField } from "../../utils/abstracts/qgds-form-field";
import { IFormControl } from "../../types/forms";

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
 * @tagname qgds-text-input
 *
 * @prop {InputType} [type="text"] Provides built in validation for specific types. Either "text"(default), "email", "password", "number", "tel", "url".
 * @prop {String} [placeholder] - Text to display when the value is empty.
 * @prop {String} [value]
 * @prop {Number} [maxLength]
 * @prop {Number} [minLength]
 * @prop {Regex} [pattern]
 * @prop {Boolean} [spellcheck]
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
  @property({ type: String }) type?: InputType;
  @property({ type: String }) placeholder?: HTMLInputElement["placeholder"];
  @property({ type: String }) value?: HTMLInputElement["value"];
  // @property({ type: Boolean }) disabled?: HTMLInputElement["disabled"];
  // @property({ type: Boolean, attribute: "readonly" }) readOnly?: HTMLInputElement["readOnly"];
  @property({ type: Number, attribute: "maxlength" }) maxLength?: HTMLInputElement["maxLength"];
  @property({ type: Number, attribute: "minlength" }) minLength?: HTMLInputElement["minLength"];
  @property({ type: RegExp }) pattern?: HTMLInputElement["pattern"];
  @property({ type: Boolean }) spellcheck: HTMLInputElement["spellcheck"] = false; // spellcheck is an attribute of HTMLElement already

  renderInput(): TemplateResult {
    return html`<input
      id=${this.id}
      class=${classMap({
        "qgds-form-control": true,
        "is-filled": this.variant === "filled",
        "is-success": this.validationState === "success",
        "is-error": this.validationState === "error",
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
    />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSTextInput;
  }
}
