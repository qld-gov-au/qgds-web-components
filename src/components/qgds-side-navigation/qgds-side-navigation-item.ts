import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { resetStyles } from "../../styles";
import componentCSS from "./qgds-side-navigation.styles.scss?inline";
import { validateSlotContent } from "../../utils";

export const tagname = "qgds-side-navigation-item";
/**
 * Only for use as a child of QGDSSideNavigation, or another QGDSSideNavigationItem.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=11056-321787
 * @website https://www.designsystem.qld.gov.au/components/side-navigation
 * @tagname "qgds-side-navigation-item"
 *
 * @property {string} [href] The item's target url. If left blank, will render as a span without interactive states
 * @property {string} [label=""] The item's visible label
 * @property {boolean} [isActive=false] Used to mark the current or active navigation item.
 * @property {number} [level=1] The level in list heirarchy. This property is controlled by the element's parent, and shouldn't be changed.
 * @property {boolean} [isFirst=false] Used to track if the element is first item in the list. This property is controlled by the element's parent, and shouldn't be changed.
 *
 * @slot default - any number of QGDSSideNavigationItems, nested up to 3 deep.
 */
@customElement(tagname)
export class QGDSSideNavigationItem extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({ type: String }) href?: string;
  @property({ type: String, reflect: true }) label = "";
  @property({ type: Boolean, attribute: "is-active" }) isActive = false;
  @property({ type: Number, attribute: false }) level = 1;
  @property({ type: Boolean, attribute: false }) isFirst = false;
  @state() private _hasItems = false;
  private get _isHeading() {
    return this.getAttribute("slot") === "heading";
  }

  connectedCallback(): void {
    super.connectedCallback?.();
    if (!this._isHeading) this.role = "listitem";
  }

  private _handleSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    // Convert a textNode to the label
    const nodes = slot.assignedNodes();
    for (const node of nodes) {
      if (node.nodeType === 3 && node.nodeValue?.trim()) {
        this.label = node.nodeValue.trim();
        break;
      } else if (node.nodeName === "QGDS-SIDE-NAVIGATION-ITEM") {
        (node as QGDSSideNavigationItem).level = this.level + 1;
        this._hasItems = true;
      }
    }
    // then only allow qgds-side-navigation-items
    validateSlotContent(slot, "QGDS-SIDE-NAVIGATION-ITEM");
  };

  private _renderChildren = () => {
    return this._hasItems
      ? html`<div class="qgds-side-navigation-list" role="list">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>`
      : html`<slot @slotchange=${this._handleSlotChange}></slot>`; // the slot should remain to listen to updates even if empty
  };

  render() {
    const classes = classMap({
      "qgds-side-navigation-item": true,
      "is-heading": this._isHeading,
      "is-active": this.isActive,
      "is-first-item": this.isFirst,
      "is-level-1": this.level === 1 && !this._isHeading,
      "is-level-2": this.level === 2,
      "is-level-3": this.level === 3,
    });
    return html`${this.href && !this.isActive
      ? html`<a class="${classes}" href="${this.href}">${this.label}</a>`
      : html`<span class="${classes}">${this.label}</span>`}
    ${!this._isHeading ? this._renderChildren() : nothing}`;
  }
}

//
declare global {
  interface HTMLElementTagNameMap {
    [tagname]: QGDSSideNavigationItem;
  }
}
