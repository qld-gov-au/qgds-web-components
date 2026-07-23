import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import componentCSS from "./qgds-link-item.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link/qgds-link.js";
import type { Animation } from "../qgds-link/qgds-link.js";
import type { IconSize } from "../qgds-icon/qgds-icon.js";
import "../qgds-icon/qgds-icon.js";
import { LinkColumnDirection } from "../qgds-link-column/qgds-link-column";
import { NavigationVariant } from "../qgds-navigation/qgds-navigation";

/**
 * A single navigable item.
 *
 * **Standard mode** (default): used inside `<qgds-link-column>` or `<qgds-side-navigation>` as
 * a styled link row with optional description and nested items.
 *
 * **Nav mode** (`is-nav-item`): used inside `<qgds-navigation>` as a top-level nav bar entry.
 * Automatically activated by `<qgds-navigation>` — do not set manually.
 * Optionally accepts a single `<qgds-link-column>` as a dropdown mega-menu.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - The visible link label text.
 * @property {string} [href] - The destination URL.
 * @property {string} [icon-name] - Icon identifier. Auto-set to "arrow-right" inside `<qgds-link-column>`.
 * @property {string} [icon-size] - Size of the icon ("sm", "md", "lg", "xl").
 * @property {string} [animation] - Icon animation variant.
 * @property {string} [description] - Optional supporting text shown below the link (standard mode only).
 * @property {boolean} [is-disabled] - When true, disables the link.
 * @property {boolean} [only-icon] - When true, the label is visually hidden (screen-reader only).
 * @property {boolean} [is-current] - Marks this item as the current page.
 * @property {boolean} [is-nav-item] - Enables navigation bar behaviour. Set automatically by `<qgds-navigation>`.
 *
 * @slot - Standard mode: nested `<qgds-link-item>` elements. Nav mode: a single `<qgds-link-column>`.
 *
 * @cssprop {length} --qgds-link-item-padding-top - Override block-start padding (default 0.75rem).
 *
 * @example
 * ```html
 * <qgds-link-item label="Planning and development" href="/planning" description="Apply for permits and approvals"></qgds-link-item>
 * ```
 */
@customElement("qgds-link-item")
export class QGDSLinkItem extends LitElement {
  static styles = [resetStyles, unsafeCSS(componentCSS)];

  @property({ type: String }) label = "";
  @property({ type: String }) href = "";
  @property({ type: String, attribute: "icon-name" }) iconName: "" | "arrow-right" = "";
  @property({ type: String, attribute: "icon-size" }) iconSize: IconSize | "" = "md";
  @property({ type: String }) animation: Animation = "";
  @property({ type: String }) description?: string = "";
  @property({ type: Boolean, attribute: "is-disabled" }) isDisabled = false;
  @property({ type: Boolean, attribute: "only-icon", reflect: true }) onlyIcon = false;
  @property({ type: Boolean, attribute: "is-current", reflect: true }) isCurrent = false;
  /** Set automatically by `<qgds-navigation>` — enables nav bar render mode. */
  @property({ type: Boolean, attribute: "is-nav-item", reflect: true }) isNavItem = false;
  /** Set automatically by `<qgds-navigation>`. */
  @property({ type: String, attribute: "navigation-variant", reflect: true })
  navigationVariant: NavigationVariant = "horizontal";
  /** Number of columns in the dropdown. Set automatically by `<qgds-navigation>`. */
  @property({ type: Number, reflect: true }) columns = 3;
  /** Direction passed to the auto-generated `<qgds-link-column>`. Set automatically by `<qgds-navigation>`. */
  @property({ type: String, attribute: "columns-layout", reflect: true }) columnsDirection: LinkColumnDirection =
    "horizontal";
  /** URL for the view-all CTA in the dropdown mega-menu. */
  @property({ type: String, attribute: "view-all-url" }) viewAllUrl = "";
  /** Label for the view-all CTA in the dropdown mega-menu. */
  @property({ type: String, attribute: "view-all-label" }) viewAllLabel = "View all";

  @state() private _hasNestedItems = false;
  @state() private _isOpen = false;
  @state() private _hasDropdown = false;

