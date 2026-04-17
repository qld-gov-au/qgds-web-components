import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../.storybook/modes";
import { html } from "lit";
import type { QGDSTag } from "./qgds-tag";
import "./qgds-tag";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
const { args, argTypes, template } = getStorybookHelpers<QGDSTag>("qgds-tag");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Tag",
  component: "qgds-tag",
  argTypes,
  args,
  tags: ["autodocs"],
  render: (args: Args) => template(args),
  beforeEach({ canvasElement }) {
    const handleClick = (e: Event) => {
      action("qgds-click")((e as CustomEvent).detail);
    };
    const handleDismiss = (e: Event) => {
      action("qgds-dismiss")((e as CustomEvent).detail);
    };
    canvasElement.addEventListener("qgds-click", handleClick);
    canvasElement.addEventListener("qgds-dismiss", handleDismiss);

    return () => {
      canvasElement.removeEventListener("qgds-click", handleClick);
      canvasElement.removeEventListener("qgds-dismiss", handleDismiss);
    };
  },
};

export default meta;
type Story = StoryObj<Args>;

/**
 * Default tag variant for general use
 */
export const Default: Story = {
  args: {
    label: "Default Tag",
  },
};

/**
 * Info tag variant for informational states
 */
export const Info: Story = {
  args: {
    label: "Informational Tag",
    variant: "info",
  },
};

/**
 * Action tag variant for clickable tags
 */
export const Action: Story = {
  render: (args) =>
    html`<div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      ${template({ ...args, variant: "action", label: 'Actionable tag via variant="action" (renders as button)' })}
      ${template({ ...args, href: "#", label: "Actionable tag via href (renders as link)" })}
    </div>`,
};

/**
 * Dismissible tag variant with a close button for removable tags
 */
export const Dismissible: Story = {
  args: {
    label: "Dismissible (Applied Filter) Tag",
    variant: "dismissible",
  },
};

/**
 * All Variants - with Chromatic modes
 */
export const AllVariantsDefault: Story = {
  args: {
    label: "Default Tag",
    variant: "default",
  },
  parameters: {
    ...chromaticModes,
  },
  globals: { globalPalette: "default" },
  render: (args) =>
    html`<div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      ${template({
        ...args,
        variant: "default",
        label: "Default",
      })}
      ${template({ ...args, variant: "info", label: "Information" })}
      ${template({ ...args, label: "Action link", href: "#" })}
      ${template({ ...args, variant: "action", label: "Action button" })}
      ${template({
        ...args,
        variant: "dismissible",
        label: "Dismissible",
      })}
    </div>`,
};

/**
 * Truncation Example - demonstrates truncation behavior with long text
 */
export const TruncationExample: Story = {
  args: {
    label: "This is an example of a very long tag label that should be truncated with an ellipsis",
  },
  globals: { viewport: "mobile2" },
};
