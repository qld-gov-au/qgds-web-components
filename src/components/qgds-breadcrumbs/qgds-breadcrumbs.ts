import { LitElement, PropertyValues, html, unsafeCSS } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-breadcrumbs.styles.scss?inline";
import { scrubSlotContent } from "../../utils";

import type { QGDSBreadcrumbsItem } from "./qgds-breadcrumbs-item";
import "./qgds-breadcrumbs-item";

/**
 * Breadcrumbs show users where they are in the website hierarchy and how to navigate back or up to previous levels or content. They supports desktop, and mobile/tablet resolutions.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-98076&p=f&m=dev
 * @website https://www.designsystem.qld.gov.au/components/breadcrumbs
 *
 * @example
 * <qgds-breadcrumbs>
 *   <qgds-breadcrumbs-item href="#section1">Section 1</qgds-breadcrumbs-item>
 *   <qgds-breadcrumbs-item href="#section2">Section 2</qgds-breadcrumbs-item>
 *   <qgds-breadcrumbs-item href="#section3">Section 3</qgds-breadcrumbs-item>
 * </qgds-breadcrumbs>
 *
 * @attribute aria-label - Accessible label for the breadcrumbs navigation, defaults to "breadcrumbs"
 * @slot - The breadcrumbs items, which should be implemented using `<qgds-breadcrumbs-item>`
 *
 */

// Defined PrivateState types allow better type safety when used within lifecycle methods
// eg updated(_changeProperties: PropertyValues<this> & PropertyValues<PrivateState>) { ... }
interface PrivateState {
  _isCollapsed: boolean;
  _isMenuOpen: boolean;
}

@customElement("qgds-breadcrumbs")
export class QGDSBreadcrumbs extends LitElement {
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @state() private _isCollapsed: PrivateState["_isCollapsed"] = false;
  @state() private _isMenuOpen: PrivateState["_isMenuOpen"] = false;

  @query(".dropdown") private _dropdown!: Element | null;
  @query(".dropdown-toggle") private _dropdownToggle!: HTMLButtonElement | null;

  private _items: QGDSBreadcrumbsItem[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.role = "navigation";
    this.ariaLabel = this.ariaLabel ?? "breadcrumbs";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleClickOrFocusOutside);
    document.removeEventListener("focusin", this._handleClickOrFocusOutside);
  }

  protected override firstUpdated() {
    this._initBreadcrumb();
  }

  protected override updated(_changeProperties: PropertyValues<this> & PropertyValues<PrivateState>) {
    // focus the first menu item after menu is opened.
    if (_changeProperties.has("_isMenuOpen")) {
      if (this._isMenuOpen) {
        this._items[1].focus();
        document.addEventListener("click", this._handleClickOrFocusOutside);
        document.addEventListener("focusin", this._handleClickOrFocusOutside);
        this.shadowRoot?.addEventListener("focusin", this._handleClickOrFocusOutside);
        this.addEventListener("keydown", this._handleKeydown);
      } else {
        document.removeEventListener("click", this._handleClickOrFocusOutside);
        document.removeEventListener("focusin", this._handleClickOrFocusOutside);
        this.shadowRoot?.removeEventListener("focusin", this._handleClickOrFocusOutside);
        this.removeEventListener("keydown", this._handleKeydown);
      }
    }
  }

  // Unified click and focusin handler
  private _handleClickOrFocusOutside = (e: Event) => {
    if (!e.composedPath().includes(this._dropdown as EventTarget)) this._isMenuOpen = false;
  };

  // Handle escape key press
  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this._dropdownToggle?.focus();
      this._isMenuOpen = false;
    }
  };

  private _toggleMenu = () => {
    this._isMenuOpen = !this._isMenuOpen;
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
      (slot.assignedElements({
        flatten: true,
      }) as QGDSBreadcrumbsItem[]) ?? [];

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
      item.isDropdownItem = true;
    });

    const lastElement = this._items[this._items.length - 1];
    lastElement.isLast = true;

    return html`
      ${first}

      <qgds-breadcrumbs-item class="dropdown ${this._isMenuOpen ? "expanded" : ""}">
        <button
          type="button"
          class="dropdown-toggle"
          aria-label="Expand breadcrumbs"
          aria-controls="breadcrumbs-dropdown"
          aria-expanded=${this._isMenuOpen}
          @click=${this._toggleMenu}
        >
          <qgds-icon aria-label="more-horizontal" icon-id="more-horizontal" size="lg"></qgds-icon>
        </button>
        <qgds-icon aria-hidden="true" size="xs" icon-id="chevron-right" class="chevron-icon"></qgds-icon>
        <div class="dropdown-menu-wrapper" id="breadcrumbs-dropdown">
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
