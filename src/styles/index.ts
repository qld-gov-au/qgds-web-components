import { css, unsafeCSS } from "lit";

// Import specific stylesheets for granular control
import resetCSS from "./base/reset.scss?inline";
import resetHostCSS from "./base/reset-host.scss?inline";
import printCSS from "./base/print.scss?inline";
import formsCSS from "./forms/_index.scss?inline";
import utilitiesCSS from "./utilities/_index.scss?inline";

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
export const formStyles = css`
  ${unsafeCSS(formsCSS)}
`;
export const utilitiesStyles = css`
  ${unsafeCSS(utilitiesCSS)}
`;
//...

// Also export a baseStyles array that includes all modules, for easy inclusion in components
export const baseStyles = [resetStyles, printStyles, typographyStyles];