  connectedCallback() {
    super.connectedCallback?.();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "listitem");
    }
    document.addEventListener("keydown", this._onDocKeyDown);
    document.addEventListener("click", this._onDocClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    document.removeEventListener("keydown", this._onDocKeyDown);
    document.removeEventListener("click", this._onDocClick);
  }

  protected firstUpdated(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (slot) {
      const assigned = slot.assignedElements();
      this._hasDropdown = assigned.some((el) => el.tagName.toLowerCase() === "qgds-link-column");
      this._hasNestedItems = assigned.some((el) => el.tagName.toLowerCase() === "qgds-link-item");
    }
    this._ensureHeaderItem();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (
      changed.has("label") ||
      changed.has("href") ||
      changed.has("description") ||
      changed.has("layout") ||
      changed.has("isNavItem")
    ) {
      this._ensureHeaderItem();
    }
    if (
      changed.has("isNavItem") ||
      changed.has("columns") ||
      changed.has("layout") ||
      changed.has("columnsLayout") ||
      changed.has("viewAllUrl") ||
      changed.has("viewAllLabel")
    ) {
      this._ensureDropdownColumn();
    }
  }

  private _onDocKeyDown = (e: KeyboardEvent): void => {
    if (this._hasDropdown && e.key === "Escape" && this._isOpen) {
      this._isOpen = false;
    }
  };

  private _onDocClick = (e: MouseEvent): void => {
    if (this._hasDropdown && !this.contains(e.target as Node) && !this.shadowRoot?.contains(e.target as Node)) {
      this._isOpen = false;
    }
  };

  private _onSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });

    this._hasDropdown = assigned.some((el) => el.tagName.toLowerCase() === "qgds-link-column");

    if (!this.isNavItem && !this._hasDropdown) {
      // Standard mode: only qgds-link-item children allowed
      assigned.forEach((el) => {
        if (el.tagName.toLowerCase() !== "qgds-link-item") {
          el.remove();
        }
      });
    }

    this._hasNestedItems = assigned.filter((el) => el.tagName.toLowerCase() === "qgds-link-item").length > 0;
    this._ensureHeaderItem();
  };

  /**
   * When in nav mode and direct `<qgds-link-item>` children are present (but no `<qgds-link-column>`),
   * wraps them in a `<qgds-link-column>` whose attributes are derived from this item's
   * `view-all-url`, `view-all-label`, and the navigation's `columns` + `layout`.
   * If a `<qgds-link-column>` already exists, only updates its attributes.
   */
  private _ensureDropdownColumn(): void {
    if (!this.isNavItem) return;

    const existingColumn = Array.from(this.children).find((el) => el.tagName.toLowerCase() === "qgds-link-column") as
      | HTMLElement
      | undefined;

    if (existingColumn) {
      existingColumn.setAttribute("columns", String(this.columns));
      existingColumn.setAttribute("layout", this.columnsDirection);
      if (this.navigationVariant !== "horizontal") {
        existingColumn.setAttribute("suppress-icons", "");
      } else {
        existingColumn.removeAttribute("suppress-icons");
      }
      // if (this.viewAllUrl) existingColumn.setAttribute("view-all-url", this.viewAllUrl);
      // if (this.viewAllLabel) existingColumn.setAttribute("view-all-label", this.viewAllLabel);
      return;
    }

    // Find direct qgds-link-item children (not the injected .header)
    const directItems = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "qgds-link-item" && !el.classList.contains("header")
    );

    if (directItems.length === 0) return;

    const col = document.createElement("qgds-link-column");
    col.setAttribute("columns", String(this.columns));
    col.setAttribute("direction", this.columnsDirection);

    if (this.navigationVariant === "horizontal") {
      if (this.viewAllUrl) col.setAttribute("view-all-url", this.viewAllUrl);
      if (this.viewAllLabel) col.setAttribute("view-all-label", this.viewAllLabel);
    } else {
      col.setAttribute("suppress-icons", "");
    }
    // if (this.viewAllUrl) col.setAttribute("view-all-url", this.viewAllUrl);
    // if (this.viewAllLabel) col.setAttribute("view-all-label", this.viewAllLabel);
    directItems.forEach((item) => col.appendChild(item));
    this.appendChild(col);
  }

  /**
   * Prepends a `<qgds-link-item class="header">` into the slotted `<qgds-link-column>`.
   * Only runs in nav mode (`is-nav-item`) with horizontal layout.
   */
  private _ensureHeaderItem(): void {
    const column = this.querySelector("qgds-link-column");

    this.querySelector("qgds-link-item.header")?.remove();

    if (!column || !this.isNavItem || this.navigationVariant !== "horizontal") return;

    const header = document.createElement("qgds-link-item") as HTMLElement &
      Pick<QGDSLinkItem, "label" | "href" | "description">;
    header.classList.add("header");
    header.label = this.label;
    header.href = this.href;
    if (this.description) header.description = this.description;

    header.addEventListener("click", () => {
      this._isOpen = false;
    });
    column.prepend(header);
  }

  private _toggle(): void {
    this._isOpen = !this._isOpen;
  }

  render() {
    // ── Nav mode ────────────────────────────────────────────────────────────
    if (this.isNavItem) {
      const isHorizontal = this.navigationVariant === "horizontal";
      return html`
        <qgds-link
          class="${classMap({ "has-children": this._hasDropdown, "is-open": this._hasDropdown && this._isOpen })}"
          label="${this.label}"
          href="${this.href}"
          icon-name="${this.iconName}"
          ?only-icon="${this.onlyIcon}"
          ?is-disabled="${this.isDisabled}"
          icon-size="${isHorizontal && this._hasDropdown ? "sm" : this.iconSize}"
          aria-current="${ifDefined(this.isCurrent ? ("page" as const) : undefined)}"
          @click=${(e: Event) => {
            if (isHorizontal && this._hasDropdown) {
              e.preventDefault();
              this._toggle();
            }
          }}
        ></qgds-link>
        ${this.description ? html`<p class="description">${this.description}</p>` : ""}
        ${!isHorizontal && this._hasDropdown
          ? html`<div class="mobile-function">
              <button
                class="${classMap({ "dropdown-toggle": true, open: this._isOpen })}"
                aria-expanded="${this._isOpen ? "true" : "false"}"
                aria-label="Toggle ${this.label} navigation"
                @click="${() => this._toggle()}"
              >
                <qgds-icon icon-id="chevron-up" size="sm"></qgds-icon>
              </button>
            </div>`
          : ""}

        <div class="${classMap({ "dropdown-menu": true, show: this._isOpen })}">
          <slot @slotchange="${this._onSlotChange}"></slot>
        </div>
      `;
    }

    // ── Standard mode (qgds-link-column, etc.) ─────────────
    return html`
      <qgds-link
        label=${this.label}
        href=${this.href}
        icon-name=${this.iconName}
        icon-size=${this.iconName ? this.iconSize : ""}
        animation=${this.iconName ? this.animation : ""}
        ?is-disabled=${this.isDisabled}
        ?only-icon=${this.onlyIcon}
        ?stretch=${!!this.iconName}
        ?has-trailing-icon=${!!this.iconName}
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
    "qgds-link-item": QGDSLinkItem;
  }
}
