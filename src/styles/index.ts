import { css, unsafeCSS } from "lit";

// Import specific stylesheets for granular control
import resetCSS from "./base/reset.scss?inline";
import resetHostCSS from "./base/reset-host.scss?inline";
import printCSS from "./base/print.scss?inline";
import formsCSS from "./forms/_index.scss?inline";
import utilitiesCSS from "./utilities/_index.scss?inline";
import animationsCSS from "./base/animations.scss?inline";
import elementsCSS from "./base/elements.scss?inline";
import typographyCSS from "./base/typography.scss?inline";
//...

// EXPORTS

export const formStyles = css`
  ${unsafeCSS(formsCSS)}
`;
export const utilitiesStyles = css`
  ${unsafeCSS(utilitiesCSS)}
`;

export const printStyles = css`
  ${unsafeCSS(printCSS)}
`;

// Also export a baseStyles array that includes all modules, for easy inclusion in components
export const baseStyles = [
  css`
    ${unsafeCSS(resetCSS)}
  `,
  css`
    ${unsafeCSS(resetHostCSS)}
  `,
  css`
    ${unsafeCSS(elementsCSS)}
  `,
  css`
    ${unsafeCSS(animationsCSS)}
  `,
  css`
    ${unsafeCSS(typographyCSS)}
  ` /*, ...other styles */,
];
