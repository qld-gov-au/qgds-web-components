import { css, unsafeCSS } from "lit";
import resetCss from "./reset.css?inline";

/**
 * Shared reset styles for all QGDS components
 * Uses Constructable Stylesheets for maximum efficiency
 * Only loaded once in memory, shared across all component instances
 */
export const resetStyles = css`
  ${unsafeCSS(resetCss)}

  /* Box sizing reset */
  /* Remove default margins and padding */
  /* Ensure components don't leak styles */
  :host {
    box-sizing: border-box;
    isolation: isolate;
    display: var(--qgds-host-display, inline-block);
    margin: 0;
    padding: 0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  button {
    appearance: none;
    border: none;
  }
`;

export const printStyles = css`
  .no-print {
    display: none !important;
  }
`;
