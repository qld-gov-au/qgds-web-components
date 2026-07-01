import { unsafeCSS } from "lit";

// Import specific stylesheets for granular control
import animationsCSS from "./base/animations.scss?inline";
import elementsCSS from "./base/elements.scss?inline";
import formsCSS from "./forms/_index.scss?inline";
import palettesCSS from "./base/palettes.scss?inline";
import printCSS from "./base/print.scss?inline";
import resetCSS from "./base/reset.scss?inline";
import resetHostCSS from "./base/reset-host.scss?inline";
import typographyCSS from "./base/typography.scss?inline";
import utilitiesCSS from "./utilities/_index.scss?inline";
import gridCSS from "./grid.scss?inline";

// EXPORTS
export const animationsStyles = unsafeCSS(animationsCSS);
export const elementsStyles = unsafeCSS(elementsCSS);
export const formStyles = unsafeCSS(formsCSS);
export const gridStyles = unsafeCSS(gridCSS);
export const paletteStyles = unsafeCSS(palettesCSS);
export const printStyles = unsafeCSS(printCSS);
export const resetStyles = [unsafeCSS(resetCSS), unsafeCSS(resetHostCSS)];
export const typographyStyles = unsafeCSS(typographyCSS);
export const utilitiesStyles = unsafeCSS(utilitiesCSS);

// Also export a baseStyles array that includes all modules, for easy inclusion in components
export const baseStyles = [
  resetStyles,
  elementsStyles,
  paletteStyles,
  typographyStyles,
  gridStyles,
  // ...other styles
];
