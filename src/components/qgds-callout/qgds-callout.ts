import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("qgds-callout")
export class QGDSCallout extends LitElement {
  @property({ type: String }) headline: string = "Callout headline";
  @property({ type: String, reflect: true }) level: string = "3";
  @property({ type: String }) message: string = "This is an alert message.";
  @property({ type: String }) palette: string = "";

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      background-color: var(--bg, #f9f9f9);
      color: var(--text-color, #333);
      padding: 1.5rem 1rem 1.5rem 1.5rem;
      border-left: 4px solid var(--accent-color);
      margin-bottom: 1rem;
    }

    .headline {
      margin: 0;
      padding: 0 0 1rem 0;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 600;
      color: var(--headline-color);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    qgds-button {
      max-width: 4rem;
    }
  `;

  render() {
    let headingElement: unknown = "";

    if (this.headline) {
      switch (this.level.toLowerCase()) {
        case "2":
        case "h2":
          headingElement = html`<h2 class="headline">${this.headline}</h2>`;
          break;
        case "3":
        case "h3":
          headingElement = html`<h3 class="headline">${this.headline}</h3>`;
          break;
        case "4":
        case "h4":
          headingElement = html`<h4 class="headline">${this.headline}</h4>`;
          break;
        default:
          console.warn(
            `Unsupported headline level: ${this.level}. Defaulting to h3.`
          );
          headingElement = html`<h3 class="headline">${this.headline}</h3>`;
      }
    }

    return html`
      <div class="qgds-callout">
        ${headingElement}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
