// Purpose: Register all QDGS components in TypeScript's DOM API
import type { QGDSCallout } from "../components/qgds-callout/qgds-callout";
import type { QGDSIcon } from "../components/qgds-icon/qgds-icon";
import { QGDSInpageAlert } from "../components/qgds-inpage-alert/qgds-inpage-alert";
import type { QGDSInpageNav } from "../components/qgds-inpage-nav/qgds-inpage-nav";

declare global {
  interface HTMLElementTagNameMap {
    "qgds-callout": QGDSCallout;
    "qgds-icon": QGDSIcon;
    "qgds-inpage-nav": QGDSInpageNav;
    "qgds-inpage-alert": QGDSInpageAlert;
  }
}

export {};
