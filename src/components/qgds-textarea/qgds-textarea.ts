import { LitElement, html, PropertyValues, nothing, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { resetStyles, formStyles, utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-textarea.styles.scss?inline";

type Variant = "filled" | "outline";
const tagName = "qgds-textarea";
/**
 * QGDS Text input
 *
 * Text inputs are input fields typically used in forms that allow the user to enter text data in a structured format.
 * Text inputs should be accompanied by labels.
 *
 * @element qgds-textarea
 * @prop {String} id - Required for all form inputs.
 * @prop {Variant} [variant="outline"] - The visual style of the input, either "outline" (default) or "filled".
 * @prop {String} [label] The input's label, defines what the input value represents.
 * @prop {Boolean} [required] - indicate whether the field is required. In addition to built in HTML validation, will display an asterix.
 * @prop {String} [indicateIf="required"] Display a red asterisk for required, or appended "(optional)" to the label if not required.
 * @prop {String} [hint] - Hint text
 * @prop {String} [placeholder] - Text to display when the value is empty.
 * @prop {String} [value]
 * @prop {Boolean} [disabled]
 * @prop {Boolean} [readOnly]
 * @prop {Number} [maxLength]
 * @prop {Number} [minLength]
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
export class QGDSTextarea extends LitElement {
  @property({ type: String }) id!: HTMLElement["id"];
  @property({ type: String }) variant: Variant = "outline";
  @property({ type: String }) label: string = "";
  @property({ type: Boolean }) required?: boolean;
  @property({ type: String, attribute: "indicate-if", useDefault: true }) indicateIf: "required" | "optional" | "none" =
    "required";
  @property({ type: String }) hint?: string;
  @property({ type: String }) feedback?: string;
  @property({ type: String, attribute: "validation-state" }) validationState?: "success" | "error";
  @property({ type: String, attribute: "details-summary" }) detailsSummary?: string = "More information";
  // Forward standard HTMLTextarea properties.
  @property({ type: String }) placeholder?: HTMLTextAreaElement["placeholder"];
  @property({ type: String }) value?: HTMLTextAreaElement["value"];
  @property({ type: Boolean }) disabled?: HTMLTextAreaElement["disabled"];
  @property({ type: Boolean, attribute: "readonly" }) readOnly?: HTMLTextAreaElement["readOnly"]; // default html attribute is not kebab-case
  @property({ type: Number, attribute: "maxlength" }) maxLength?: HTMLTextAreaElement["maxLength"]; // default html attribute is not kebab-case
  @property({ type: Number, attribute: "minlength" }) minLength?: HTMLTextAreaElement["minLength"]; // default html attribute is not kebab-case
  @property({ type: Boolean }) spellcheck: HTMLTextAreaElement["spellcheck"] = false; // spellcheck is an attribute of HTMLElement already

  static styles = [
    resetStyles,
    formStyles,
    utilitiesStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("id") && !this.id) {
      console.warn(`${tagName}: id attribute is required`);
    }
  }

  private renderRequiredIndicator() {
    return this.required && this.indicateIf === "required"
      ? html`<span class="qgds-form-label-required" aria-hidden="true">*</span><span class="sr-only">(Required)</span>`
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

    return html` ${this.label
        ? html`<label class="qgds-form-label">
            ${this.renderRequiredIndicator()} ${this.label} ${this.renderOptionalIndicator()}
          </label>`
        : nothing}
      ${this.hint ? html`<p class="qgds-form-hint">${this.hint}</p>` : nothing}
      <slot name="details"></slot>
      <textarea
        id=${this.id}
        class=${classMap({
          "qgds-form-control is-full-width": true,
          "is-filled": this.variant === "filled",
        })}
        placeholder=${ifDefined(this.placeholder)}
        ?required=${this.required}
        ?readonly=${this.readOnly}
        ?disabled=${this.disabled}
        maxlength=${ifDefined(this.maxLength)}
        minlength=${ifDefined(this.minLength)}
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
