import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { QGDSBreadcrumbsItem } from "./qgds-breadcrumbs-item";
import { ifDefined } from "lit/directives/if-defined.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-breadcrumbs.styles.scss?inline";

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
 * @property aria-label - Accessible label for the breadcrumbs navigation, defaults to "breadcrumbs"
 * @slot - The breadcrumb items, which should be implemented using {@link qgds-breadcrumbs-item}
 *
 * @cssprop {color} --bg - Override the background color of the breadcrumbs.
 * @cssprop {color} --fg - Override the text color within the breadcrumbs.
 */

@customElement("qgds-breadcrumbs")
export class QGDSBreadcrumbs extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, attribute: "aria-label" })
  label: string = "breadcrumbs";

  @state() isCollapsed: boolean = false;
  @state() private _isMenuOpen: boolean = false;

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
      child.stateExpanded = child.isDropdownItem === true ? this._isMenuOpen : false;
    });
  }

  private _closeMenu = () => {
    this._isMenuOpen = false;
    this._setExpandedChildren();
  };

  private _items: Element[] = [];

  firstUpdated() {
    this._initBreadcrumb();
  }

  private _initBreadcrumb() {
    // Set the standard breadcrumb length.
    let maxLength = 5;

    const breadcrumb = this.shadowRoot?.querySelector(".breadcrumb");

    if (!breadcrumb) {
      return;
    }
    const expandCrumb = breadcrumb.querySelector(".breadcrumb-toggle");
    if (expandCrumb) {
      // Breadcrumb has already been initialised.
      return;
    }
    const slot = this.shadowRoot?.querySelector("slot");

    this._items =
      slot?.assignedElements({
        flatten: true,
      }) ?? [];

    // Return when breadcrumb does not exist.
    if (!this._items?.length) {
      return;
    }

    const breadcrumbParent = breadcrumb.parentElement;
    if (!breadcrumbParent) {
      return;
    }

    if (breadcrumb.clientWidth >= breadcrumbParent.clientWidth) {
      maxLength = 3;
    }
    //this.breadcrumbCollapse(breadcrumbList, maxLength);
    this.isCollapsed = this._items.length > maxLength;
    if (!this.isCollapsed) {
      this._items[this._items.length - 1].setAttribute("is-last", "true");
    }
  }

  private _renderItems() {
    if (!this.isCollapsed) {
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

      <qgds-breadcrumbs-item
        class="breadcrumbs-item breadcrumb-toggle ${this._isMenuOpen ? "expanded" : ""}"
        tabindex="0"
      >
        <button
          type="button"
          class="breadcrumb-toggle-link"
          aria-label="Expand breadcrumbs"
          @click=${this._toggleExpand}
        ></button>
        <qgds-icon size="xs" icon-id="chevron-right" class="base-icon"></qgds-icon>
        <div class="breadcrumb-collapse-wrapper">
          <ol class="breadcrumb-vertical">
            ${middle.map((item) => html`${item}`)}
          </ol>
        </div>
      </qgds-breadcrumbs-item>
      ${secondLast} ${lastElement}
    `;
  }

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line -- linter fails to recognise that LitElement always contains connectedCallback
    document.addEventListener("click", this._closeMenu);
  }

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    document.removeEventListener("click", this._closeMenu);
  }

  render() {
    return html`
      <nav aria-label="${ifDefined(this.label)}">
        <ol class="breadcrumb">
          ${this._renderItems()}
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-breadcrumbs": QGDSBreadcrumbs;
  }
}
