import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import componentCSS from "./qgds-link-item.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link/qgds-link.js";
import "../qgds-icon/qgds-icon.js";

@customElement("qgds-link-item")
export class QgdsLinkItem extends LitElement {
  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String }) label = "";
  @property({ type: String }) href = "";
  @property({ type: String, attribute: "icon-name" }) iconName = "";
  @property({ type: String, attribute: "icon-size" }) iconSize: "" | "sm" | "md" | "lg" | "xl" = "";
  @property({ type: String }) animation = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, attribute: "view-all" }) viewAll = false;
  @property({ type: Boolean, attribute: "only-icon" }) onlyIcon = false;
  @property({ type: Boolean }) stretch = false;
  @property({ type: Boolean, attribute: "trailing-icon" }) trailingIcon = true;

  @state() private _hasNestedItems = false;

  private _onSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot
      .assignedElements({ flatten: true })
      .filter((el) => el.tagName.toLowerCase() === "qgds-link-item");
    // Remove any non-qgds-link-item elements that were slotted
    slot.assignedElements({ flatten: true }).forEach((el) => {
      if (el.tagName.toLowerCase() !== "qgds-link-item") {
        el.remove();
      }
    });
    this._hasNestedItems = assigned.length > 0;
  };

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("description")) {
      if (this.description) {
        this.setAttribute("description", this.description);
      } else {
        this.removeAttribute("description");
      }
    }
  }

  connectedCallback() {
    super.connectedCallback?.();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "listitem");
    }
    if (this.closest("qgds-link-column")) {
      if (!this.iconName) {
        this.iconName = "arrow-right";
      }
      if (!this.animation) {
        this.animation = "leftToRight";
      }
    }
  }

  render() {
    return html`
      <qgds-link
        .label=${this.label}
        .href=${this.href}
        .iconName=${this.iconName}
        .iconSize=${this.iconSize}
        .animation=${this.animation}
        .disabled=${this.disabled}
        ?only-icon=${this.onlyIcon}
        ?stretch=${ifDefined(this.stretch || undefined)}
        ?trailing-icon=${ifDefined(this.trailingIcon || undefined)}
      ></qgds-link>
      ${this.description ? html`<p class="description">${this.description}</p>` : ""}
      ${this._hasNestedItems
        ? html`<div role="list">
            <slot @slotchange=${this._onSlotChange}></slot>
          </div>`
        : html`<slot @slotchange=${this._onSlotChange}></slot>`}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-link-item": QgdsLinkItem;
  }
}
