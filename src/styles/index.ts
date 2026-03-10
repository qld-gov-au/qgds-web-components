//src/styles/index.ts

import { css, unsafeCSS } from "lit";

// Import specific stylesheets for granular control
// Utils
import resetCSS from "./base/reset.scss?inline";
import resetHostCSS from "./base/reset-host.scss?inline";
import printCSS from "./base/print.scss?inline";

// Global styles
import globalCSS from "./base/globals.scss?inline";
import elementsCSS from "./base/elements.scss?inline";
import typographyCSS from "./base/typography.scss?inline";
//...

// EXPORTS
export const resetStyles = [
  css`
    ${unsafeCSS(resetCSS)}
  `,
  css`
    ${unsafeCSS(resetHostCSS)}
  `,
];

export const globalStyles = css`
  ${unsafeCSS(globalCSS)}
`;
export const typographyStyles = css`
  ${unsafeCSS(typographyCSS)}
`;
export const elementsStyles = css`
  ${unsafeCSS(elementsCSS)}
`;
export const printStyles = css`
  ${unsafeCSS(printCSS)}
`;

// Also export a baseStyles array that includes all modules, for easy inclusion in components
export const baseStyles = [resetStyles, typographyStyles, elementsStyles /*, ...other styles */];
