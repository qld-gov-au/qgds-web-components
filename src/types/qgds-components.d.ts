// Purpose: Register all QDGS components in TypeScript's DOM API
import type { QGDSCallout } from "../components/qgds-callout/qgds-callout";
import type { QGDSInpageNav } from "../components/qgds-inpage-nav/qgds-inpage-nav";

declare global {
  interface HTMLElementTagNameMap {
    "qgds-callout": QGDSCallout;
    "qgds-inpage-nav": QGDSInpageNav;
  }
}

export {};
