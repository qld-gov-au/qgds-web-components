//src/styles/index.ts

/* This file serves as the main TS entry point for all styles in the QGDS web components library. It provides a single import source for base styles, utilities, and component-specific styles. By centralizing style exports here, we can ensure consistent styling across all components and simplify imports in individual component files. */

import { css, unsafeCSS } from "lit";

// Import specific stylesheets for granular control
import resetCSS from "./base/reset.scss?inline";
import printCSS from "./base/print.scss?inline";
import typographyCSS from "./base/typography.scss?inline";

export const resetStyles = css`${unsafeCSS(resetCSS)}`; // prettier-ignore
export const printStyles = css`${unsafeCSS(printCSS)}`; // prettier-ignore
export const typographyStyles = css`${unsafeCSS(typographyCSS)}`; // prettier-ignore
//etc... add global styles as needed

// Export baseStyles array for easy inclusion in components
export const baseStyles = [resetStyles, printStyles, typographyStyles];
