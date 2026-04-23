import { LitElement, html, unsafeCSS } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { QgdsEvents } from "../../utils/events/event-controller";
import "../qgds-icon/qgds-icon";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-accordion.styles.scss?inline";

export const tagName = "qgds-accordion";

/**
 * QGDS Accordion Component
 *
 * @website "https://www.designsystem.qld.gov.au/components/accordion"
 * @uikit "https://www.figma.com/design/9Ig3HLZtRs5qACKFivPFW6/deleteme?node-id=5990-98109"
 * @tagname "qgds-accordion"
 *
 * @prop {string} title - The title displayed in the accordion summary.
 * @prop {boolean} isOpen - Reflects the open state of the accordion. Can be used to programmatically control the accordion.
 * @prop {string} id - if the window.location.hash equals this id, the accordion will be set to to open.
 *
 * @slot default - The content to be revealed when the accordion is expanded. Can include any HTML elements.
 *
 * @event qgds-toggle - Emitted when the accordion is toggled open or closed.
 *
 */
@customElement(tagName)
export class QGDSAccordion extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String }) title = "";
  @property({ type: Boolean, attribute: "is-open", reflect: true }) isOpen = false;

  private events: QgdsEvents;
  private _preventFirstToggleEvent = false; // set to false on firstUpdated()
  private _detailsRef = createRef<HTMLDetailsElement>();

  constructor() {
    super();
    // console.log("constructor");
    this.events = new QgdsEvents(this);
  }

  connectedCallback(): void {
    super.connectedCallback(); // eslint-disable-line

    // fix a bug where toggle event will fire once early when is-open attribute is set to true.
    if (!this.hasUpdated && this.isOpen === true) {
      this._preventFirstToggleEvent = true; // set to false in _handleToggle
    }

    // check the hash and set isOpen to true, also set up hashchange listener
    this._handleHash();
    window.addEventListener("hashchange", this._handleHash);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback(); // eslint-disable-line

    window.removeEventListener("hashchange", this._handleHash);
  }

  private _handleHash = () => {
    if (window.location.hash === `#${this.id}`) {
      this.isOpen = true;
    }
  };

  private _handleToggle = (e: ToggleEvent): void => {
    // prevent firing on first update, if isOpen is true
    if (this._preventFirstToggleEvent) {
      this._preventFirstToggleEvent = false;
      return;
    }

    this.isOpen = e.newState === "open";
    this.events.dispatch("toggle", { isOpen: this.isOpen }, e);
  };

  render() {
    return html`
      <details
        ${ref(this._detailsRef)}
        class=${classMap({
          "qgds-accordion": true,
        })}
        ?open=${this.isOpen}
        @toggle=${this._handleToggle}
      >
        <summary class="summary">
          <span class="summary-text">${this.title}</span
          ><qgds-icon class="summary-icon" icon-id="chevron-up" size="md"></qgds-icon>
        </summary>
        <div class="content">
          <slot></slot>
        </div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSAccordion;
  }
}
