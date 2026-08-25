import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { baseStyles } from "../../styles";
import "../qgds-icon/qgds-icon.js";
import componentCSS from "./qgds-breadcrumbs-item.styles.scss?inline";
import { classMap } from "lit/directives/class-map.js";

/** QGDS Breadcrumb Item Web Component
 * Used as a child element within {@link qgds-breadcrumbs} to define individual breadcrumb items.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-98076&p=f&m=dev
 * @website https://www.designsystem.qld.gov.au/components/breadcrumbs
 *
 * @example
 * <qgds-breadcrumbs-item href="#section1">Section 1</qgds-breadcrumbs-item>
 *
 * @property href - The target URL or anchor for the breadcrumb item
 * @property rel - The relationship of the linked resource to the current document
 * @property target - Specifies whether to open the link in same tab or new tab
 * @property isDropdownItem - Specifies whether the breadcrumb item is inside the vertical dropdown
 * @property isLast - Specifies whether the breadcrumb item is the last item in the sequence
 *
 */

export type QGDSBreadcrumbsItemProps = InstanceType<typeof QGDSBreadcrumbsItem>;

@customElement("qgds-breadcrumbs-item")
export class QGDSBreadcrumbsItem extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String })
  href: string = "";

  @property({ type: String })
  rel?: string;

  @property({ type: String })
  target?: string;

  @property({ type: Boolean, attribute: false })
  isDropdownItem: boolean = false;

  // controlled by parent
  @property({ type: Boolean, attribute: "is-last", reflect: true })
  isLast: boolean = false;

  @property({ type: Boolean, attribute: false })
  isExpanded = false;

  // This ensures the custom element tag (:host) acts like an <li> in the A11y tree
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "listitem");
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("isExpanded") || changed.has("isDropdownItem")) {
      this.tabIndex = this.isDropdownItem === true ? (this.isExpanded ? 0 : -1) : 0;
    }
  }

  render() {
    const ariaCurrent = this.isLast ? "page" : undefined;
    return html`
      <div
        class="${classMap({ "breadcrumbs-item": true, active: this.isLast })}"
        aria-current=${ifDefined(ariaCurrent)}
      >
        ${this.isLast || !this.href
          ? html`<slot></slot>`
          : html`
              <a
                class=${classMap({
                  "dropdown-item": this.isDropdownItem,
                })}
                href=${this.href}
                rel=${ifDefined(this.rel)}
                target=${ifDefined(this.target)}
              >
                <slot></slot>
              </a>
              ${this.isDropdownItem === false
                ? html`<qgds-icon
                    aria-hidden="true"
                    size="xs"
                    icon-id="chevron-right"
                    class="chevron-icon"
                  ></qgds-icon>`
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
