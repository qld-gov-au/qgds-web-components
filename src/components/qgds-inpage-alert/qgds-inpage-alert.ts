import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
// import { classMap } from "lit/directives/class-map.js";
import "../qgds-icon/qgds-icon";
import styles from "./qgds-inpage-alert.styles.scss?inline";
import display from "../../scss/typography/qgds-display.scss?inline";
import { ICON_NAMES } from "../qgds-icon/icon-names";

// import { bubbleAllEvents } from "../../js/utils/bubble-events"; // Import the bubble events utility

type AlertVariant = "error" | "info" | "success" | "warning";
type IconName = (typeof ICON_NAMES)[number]; // Gets the literal type of each icon

// Register the custom element
@customElement("qgds-inpage-alert")
export class QGDSInpageAlert extends LitElement {
  // Define properties for the component
  @property({ type: String })
  heading?: string;

  // // @property({ type: String })
  // // message: string;

  @property({ type: String })
  variant: AlertVariant = "info";

  // Define styles for the component
  static styles = [
    css`
      ${unsafeCSS(display)}
    `,

    css`
      ${unsafeCSS(styles)}
    `,
  ];

  // Bind events to bubble up from button
  // firstUpdated() {
  //   // Ensure the button exists before trying to bubble events
  //   this.shadowRoot?.querySelector("button")?.addEventListener("click", (e) => {
  //     bubbleAllEvents(this, e.currentTarget as Element);
  //   });
  // }

  private static readonly icons: Record<AlertVariant, IconName> = {
    error: "alert-danger",
    info: "alert-information",
    success: "alert-success",
    warning: "alert-warning",
  };

  render() {
    return html`
      <section class="qgds-inpage-alert is-${this.variant}">
        <div class="icon-wrapper">
          <qgds-icon
            iconId="${QGDSInpageAlert.icons[this.variant]}"
          ></qgds-icon>
        </div>

        <div class="content-wrapper">
          <h3 class="heading qgds-display-lg">${this.heading}</h3>
          <slot></slot>
        </div>
      </section>
    `;
  }
}

export type QGDSInpageAlertProps = InstanceType<typeof QGDSInpageAlert>;
