import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { ifDefined } from "lit/directives/if-defined.js";
import { html } from "lit";
import { chromaticModes } from "../../../.storybook/modes";

import type { QGDSFeatureIcon } from "./qgds-feature-icon";
import "./qgds-feature-icon";

import { ICON_NAMES } from "../qgds-icon/icon-names.js";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes, template } = getStorybookHelpers<QGDSFeatureIcon>("qgds-feature-icon");

// Set up an argType for the icon name, using ICON_NAMES for the options
argTypes["icon-name"] = {
  control: "select",
  options: ICON_NAMES,
} as const;

// Disable control for size since we are showing both sizes in the story
argTypes.size = {
  control: false,
};

type QGDSFeatureIconStoryArgs = typeof args;

const meta: Meta<QGDSFeatureIconStoryArgs> = {
  title: "Components/Feature Icon",
  component: "qgds-feature-icon",
  tags: ["autodocs"],
  args: {
    ...args,
    "icon-name": "home",
  },
  argTypes,
  render: (storyArgs) => template(storyArgs),
};

export default meta;
type Story = StoryObj<QGDSFeatureIconStoryArgs>;

export const Default: Story = {
  args: {
    "icon-name": "home",
  },
  parameters: {
    ...chromaticModes,
  },
  render: (storyArgs) => html`
    <qgds-feature-icon icon-name=${ifDefined(storyArgs["icon-name"])}></qgds-feature-icon>
    <qgds-feature-icon icon-name=${ifDefined(storyArgs["icon-name"])} size="lg"></qgds-feature-icon>
  `,
};
