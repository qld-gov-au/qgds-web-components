import { LitElement, PropertyValues, html, unsafeCSS } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
// import { ifDefined } from "lit/directives/if-defined.js";

import { QgdsEvents } from "../../utils/events/event-controller";

import "../qgds-icon/qgds-icon";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-accordion.styles.scss?inline";

export const tagName = "qgds-accordion";

/**
 * QGDS Accordion Component
 *
 * @tagname "qgds-accordion"
 *
 * @prop {string} title - The title displayed in the accordion summary.
 * @prop {boolean} isOpen - Reflects the open state of the accordion. Can be used to programmatically control the accordion.
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

  // TODO: connectedCallback() and disconnectedCallback() to manage the URL hash check.
  connectedCallback(): void {
    super.connectedCallback(); // eslint-disable-line
    if (!this.hasUpdated && this.isOpen === true) {
      this._preventFirstToggleEvent = true; // set to false in _handleToggle
    }
  }

  shouldUpdate(_changedProperties: PropertyValues): boolean {
    // Because <details> is itself managing its own open state, and toggle event will update this.isOpen,
    // we should cancel the update if props and detailsref state match.
    if (
      _changedProperties.size === 1 &&
      _changedProperties.has("isOpen") &&
      this.isOpen === this._detailsRef.value?.open
    ) {
      return false;
    }
    return true;
  }

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
        <summary>
          <span class="title">${this.title}</span><qgds-icon icon-id="chevron-up" size="md"></qgds-icon>
        </summary>
        <slot></slot>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSAccordion;
  }
}
