import type { Decorator } from "@storybook/web-components";
import { action } from "storybook/actions";

import { palettes } from "../src/utils";
import type { Viewport } from "storybook/viewport";
import breakpoint from "../src/styles/qgds-tokens/qgds-breakpoint";

type ActionListener = { name: string; handler: (e: Event) => void };

const ACTION_LISTENER = Symbol("qgds-action-listener");
type CanvasWithListener = HTMLElement & { [ACTION_LISTENER]?: ActionListener };

/**
 * Decorator factory: listens on the story's `canvasElement` for a custom event
 * and forwards `event.detail` to the Storybook Actions panel.
 *
 * Per-story override via `parameters.eventAction.name`.
 *
 * @example
 *   const meta = {
 *     decorators: [withEventAction("qgds-change")],
 *   };
 *
 *   // Override for a specific story:
 *   export const Custom: Story = {
 *     parameters: { eventAction: { name: "qgds-toggle" } },
 *   };
 */
export const withEventAction = (defaultEventName: string): Decorator => (storyFn, context) => {
  const eventName = (context.parameters?.eventAction?.name as string | undefined) ?? defaultEventName;
  const canvas = context.canvasElement as CanvasWithListener;

  const previous = canvas[ACTION_LISTENER];
  if (previous) canvas.removeEventListener(previous.name, previous.handler);

  const handler = (e: Event) => action(eventName)((e as CustomEvent).detail);
  canvas.addEventListener(eventName, handler);
  canvas[ACTION_LISTENER] = { name: eventName, handler };

  return storyFn();
};

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
