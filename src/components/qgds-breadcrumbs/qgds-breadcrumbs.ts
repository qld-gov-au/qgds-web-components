import { LitElement, html, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { QGDSBreadcrumbsItem } from "./qgds-breadcrumbs-item";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-breadcrumbs.styles.scss?inline";
import { scrubSlotContent } from "../../utils";

export type QGDSBreadcrumbsProps = InstanceType<typeof QGDSBreadcrumbs>;

/**
 * Breadcrumbs show users where they are in the website hierarchy and how to navigate back or up to previous levels or content. They supports desktop, and mobile/tablet resolutions.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-98076&p=f&m=dev
 * @website https://www.designsystem.qld.gov.au/components/breadcrumbs
 *
 * @example
 * <qgds-breadcrumbs>
 *   <qgds-breadcrumbs-item target="_blank" rel="bookmark" url="#section1">Section 1</qgds-breadcrumbs-item>
 *   <qgds-breadcrumbs-item target="_blank" rel="bookmark" url="#section2">Section 2</qgds-breadcrumbs-item>
 *   <qgds-breadcrumbs-item target="_blank" rel="bookmark" url="#section3">Section 3</qgds-breadcrumbs-item>
 * </qgds-breadcrumbs>
 *
 * @attribute aria-label - Accessible label for the breadcrumbs navigation, defaults to "breadcrumbs"
 * @slot - The breadcrumbs items, which should be implemented using {@link qgds-breadcrumbs-item}
 *
 */

@customElement("qgds-breadcrumbs")
export class QGDSBreadcrumbs extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @state() private _isCollapsed: boolean = false;
  @state() private _isMenuOpen: boolean = false;

  private _items: Element[] = [];

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line -- linter fails to recognise that LitElement always contains connectedCallback
    this.role = "navigation";
    this.ariaLabel = this.ariaLabel ?? "breadcrumbs";
    document.addEventListener("click", this._closeMenu);
  }

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    document.removeEventListener("click", this._closeMenu);
  }

  firstUpdated() {
    this._initBreadcrumb();
  }

  private _toggleExpand = async (ev: Event) => {
    ev.stopPropagation();
    this._isMenuOpen = !this._isMenuOpen;

    await this.updateComplete;

    this._setExpandedChildren();

    const targetItem = this._items[1] as QGDSBreadcrumbsItem;
    await targetItem?.updateComplete;
    if (this._isMenuOpen) {
      targetItem.focus();
    } else {
      document.removeEventListener("click", this._closeMenu);
    }
  };

  private _setExpandedChildren() {
    this._items.forEach((item) => {
      const child = item as QGDSBreadcrumbsItem;
      child.isExpanded = child.isDropdownItem === true ? this._isMenuOpen : false;
    });
  }

  private _closeMenu = () => {
    this._isMenuOpen = false;
    this._setExpandedChildren();
  };

  private _initBreadcrumb() {
    // Set the standard breadcrumbs length.
    let maxLength = 5;

    const breadcrumbs = this.shadowRoot?.querySelector(".breadcrumbs");

    if (!breadcrumbs) {
      return;
    }
    const expandCrumb = breadcrumbs.querySelector(".breadcrumbs-toggle");
    if (expandCrumb) {
      // Breadcrumb has already been initialised.
      return;
    }
    const slot = this.shadowRoot?.querySelector("slot");
    if (!(slot instanceof HTMLSlotElement)) {
      return;
    }

    scrubSlotContent(slot, "qgds-breadcrumbs-item");

    this._items =
      slot.assignedElements({
        flatten: true,
      }) ?? [];

    // Return when breadcrumbs does not exist.
    if (!this._items?.length) {
      return;
    }

    if (breadcrumbs.clientWidth >= this.clientWidth) {
      maxLength = 3;
    }

    this._isCollapsed = this._items.length > maxLength;
    if (!this._isCollapsed) {
      this._items[this._items.length - 1].setAttribute("is-last", "true");
    }
  }

  private _renderItems() {
    if (!this._isCollapsed) {
      return html`<slot></slot>`;
    }

    // collapsed state
    const first = this._items[0];
    const secondLast = this._items[this._items.length - 2];
    const middle = this._items.slice(1, -2);
    middle.forEach((item) => {
      (item as QGDSBreadcrumbsItem).isDropdownItem = true;
    });

    const lastElement: QGDSBreadcrumbsItem = this._items[this._items.length - 1] as QGDSBreadcrumbsItem;
    lastElement.isLast = true;

    return html`
      ${first}

      <qgds-breadcrumbs-item class="dropdown ${this._isMenuOpen ? "expanded" : ""}" tabindex="0">
        <button type="button" class="dropdown-toggle" aria-label="Expand breadcrumbs" @click=${this._toggleExpand}>
          <qgds-icon aria-label="Home icon" icon-id="more-horizontal" size="lg"></qgds-icon>
        </button>
        <qgds-icon aria-hidden="true" size="xs" icon-id="chevron-right" class="chevron-icon"></qgds-icon>
        <div class="dropdown-menu-wrapper">
          <ol class="dropdown-menu">
            ${middle.map((item) => html`${item}`)}
          </ol>
        </div>
      </qgds-breadcrumbs-item>
      ${secondLast} ${lastElement}
    `;
  }

  render() {
    return html`
      <ol class="breadcrumbs">
        ${this._renderItems()}
      </ol>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-breadcrumbs": QGDSBreadcrumbs;
  }
}
