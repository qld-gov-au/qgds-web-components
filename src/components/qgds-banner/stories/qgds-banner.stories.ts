import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { QGDSBanner } from "../qgds-banner";
import { palettes } from "../../../utils";

import "../qgds-banner";
import "../../qgds-breadcrumbs/qgds-breadcrumbs";
import "../../qgds-breadcrumbs/qgds-breadcrumbs-item";
import "../../qgds-button/qgds-button";
import "../../qgds-card/qgds-card";

const { args, argTypes, template } = getStorybookHelpers<QGDSBanner>("qgds-banner");

argTypes.palette = {
  control: { type: "select" },
  options: [...Object.keys(palettes)],
};

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Banner",
  component: "qgds-banner",
  tags: ["autodocs"],
  args: {
    ...args,
    heading: "Cancelling your vehicle, trailer, caravan, motorised mobility device or boat registration",
    variant: "default",
    palette: "bold",
    "has-shadow": true,
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const DefaultBanner: Story = {
  args: {
    ...meta.args,
    "background-option": "none",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. `default` variant, is used to display breadcrumbs and heading.",
    }, // Disables control
  },
  parameters: {
    controls: { include: ["palette", "variant", "heading", "has-shadow"] }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner palette=${args.palette} variant="default" heading=${args.heading} .hasShadow=${args["has-shadow"]}>
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
    </qgds-banner>
  `,
};
export const NoBanner: Story = {
  args: {
    ...meta.args,
    variant: "no-banner",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. `no-banner` layout is used to display just breadcrumbs.",
    }, // Disables control
  },
  parameters: {
    controls: { include: ["palette", "variant", "has-shadow"] }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner palette=${args.palette} variant=${args.variant} .hasShadow=${args["has-shadow"]}>
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
    </qgds-banner>
  `,
};
