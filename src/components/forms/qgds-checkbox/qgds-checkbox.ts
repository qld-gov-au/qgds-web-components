import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../../styles";
import componentCSS from "./qgds-checkbox.styles.scss?inline";
import { FormValidationState } from "../../../types/forms";
import { classMap } from "lit/directives/class-map.js";

export type QGDSCheckboxProps = InstanceType<typeof QGDSCheckbox>;

/**
 * A styled checkbox input that works standalone or inside `<qgds-field-group>`.
 * Re-dispatches a composed `change` event from the host so `qgds-field-group`
 * can intercept it across the shadow DOM boundary.
 *
 * @tagname qgds-checkbox
 *
 * @prop {string} value - The value submitted when the checkbox is checked.
 * @prop {string} label - Visible label text.
 * @prop {string} name  - Input name, required when used outside a field group.
 * @prop {boolean} checked  - Whether the checkbox is checked.
 * @prop {boolean} disabled - Whether the checkbox is disabled.
 *
 * @fires {Event} change - Native composed change event re-dispatched from the host.
 *
 * @example
 * ```html
 * <qgds-field-group label="Interests">
 *   <qgds-checkbox value="design" label="Design"></qgds-checkbox>
 *   <qgds-checkbox value="code"   label="Code"></qgds-checkbox>
 * </qgds-field-group>
 * ```
 */
@customElement("qgds-checkbox")
export class QGDSCheckbox extends LitElement {
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

  @property({ type: String, reflect: true })
  validationState?: FormValidationState;

  /** Exposed so qgds-field-group can identify this as a checkbox via duck-typing */
  readonly type = "checkbox";

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  private _handleChange = (e: Event): void => {
    this.checked = (e.target as HTMLInputElement).checked;

    // Re-dispatch a composed change from the host so qgds-field-group can catch it
    // (native change is composed:false and stops at the shadow root boundary)
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  //  ifDefined(this.id)

  render() {
    return html`
      <label
        class="${classMap({
          checkbox: true,
          "is-valid": this.validationState === "success",
          "is-invalid": this.validationState === "error",
        })}"
      >
        <input
          type="checkbox"
          id=${this.id || nothing}
          name=${this.name}
          value=${this.value}
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this._handleChange}
        />
        <span class="label-text">${this.label}</span>
      </label>
    `;
  }
}
