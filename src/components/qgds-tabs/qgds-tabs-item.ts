import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../../styles";
import "../qgds-icon/qgds-icon.js";
import componentCSS from "./qgds-tabs-item.styles.scss?inline";

/** QGDS Tab Item Web Component
 * Used as a child element within {@link qgds-tabs} to define individual tab items.
 *
 * @tag qgds-tabs-item
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120418-67363&m=dev
 * @website https://www.designsystem.qld.gov.au/components/tabs
 *
 * @property {string} label - The text label for the tab, displayed in the tab navigation.
 * @property {string} iconName - Optional name of the icon to display alongside the label in the tab navigation. Should correspond to an icon in the QGDS icon set.
 *
 * @example
 * <qgds-tabs-item label="Tab label 1" icon-name="home" >Tab1 Content</qgds-tabs-item>
 * <qgds-tabs-item label="Tab label 2" icon-name="user" >Tab2 Content</qgds-tabs-item>
 * <qgds-tabs-item label="Tab label 3" icon-name="settings" >Tab3 Content</qgds-tabs-item>
 *
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 *
 */

export type QGDSTabsItemProps = InstanceType<typeof QGDSTabsItem>;

@customElement("qgds-tabs-item")
export class QGDSTabsItem extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, attribute: "label" })
  label = "";

  @property({ type: String, attribute: "icon-name" })
  iconName = "";

  render() {
    return html` <article class="panel">
      <slot></slot>
    </article>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-tabs-item": QGDSTabsItem;
  }
}
