import { palettes } from "../src/utils";
import type { Viewport } from "storybook/viewport";
import breakpoint from "../src/styles/qgds-tokens/qgds-breakpoint";

/**
 * Creates a Storybook control for palette switching at the component level.
 * @param defaultValue - The default palette value (defaults to 'default')
 * @returns ArgType configuration for palette control
 *
 * How to use in your story:
 *
 * import { paletteControl } from 'src/utils';
 *
 * export default {
 *  ...
 *
 * argTypes: {
 *   palette: paletteControl('soft'), // sets default to 'soft' palette
 *  },
 *
 *  ...
 * }
 */
export const paletteControl = (defaultValue: string = "default") => ({
  name: "Palette",
  options: Object.keys(palettes),
  control: {
    type: "radio",
    labels: palettes,
  },
  defaultValue: "default",
  description: "Select a colour palette",
  table: {
    category: "Component style",
    defaultValue: { summary: defaultValue },
  },
});

/**
 * Storybook viewports based on current QGDS defined breakpoints.
 */
export const QGDSViewports: Record<string, Viewport> = {
  XS: {
    name: "QGDS XS",
    styles: {
      width: `${breakpoint.XS}px`,
      height: "auto",
    },
    type: "mobile",
  },
  SM: {
    name: "QGDS SM",
    styles: {
      width: `${breakpoint.SM}px`,
      height: "auto",
    },
    type: "mobile",
  },
  MD: {
    name: "QGDS MD",
    styles: {
      width: `${breakpoint.MD}px`,
      height: "auto",
    },
    type: "tablet",
  },
  LG: {
    name: "QGDS LG",
    styles: {
      width: `${breakpoint.LG}px`,
      height: "auto",
    },
    type: "desktop",
  },
  XL: {
    name: "QGDS XL",
    styles: {
      width: `${breakpoint.XL}px`,
      height: "auto",
    },
    type: "desktop",
  },
  XXL: {
    name: "QGDS XXL",
    styles: {
      width: `${breakpoint.XXL}px`,
      height: "auto",
    },
    type: "desktop",
  },
};
