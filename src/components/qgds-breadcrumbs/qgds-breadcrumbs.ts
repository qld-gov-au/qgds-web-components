import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { QGDSBreadcrumbsItem } from "./qgds-breadcrumbs-item";
import { ifDefined } from "lit/directives/if-defined.js";
import { baseStyles } from "../../styles";
import componentCSS from "./qgds-breadcrumbs.styles.scss?inline";

export type QGDSBreadcrumbsProps = InstanceType<typeof QGDSBreadcrumbs>;

/**
 * Used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-98076&p=f&m=dev
 *
 * @example
 * <qgds-breadcrumbs>
 *   <qgds-breadcrumbs-item target="_blank" rel="bookmark" href="#section1">Section 1</qgds-breadcrumbs-item>
 *   <qgds-breadcrumbs-item target="_blank" rel="bookmark" href="#section2">Section 2</qgds-breadcrumbs-item>
 *   <qgds-breadcrumbs-item target="_blank" rel="bookmark" href="#section3">Section 3</qgds-breadcrumbs-item>
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
  @property({ type: String, attribute: "aria-label" })
  label: string = "breadcrumbs";

  @property({ type: Boolean }) private collapsedOnLoad = false;
  @property({ type: Boolean }) private expanded = false;

  private _toggleExpand = async (ev: Event) => {
    ev.stopPropagation();
    this.expanded = !this.expanded;

    await this.updateComplete;

    const targetItem = this.items[1] as QGDSBreadcrumbsItem;
    await targetItem?.updateComplete;
    if (this.expanded) {
      targetItem.focus();
    }
    if (this.expanded) {
      document.addEventListener("click", this.closeMenu, { once: true });
    } else {
      document.removeEventListener("click", this.closeMenu);
    }
  };

  private closeMenu = () => {
    this.expanded = this.expanded && false;
  };

  private items: Element[] = [];

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  firstUpdated() {
    this.initBreadcrumb();
  }

  private initBreadcrumb() {
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

    this.items =
      slot?.assignedElements({
        flatten: true,
      }) ?? [];

    // Return when breadcrumb does not exist.
    if (!this.items?.length) {
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
    this.collapsedOnLoad = this.items.length > maxLength;
    if (!this.collapsedOnLoad) {
      this.items[this.items.length - 1].setAttribute("is-last", "true");
    }
  }

  private _renderItems() {
    if (!this.collapsedOnLoad) {
      return html`<slot></slot>`;
    }

    // collapsed state
    const first = this.items[0];
    //const last = this.items[this.items.length - 1];
    const secondLast = this.items[this.items.length - 2];
    const middle = this.items.slice(1, -2);
    middle.forEach((item) => {
      item.setAttribute("inside-vertical", "true");
    });

    const lastElement: QGDSBreadcrumbsItem = this.items[this.items.length - 1] as QGDSBreadcrumbsItem;
    lastElement.isLast = true;

    return html`
      ${first}

      <qgds-breadcrumbs-item class="breadcrumb-item breadcrumb-toggle ${this.expanded ? "expanded" : ""}" tabindex="0">
        <button class="breadcrumb-toggle-link" aria-label="Expand breadcrumbs" @click=${this._toggleExpand}></button>
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

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    document.removeEventListener("click", this.closeMenu);
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
