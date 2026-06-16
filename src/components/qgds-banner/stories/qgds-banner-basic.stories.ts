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
    "mobile-image-url": backgroundImageMobile,
    "image-description": "Background image",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    "background-option": "hero-image",
    "image-option": "grid-align",
    variant: "no-banner",
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const BasicBannerNoBackground: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "basic",
    "background-option": "none",
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
    controls: { include: ["palette", "variant", "heading", "background-option"] }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
    >
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
      <div>Renew your licence at a customer service centre, government office or police station.</div>
    </qgds-banner>
  `,
};

export const BasicBannerWithBackgroundTexture: Story = {
  args: {
    palette: "bold",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "basic",
    "background-option": "texture",
    "image-url": backgroundTexture,
    "image-description": "Background texture",
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
    controls: { include: ["palette", "variant", "heading", "background-option", "image-url"] }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-url=${args["image-url"]}
    >
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
      <div>Renew your licence at a customer service centre, government office or police station.</div>
    </qgds-banner>
  `,
};

export const BasicBannerWithBackgroundImage: Story = {
  args: {
    palette: "bold",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "basic",
    "background-option": "image",
    "image-url": backgroundImage,
    "mobile-image-url": backgroundImageMobile,
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
    controls: { include: ["palette", "variant", "heading", "background-option", "image-url", "mobile-image-url"] }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-url=${args["image-url"]}
      mobile-image-url=${args["mobile-image-url"]}
      image-description=${args["image-description"]}
    >
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item target="_self" rel="bookmark" url="/current_page">Current page</qgds-breadcrumbs-item>
      </qgds-breadcrumbs>
      <div>Renew your licence at a customer service centre, government office or police station.</div>
    </qgds-banner>
  `,
};
