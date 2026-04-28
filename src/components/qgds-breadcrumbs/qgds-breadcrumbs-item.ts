import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { baseStyles } from "../../styles";
import "../qgds-icon/qgds-icon.js";
import componentCSS from "./qgds-breadcrumbs-item.styles.scss?inline";

/** QGDS Breadcrumb Item Web Component
 * Used as a child element within {@link qgds-breadcrumbs} to define individual breadcrumb items.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-98076&p=f&m=dev
 * @website https://www.designsystem.qld.gov.au/components/breadcrumbs
 *
 * @example
 * <qgds-breadcrumbs-item target="_blank" rel="bookmark" url="#section1">Section 1</qgds-breadcrumbs-item>
 * <qgds-breadcrumbs-item target="_blank" rel="bookmark" url="#section2">Section 2</qgds-breadcrumbs-item>
 * <qgds-breadcrumbs-item target="_blank" rel="bookmark" url="#section3">Section 3</qgds-breadcrumbs-item>
 *
 * @property url - The target URL or anchor for the breadcrumb item
 * @property rel - The relationship of the linked resource to the current document
 * @property target - Specifies whether to open the link in same tab or new tab
 * @property inside-vertical - Specifies whether the breadcrumb item is inside the vertical dropdown
 * @property is-last - Specifies whether the breadcrumb item is the last item in the sequence
 *
 */

export type QGDSBreadcrumbsItemProps = InstanceType<typeof QGDSBreadcrumbsItem>;

@customElement("qgds-breadcrumbs-item")
export class QGDSBreadcrumbsItem extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  // This ensures the custom element tag (:host) acts like an <li> in the A11y tree
  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line -- linter fails to recognise that LitElement always contains connectedCallback
    this.setAttribute("role", "listitem");
  }

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, attribute: "url" })
  url: string = "";

  @property({ type: String, attribute: "rel" })
  rel: string = "";

  @property({ type: String, attribute: "target" })
  target: string = "";

  @property({ type: Boolean, attribute: "inside-vertical", reflect: true })
  insideVertical: boolean = false;

  // controlled by parent
  @property({ type: Boolean, attribute: "is-last", reflect: true })
  isLast: boolean = false;

  @property({ type: Boolean, attribute: "state-expanded", reflect: true })
  stateExpanded = false;

  updated(changed: Map<string, unknown>) {
    if (changed.has("stateExpanded") || changed.has("insideVertical")) {
      this.tabIndex = this.insideVertical === true ? (this.stateExpanded ? 0 : -1) : 0;
    }
  }

  render() {
    return html`
      <div class="breadcrumbs-item ${this.isLast ? "active" : ""}" aria-current=${this.isLast ? "page" : nothing}>
        ${this.isLast || !this.url
          ? html`<slot></slot>`
          : html`
              <a
                class=${this.insideVertical === true ? "inside-vertical" : nothing}
                href=${this.url}
                rel=${ifDefined(this.rel)}
                target=${ifDefined(this.target)}
              >
                <slot></slot>
              </a>
              ${this.insideVertical === false
                ? html`<qgds-icon size="xs" icon-id="chevron-right" class="base-icon"></qgds-icon>`
                : nothing}
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-breadcrumbs-item": QGDSBreadcrumbsItem;
  }
}
