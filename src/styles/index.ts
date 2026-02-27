//src/styles/index.ts

import { css, unsafeCSS } from "lit";

// Import specific stylesheets for granular control
// Utils
import resetCSS from "./base/reset.scss?inline";
import resetHostCSS from "./base/reset-host.scss?inline";
import printCSS from "./base/print.scss?inline";

// Global styles
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

export const printStyles = css`
  ${unsafeCSS(printCSS)}
`;
export const typographyStyles = css`
  ${unsafeCSS(typographyCSS)}
`;
//...

// Also export a baseStyles array that includes all modules, for easy inclusion in components
export const baseStyles = [resetStyles, printStyles, typographyStyles];
