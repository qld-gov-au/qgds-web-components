// Purpose: Register all QDGS components in TypeScript's DOM API
import type { QGDSCallout } from "../components/qgds-callout/qgds-callout";

declare global {
  interface HTMLElementTagNameMap {
    "qgds-callout": QGDSCallout;
  }
}

export {};
