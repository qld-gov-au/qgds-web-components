import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import componentCSS from "./qgds-link.styles.scss?inline";
import { baseStyles } from "../../styles";

export type Animations = "" | "leftToRight" | "rightToLeft" | "topToBottom" | "bottomToTop" | "scaleIn" | "scaleOut";
export type IconSize = "sm" | "md" | "lg" | "xl";

@customElement("qgds-link")
export class QgdsLink extends LitElement {
  static styles = [
    ...baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, reflect: true }) label = "";
  @property({ type: String }) href = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, attribute: "icon-name" }) iconName = "";
  @property({ type: String, attribute: "icon-size" }) iconSize: IconSize | "" = "";
  @property({ type: Boolean, reflect: true, attribute: "trailing-icon" })
  trailingIcon = false;
  @property({ type: Boolean }) stretch = false;
  @property({ type: String }) animation: Animations = "";
  @property({ type: Boolean, reflect: true, attribute: "only-icon" }) onlyIcon = false;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("animation")) {
      if (this.animation) {
        this.setAttribute("animation", this.animation);
      } else {
        this.removeAttribute("animation");
      }
    }
    if (changedProps.has("href")) {
      if (this.href) {
        this.setAttribute("href", this.href);
      } else {
        this.removeAttribute("href");
      }
    }
    if (changedProps.has("iconName")) {
      if (this.iconName) {
        this.setAttribute("icon-name", this.iconName);
      } else {
        this.removeAttribute("icon-name");
      }
    }
    if (changedProps.has("iconSize")) {
      if (this.iconSize) {
        this.setAttribute("icon-size", this.iconSize);
      } else {
        this.removeAttribute("icon-size");
      }
    }
    if (changedProps.has("stretch")) {
      if (this.stretch) {
        this.setAttribute("stretch", "");
      } else {
        this.removeAttribute("stretch");
      }
    }
  }

  protected _dispatchClickEvent() {
    this.dispatchEvent(
      new CustomEvent("s-click", {
        bubbles: true,
        composed: true,
        detail: { href: this.href, label: this.label },
      })
    );
  }

  protected _onClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    this._dispatchClickEvent();
    if (!this.href.startsWith("#")) return;
    const id = this.href.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const hasHref = !!this.href;
    const iconLabel = this.iconName || undefined;
    // Only set aria-label when there is no visible text — visible label text
    // is already the accessible name and aria-label would override it.
    const ariaLabel = this.label ? undefined : (iconLabel ?? undefined);
    const labelContent = this.onlyIcon ? html`<span class="sr-only">${this.label}</span>` : this.label;
    const iconStyle = [`--qgds-icon-svg: var(--qgds-icon-${this.iconName})`].filter(Boolean).join("; ");

    return hasHref
      ? html`
          <a
            href=${this.href}
            aria-label=${ifDefined(ariaLabel)}
            @click=${(e: MouseEvent) => this._onClick(e)}
            style=${iconStyle}
          >
            <qgds-icon
              icon-id=${ifDefined(this.iconName || undefined)}
              size=${this.iconSize || "md"}
              aria-label=${this.label ? "" : this.iconName || "icon"}
            ></qgds-icon>
            ${labelContent}
          </a>
        `
      : html`
          <span style=${iconStyle} aria-label=${ifDefined(ariaLabel)}>
            <qgds-icon
              icon-id=${ifDefined(this.iconName || undefined)}
              size=${this.iconSize || "md"}
              aria-label=${this.label ? "" : this.iconName || "icon"}
            ></qgds-icon>
            ${labelContent}
          </span>
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-link": QgdsLink;
  }
}
