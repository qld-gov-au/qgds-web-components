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

const { args, argTypes, template } = getStorybookHelpers<QGDSBanner>("qgds-banner");

argTypes.palette = {
  control: { type: "select" },
  options: [...Object.keys(palettes)],
};

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Banner/Advanced",
  component: "qgds-banner",
  args: {
    ...args,
    "image-url": backgroundImage,
    "mobile-image-url": backgroundImageMobile,
    "image-description": "Background image",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    "sub-heading": "Lorem ipsum dolor",
    "is-block-type-heading": false,
    "background-option": "hero-image",
    "image-option": "grid-align",
    variant: "no-banner",
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const BlockTitleHeading: Story = {
  args: {
    heading: "Disaster recovery",
    "sub-heading": "and support",
    variant: "advanced",
    "background-option": "none",
    "is-block-type-heading": false,
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
    controls: {
      include: ["palette", "variant", "heading", "background-option", "sub-heading", "is-block-type-heading"],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      sub-heading=${args["sub-heading"]}
      background-option=${args["background-option"]}
      .isBlockTypeHeading=${args["is-block-type-heading"]}
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

export const StandardCTA: Story = {
  args: meta.args,
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
      image-url=${args["image-url"]}
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
      <div slot="cta">
        <qgds-button
          target="_self"
          type="button"
          aria-label="Primary Action"
          label="Primary"
          variant="primary"
          href="https://www.qld.gov.au"
          id=""
        >
        </qgds-button>
        <qgds-button
          target="_self"
          type="button"
          aria-label="Secondary Action"
          label="Secondary"
          variant="secondary"
          href="https://www.qld.gov.au"
          id=""
        >
        </qgds-button>
      </div>
    </qgds-banner>
  `,
};

export const ArrowCards: Story = {
  args: meta.args,
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
      image-url=${args["image-url"]}
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
      <div slot="cards">
        <qgds-card action="single" target="_blank" variant="arrow" heading="Card title" href="https://www.designsystem.qld.gov.au/components/card" palette="soft">
        </qgds-card>
    
        <qgds-card action="single" target="_blank" variant="arrow" heading="Card title" href="https://www.designsystem.qld.gov.au/components/card" palette="soft">
        </qgds-card>
    
        <qgds-card action="single" target="_blank" variant="arrow" heading="Card title" href="https://www.designsystem.qld.gov.au/components/card" palette="soft">
        </qgds-card>
        </qgds-button>
      </div>
    </qgds-banner>
  `,
};
