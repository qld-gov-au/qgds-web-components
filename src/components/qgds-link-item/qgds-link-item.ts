import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import componentCSS from "./qgds-link-item.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link/qgds-link.js";
import "../qgds-icon/qgds-icon.js";

/**
 * A single navigable item within a `<qgds-link-column>`. Renders a styled link with optional
 * description and support for nested items.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - The visible link label text.
 * @property {string} [href] - The destination URL.
 * @property {string} [icon-name] - Icon identifier (e.g. "arrow-right"). Auto-set to "arrow-right" inside `<qgds-link-column>`.
 * @property {string} [icon-size] - Size of the icon ("sm", "md", "lg", "xl").
 * @property {string} [animation] - Icon animation variant. Auto-set to "leftToRight" inside `<qgds-link-column>`.
 * @property {string} [description] - Optional supporting text shown below the link.
 * @property {boolean} [disabled] - When true, disables the link.
 *
 * @slot - Accepts nested `<qgds-link-item>` elements for a sub-list. Non-`qgds-link-item` elements are removed.
 *
 * @cssprop {length} --qgds-link-item-padding-top - Override the block-start padding (default 0.75rem).
 * @cssprop {length} --qgds-link-padding - Override the link block-end padding.
 * @cssprop {length|string} --qgds-link-margin-inline-start - Override the inline-start margin.
 * @cssprop {length|string} --qgds-link-width - Override the link width.
 * @cssprop {color} --qgds-link-border-end-colour - Override the separator border colour.
 * @cssprop {length} --qgds-link-border-end-width - Override the separator border width.
 * @cssprop {string} --qgds-link-border-end-style - Override the separator border style.
 *
 * @example
 * ```html
 * <qgds-link-item label="Planning and development" href="/planning" description="Apply for permits and approvals"></qgds-link-item>
 * ```
 */
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
  @property({ type: String, attribute: "icon-name" }) iconName: "" | "arrow-right" = "";
  @property({ type: String, attribute: "icon-size" }) iconSize: "" | "sm" | "md" = "";
  @property({ type: String }) animation:
    | ""
    | "leftToRight"
    | "rightToLeft"
    | "topToBottom"
    | "bottomToTop"
    | "scaleIn"
    | "scaleOut" = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean }) disabled = false;

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
        .iconName=${ifDefined(this.iconName || undefined)}
        .iconSize=${ifDefined(this.iconName ? this.iconSize : undefined)}
        .animation=${ifDefined(this.iconName ? this.animation : undefined)}
        .disabled=${this.disabled}
        .stretch=${!!this.iconName}
        .trailingIcon=${!!this.iconName}
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
