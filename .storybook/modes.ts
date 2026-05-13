import "../src/styles/qgds-tokens/qgds-breakpoint";
import qgdsBreakpoint from "../src/styles/qgds-tokens/qgds-breakpoint";

export const chromaticModes = {
  chromatic: {
    modes: {
      default: { globalPalette: "default" },
      soft: { globalPalette: "soft" },
      muted: { globalPalette: "muted" },
      bold: { globalPalette: "bold" },
      deep: { globalPalette: "deep" },
    },
  },
} as const;

/**
 * Modes are used to configure Chromatic snapshots
 * Chromatic viewports only support px units, so only width is defined (height will be auto).
 */
export const allModes = {
  XS: { viewport: qgdsBreakpoint.XS },
  SM: { viewport: qgdsBreakpoint.SM },
  MD: { viewport: qgdsBreakpoint.MD },
  LG: { viewport: qgdsBreakpoint.LG },
  XL: { viewport: qgdsBreakpoint.XL },
  XXL: { viewport: qgdsBreakpoint.XXL },
} as const;
