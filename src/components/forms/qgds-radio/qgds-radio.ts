import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { FormValidationState } from "../../../types/forms";
import { baseStyles } from "../../../styles";
import componentCSS from "./qgds-radio.styles.scss?inline";

/**
 * A styled radio input that works standalone or inside `<qgds-field-group>`.
 * Re-dispatches a composed `change` event from the host so `qgds-field-group`
 * can intercept it across the shadow DOM boundary.
 *
 * Because each `<qgds-radio>` has its own shadow root, native browser radio
 * grouping by `name` does not work across instances. Mutual exclusivity is
 * managed by `<qgds-field-group>` when this element is used inside one.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=11056-321347
 * @website https://www.designsystem.qld.gov.au/components/radio
 *
 * @prop {string} value - The value submitted when the radio is selected.
 * @prop {string} label - Visible label text.
 * @prop {string} name  - Input name, required for form association.
 * @prop {boolean} checked  - Whether this radio is selected.
 * @prop {boolean} disabled - Whether this radio is disabled.
 * @prop {FormValidationState} validationState - Visual validation state.
 * @prop {"sm" | "lg"} size - Visual size of the radio. Defaults to `"lg"`.
 *
 * @fires {Event} change - Native composed change event re-dispatched from the host.
 *
 * @example
 * ```html
 * <qgds-form-field label="Priority" hint="Choose one.">
 *   <qgds-field-group name="priority" @qgds-change=${handler}>
 *     <qgds-radio value="low"  label="Low"  name="priority"></qgds-radio>
 *     <qgds-radio value="high" label="High" name="priority"></qgds-radio>
 *   </qgds-field-group>
 * </qgds-form-field>
 * ```
 */
@customElement("qgds-radio")
export class QGDSRadio extends LitElement {
  @property({ type: String })
  value: string = "";

  @property({ type: String })
  label: string = "";

  @property({ type: String })
  name: string = "";

  @property({ type: Boolean, reflect: true })
  checked: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String, attribute: "validation-state", reflect: true })
  validationState?: FormValidationState;

  @property({ type: String, reflect: true })
  size: "sm" | "lg" = "lg";

  /** Exposed so qgds-field-group can identify this as a radio via duck-typing */
  readonly type = "radio";

  static styles = [baseStyles, unsafeCSS(componentCSS)];

  private _handleChange = (e: Event): void => {
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  render() {
    return html`
      <label
        class="${classMap({
          radio: true,
          "is-valid": this.validationState === "success",
          "is-invalid": this.validationState === "error",
        })}"
      >
        <input
          type="radio"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this._handleChange}
        />
        <span class="label-text">${this.label}</span>
      </label>
    `;
  }
}
