import { palettes } from "../src/utils";

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

/*

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
