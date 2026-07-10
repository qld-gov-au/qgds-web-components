import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-footer-contact-item.styles.scss?inline";

import "../qgds-icon/qgds-icon.js";
import { ICON_NAMES, type IconName } from "../qgds-icon/icon-names";

/**
 * Contact item for use in the `contact-link` slot of `<qgds-footer>`.
 *
 * @property {IconName} [iconId=""] - Icon identifier rendered via `<qgds-icon>`.
 * @property {string} [label] - Optional label text shown before the value.
 * @property {string} [href] - Optional href for the value; when provided, the value is rendered as an anchor.
 * @property {string} [value] - Fallback display value when no slotted content is provided.
 *
 * @slot - Optional custom value/link content. Overrides `value` when provided.
 */
@customElement("qgds-footer-contact-item")
export class QGDSFooterContactItem extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  // Self-defined slot name when dropped into a parent
  @property({ type: String, reflect: true })
  slot = "contact-link";

  // Validate and normalize the icon incoming value instantly
  @property({
    type: String,
    attribute: "icon-id",
    converter: (value) => {
      const normalised = String(value ?? "").trim();
      return (ICON_NAMES as readonly string[]).includes(normalised) ? (normalised as IconName) : "";
    },
  })
  iconId: IconName | "" = "";

  @property({ type: String })
  label = "";

  @property({ type: String })
  href = "";

  @property({ type: String })
  value = "";

  connectedCallback() {
    //eslint-disable-next-line
    super.connectedCallback();
  }

  render() {
    return html`
      <div class="contact-item">
        ${this.iconId ? html`<qgds-icon icon-id=${this.iconId} size="sm" aria-hidden="true"></qgds-icon>` : nothing}
        ${this.label ? html`<span class="label">${this.label}:</span>` : nothing}
        ${this.href
          ? html`<a class="value-link" href=${this.href} noopener noreferrer><slot>${this.value}</slot></a>`
          : html`<span class="value-text"><slot>${this.value}</slot></span>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-footer-contact-item": QGDSFooterContactItem;
  }
}
