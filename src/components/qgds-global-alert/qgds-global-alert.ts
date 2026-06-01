import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../qgds-icon/qgds-icon";
import "../qgds-link/qgds-link";
import styles from "./qgds-global-alert.styles.scss?inline";
import { baseStyles } from "../../styles";
import type { IconName } from "../qgds-icon/icon-names";

export type GlobalAlertVariant = "critical" | "warning" | "general";

/**
 * QGDS Global Alert
 *
 * A global alert displays across the top of the entire site to convey important
 * information to the users. The message or action must be relevant for the entire service.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?m=auto&node-id=120360-110114&t=SIwUGoc3L6h6S92G-1
 * @website https://www.designsystem.qld.gov.au/components/global-alert
 *
 * @prop {GlobalAlertVariant} [variant="warning"] The alert variant: "critical", "warning", or "general".
 * @prop {string} [heading] An optional heading for the alert.
 * @prop {string} [actionLabel] Text for the optional action link.
 * @prop {string} [actionHref] URL for the optional action link.
 * @prop {boolean} [isDismissible=false] Whether a close button is shown to allow the user to dismiss the alert.
 * @prop {boolean} [isDismissed=false] Whether the alert has been dismissed. Can be set externally to track or control dismissed state.
 *
 * @slot - Default content slot for the alert message. Supports rich content such as <strong> tags.
 *
 * @fires {CustomEvent} qgds-global-alert-dismiss - Fired when the user clicks the close button.
 */
@customElement("qgds-global-alert")
export class QGDSGlobalAlert extends LitElement {
  @property({ type: String, useDefault: true })
  variant: GlobalAlertVariant = "warning";

  // Heading
  @property({ type: String, attribute: "heading" })
  heading?: string;

  // CTA properties
  @property({ type: String, attribute: "action-label" })
  actionLabel?: string;

  @property({ type: String, attribute: "action-href" })
  actionHref?: string;

  // Dismissible property
  @property({ type: Boolean, reflect: true, attribute: "is-dismissible" })
  isDismissible: boolean = false;

  @property({ type: Boolean, reflect: true, attribute: "is-dismissed" })
  isDismissed: boolean = false;

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(styles)}
    `,
  ];

  private static readonly icons: Record<GlobalAlertVariant, IconName> = {
    critical: "alert-danger",
    warning: "alert-warning",
    general: "alert-information",
  };

  private static readonly ariaLabels: Record<GlobalAlertVariant, string> = {
    critical: "Alert",
    warning: "Warning",
    general: "Information",
  };

  private _handleDismiss = () => {
    const dismissEvent = new CustomEvent("qgds-global-alert-dismiss", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        variant: this.variant,
        heading: this.heading,
        actionLabel: this.actionLabel,
        actionHref: this.actionHref,
      },
    });

    this.dispatchEvent(dismissEvent);

    if (dismissEvent.defaultPrevented) {
      return;
    }

    this.isDismissed = true;
    this.remove();
  };

  render() {
    if (this.isDismissed) {
      return nothing;
    }

    const ariaLabel = QGDSGlobalAlert.ariaLabels[this.variant];

    return html`
      <div role="region" aria-label="${ariaLabel}" class="global-alert is-${this.variant}">
        <div class="main">
          <div class="content">
            <p class="heading">
              <qgds-icon aria-hidden="true" icon-id="${QGDSGlobalAlert.icons[this.variant]}" size="sm"></qgds-icon>
              ${this.heading}
            </p>
            <slot></slot>

            ${this.actionLabel && this.actionHref
              ? html`
                  <qgds-link
                    href="${this.actionHref}"
                    icon-name="arrow-right"
                    icon-size="md"
                    label="${this.actionLabel}"
                    has-trailing-icon
                    animation="leftToRight"
                  >
                  </qgds-link>
                `
              : ""}
          </div>

          ${this.isDismissible
            ? html`
                <div class="close">
                  <button aria-label="Close alert" @click="${this._handleDismiss}">
                    <qgds-icon icon-id="close" size="sm"></qgds-icon>
                  </button>
                </div>
              `
            : ""}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-global-alert": QGDSGlobalAlert;
  }
}
