import { LitElement, html, unsafeCSS, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { resetStyles } from "../../styles";
import componentCSS from "./qgds-side-navigation.styles.scss?inline";
// import { ifDefined } from "lit/directives/if-defined.js";
// import { validateSlotContent } from "../../utils";

export const tagname = "qgds-side-navigation-item";
/**
 * Only for use as a child of QGDSSideNavigation, or another QGDSSideNavigationItem.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=11056-321787
 * @website https://www.designsystem.qld.gov.au/components/side-navigation
 * @tagname "qgds-side-navigation-item"
 *
 * @property {string} [href] The item's target url
 * @property {string} [label=""] The item's visible label
 * @property {number} [level=1] The level in list heirarchy.
 *
 * @slot default - any number of QGDSSideNavigationItems, nested up to 3 deep.
 */
@customElement(tagname)
export class QGDSSideNavigationItem extends LitElement {
  static styles = [
    resetStyles,
    css`
      :host {
        display: block;
      }
    `,
    unsafeCSS(componentCSS),
  ];

  @property({ type: String }) href?: string;
  @property({ type: String }) label = "";
  @property({ type: Number, attribute: false }) level = 1;
  @state() private _hasItems = false;

  connectedCallback(): void {
    super.connectedCallback?.();
    this.role = "listitem";
  }

  private _handleSlotChange = (e: Event): void => {
    // console.log("slotchanged");

    const slot = e.target as HTMLSlotElement;
    // a textNode should be assumed as label
    const nodes = slot.assignedNodes();
    // for (const node of nodes) {
    //   if (node.nodeType === 3 && node.nodeValue?.trim()) {
    //     this.label = node.nodeValue.trim();
    //     break;
    //   }
    // }
    // then only allow qgds-side-navigation-items
    // validateSlotContent(slot, "QGDS-NAVIGATION-ITEM");
    // update reactive state
    this._hasItems = nodes.some((node) => node.nodeName === "QGDS-NAVIGATION-ITEM");
  };

  private _renderChildren = () => {
    return this._hasItems
      ? html`<div role="list"><slot @slotchange=${this._handleSlotChange}></slot></div>`
      : html`<slot @slotchange=${this._handleSlotChange}></slot>`; // the slot should remain to listen to updates even if empty
  };

  render() {
    return this.href
      ? html`<a href="${this.href}">${this.label}</a>${this._renderChildren()}`
      : html`<span>${this.label}${this._renderChildren()}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagname]: QGDSSideNavigationItem;
  }
}
