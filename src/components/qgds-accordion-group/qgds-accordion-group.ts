import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state, queryAssignedElements } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../qgds-icon/qgds-icon";
import { resetStyles } from "../../styles";
import componentCSS from "./qgds-accordion-group.styles.scss?inline";
import { QGDSAccordion } from "../qgds-accordion/qgds-accordion";

export const tagName = "qgds-accordion-group";

/**
 * QGDS Accordion Group Component
 *
 * @website "https://www.designsystem.qld.gov.au/components/accordion"
 * @uikit "https://www.figma.com/design/9Ig3HLZtRs5qACKFivPFW6/deleteme?node-id=5990-98109"
 * @tagname "qgds-accordion-group"
 *
 * @prop {true | false | "auto"} [showControls = "auto"] - Show "Open all" / "Close all" controls. If auto, will display if 3 or more items.
 *
 * @slot default - Any number of `qgds-accordion`s.
 *
 */
@customElement(tagName)
export class QGDSAccordionGroup extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({
    // Type is declared as String/Any to handle mixed types
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === "auto") return "auto";
        if (value === null) return false;
        // Standard HTML boolean: empty string or "true" string counts as true
        return value === "" || value === "true";
      },
      toAttribute: (value: boolean | "auto") => {
        if (value === "auto") return "auto";
        return value ? "" : null; // Removes attribute if false, adds empty if true
      },
    },
    attribute: "show-controls",
  })
  showControls?: boolean | "auto" = "auto";

  @state() private _openAllLabel: "Open all" | "Close all" = "Open all";

  // Used to calculate private _showControls, set in connectedCallback();
  private _numAccordions: number = 0;

  // Private version of showControls is a derived boolean, where "auto" must take into account number of accordions.
  private get _showControls() {
    return typeof this.showControls === "boolean" ? this.showControls : this._numAccordions > 2;
  }

  @queryAssignedElements({ selector: "qgds-accordion" })
  private _accordions!: QGDSAccordion[]; // Will be assigned at run time.

  connectedCallback(): void {
    super.connectedCallback(); // eslint-disable-line

    // Here we can count the number of accordions before first render, but must use DOM method because they have not yet been assigned to the shadow DOM's slot.
    this._numAccordions = this.querySelectorAll("qgds-accordion").length;
  }

  // Validate the slot content
  private _handleSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    nodes.forEach((node) => {
      if (node.nodeName !== "QGDS-ACCORDION") {
        node.parentNode?.removeChild(node);
      }
    });
  };

  private _handleToggle = (_e: CustomEvent): void => {
    // check states of accordions and update global controls if necessary.
    if (!this._showControls) return;
    if (this._accordions.every((accordion) => accordion.isOpen)) {
      this._openAllLabel = "Close all";
    } else {
      this._openAllLabel = "Open all";
    }
  };

  private _openOrCloseAll = (): void => {
    this._accordions.forEach((accordion) => {
      // determine the mode - open or close all?
      accordion.isOpen = this._openAllLabel === "Open all";
    });
  };

  render() {
    return html`<div class="qgds-accordion-group" @qgds-toggle=${this._handleToggle}>
      ${this._showControls
        ? html`<button
            class="${classMap({ controls: true, "is-close-all": this._openAllLabel === "Close all" })}"
            @click=${this._openOrCloseAll}
          >
            ${this._openAllLabel}
            <qgds-icon class="controls-icon" icon-id="chevron-down" size="xs" aria-hidden="true"></qgds-icon>
          </button>`
        : nothing}
      <div class="accordions">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSAccordionGroup;
  }
}
