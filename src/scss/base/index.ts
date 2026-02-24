import { resetStyles } from "./cssCollection";

/**
 * Combined base styles for all QGDS components
 * Import this array in component styles for consistent baseline
 *
 * @example
 * ```typescript
 * import { baseStyles } from "../../scss/base/index.js";
 *
 * static styles = [
 *   ...baseStyles,
 *   css`...component styles...`
 * ];
 * ```
 */
export const baseStyles = [resetStyles];

// Re-export individual stylesheets for granular control
export { resetStyles };
