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
 */
export const allModes = {
  XS: { viewport: "XS" },
  SM: { viewport: "SM" },
  MD: { viewport: "MD" },
  LG: { viewport: "LG" },
  XL: { viewport: "XL" },
  XXL: { viewport: "XXL" },
} as const;
