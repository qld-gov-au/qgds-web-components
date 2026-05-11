import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import breakpoint from "../../styles/qgds-tokens/qgds-breakpoint";
import { debounce, validateSlotContent } from "../../utils";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-side-navigation.styles.scss?inline";
import "../qgds-accordion/qgds-accordion";
import { ifDefined } from "lit/directives/if-defined.js";
import { type QGDSSideNavigationItem } from "./qgds-side-navigation-item";

export const tagname = "qgds-side-navigation";
/**
 * The side navigation allows users to find other pages which share a similar topic or section.
 * By default it supports three levels of nesting along with an accompanying heading.
 * On mobile and smaller viewports (below 992px), the side navigation is wrapped in a
 * QGDSAccordion component to collapse down to an expandable element.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=11056-321787
 * @website https://www.designsystem.qld.gov.au/components/side-navigation
 * @tagname "qgds-side-navigation"
 *
 * @property {string} [mobileHeading="In this section"] - The accordion heading, only used in mobile view.
 *
 * @slot heading - One qgds-side-navigation-item to represent the heading. Should link to the relevant page.
 * @slot - any number of QGDSLinkItems, nested up to 3 deep.
 */

@customElement(tagname)
export class QGDSSideNavigation extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
    `,
    unsafeCSS(componentCSS),
  ];
  @property({ type: String, attribute: "mobile-heading" }) mobileHeading?: string = "In this section";

  @state() private _isMobileView = false;

  connectedCallback(): void {
    super.connectedCallback?.();
    this.role = this.role ?? "navigation";
    this._isMobileView = window.innerWidth < breakpoint.MD;
    window.addEventListener("resize", this._handleResize);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    window.removeEventListener("resize", this._handleResize);
  }

  // debounce prevents spamming updates.
  private _handleResize = debounce(() => {
    this._isMobileView = window.innerWidth < breakpoint.MD;
  }, 100);

  private _handleSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    switch (slot.name) {
      case "heading":
        validateSlotContent(slot, { "qgds-side-navigation-item": 1 });
        break;
      default: {
        const isValid = validateSlotContent(slot, "qgds-side-navigation-item");
        if (isValid) {
          const items = slot.assignedElements() as QGDSSideNavigationItem[];
          if (items.length) items[0].isFirst = true;
        }
      }
    }
  };

  private _renderSideNav = () => html`
    <h2 class="qgds-display-sm"><slot name="heading" @slotchange=${this._handleSlotChange}></slot></h2>

    <div role="list" class="qgds-side-navigation-list">
      <slot @slotchange=${this._handleSlotChange}></slot>
    </div>
  `;

  render() {
    return this._isMobileView
      ? html`<qgds-accordion title="${ifDefined(this.mobileHeading)}">${this._renderSideNav()}</qgds-accordion>`
      : this._renderSideNav();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagname]: QGDSSideNavigation;
  }
}
