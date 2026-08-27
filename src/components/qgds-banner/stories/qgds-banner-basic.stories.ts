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
import backgroundImage from "../../../img/banner-background-image.jpg";
import backgroundImageMobile from "../../../img/banner-background-image-mobile.jpg";
import backgroundTexture from "../../../img/banner-background-pattern.jpg";

const { args, argTypes, template } = getStorybookHelpers<QGDSBanner>("qgds-banner");

argTypes.palette = {
  control: { type: "select" },
  options: [...Object.keys(palettes)],
};

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Banner/Basic",
  component: "qgds-banner",
  args: {
    ...args,
    "image-url": backgroundImage,
    "small-image-url": backgroundImageMobile,
    "image-description": "Background image",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    "background-option": "hero-image",
    "image-option": "grid-align",
    variant: "no-banner",
    "has-shadow": true,
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const NoBackground: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "basic",
    "background-option": "none",
    "has-shadow": true,
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner." +
        "<br/>The variant `basic` used here is used to display a simplified banner layout which includes breadcrumbs, heading, abstract an an optional background texture or image.",
    }, // Disables control
    "background-option": {
      control: false,
      description: "The type of background to display in the banner. This variant uses the background option, `none`.",
    }, // Disables control
  },
  parameters: {
    controls: { include: ["palette", "variant", "heading", "background-option", "has-shadow"] }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      ?has-shadow=${args["has-shadow"]}
    >
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item href="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
      <div>Renew your licence at a customer service centre, government office or police station.</div>
    </qgds-banner>
  `,
};

export const BackgroundTexture: Story = {
  args: {
    palette: "bold",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "basic",
    "background-option": "texture",
    "image-url": backgroundTexture,
    "image-description": "Background texture",
    "has-shadow": true,
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. `basic` variant is used to display a simplified banner layout which includes breadcrumbs, heading, abstract an an optional background texture or image.",
    }, // Disables control
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner. This variant uses the background option, `texture`.",
    },
  },
  parameters: {
    controls: { include: ["palette", "variant", "heading", "background-option", "image-url", "has-shadow"] }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-url=${args["image-url"]}
      ?has-shadow=${args["has-shadow"]}
    >
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item href="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
      <div>Renew your licence at a customer service centre, government office or police station.</div>
    </qgds-banner>
  `,
};

export const BackgroundImage: Story = {
  args: {
    palette: "bold",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "basic",
    "background-option": "image",
    "image-url": backgroundImage,
    "small-image-url": backgroundImageMobile,
    "has-shadow": true,
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. `basic` variant is used to display a simplified banner layout which includes breadcrumbs, heading, abstract an an optional background texture or image.",
    }, // Disables control
    "background-option": {
      control: false,
      description: "The type of background to display in the banner.This variant uses the background option, `image`.",
    },
  },
  parameters: {
    controls: {
      include: ["palette", "variant", "heading", "background-option", "image-url", "small-image-url", "has-shadow"],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-url=${args["image-url"]}
      small-image-url=${args["small-image-url"]}
      image-description=${args["image-description"]}
      ?has-shadow=${args["has-shadow"]}
    >
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item href="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
      <div>Renew your licence at a customer service centre, government office or police station.</div>
    </qgds-banner>
  `,
};
