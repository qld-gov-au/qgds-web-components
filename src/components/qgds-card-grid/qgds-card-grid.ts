import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

export const tagName = "qgds-card-grid";

import componentCSS from "./qgds-card-grid.styles.scss?inline";

export type CardGridSpacing = "sm" | "md" | "lg";

/**
 * QGDS Card Grid Component
 * @prop {CardGridSpacing} [CardGridSpacing="md"] - The spacing between cards in the grid. Options are "sm", "md", or "lg". Default is "md".
 * @slot default - Place qgds-card's into the qgds-card-grid tag
 * @tagname qgds-card-grid
 */

@customElement(tagName)
export class QGDSCardGrid extends LitElement {
  static styles = unsafeCSS(componentCSS);

  @property({ type: String, reflect: true, useDefault: true })
  CardGridSpacing: CardGridSpacing = "md";

  render() {
    const classes = {
      "qgds-card-grid": true,
      [`spacing-${this.CardGridSpacing}`]: true,
    };

    return html`
      <div class="card-grid ${classMap(classes)}">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: QGDSCardGrid;
  }
}
