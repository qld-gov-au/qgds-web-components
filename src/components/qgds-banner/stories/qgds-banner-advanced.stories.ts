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
import heroImageDesktop from "../../../img/hero-image-desktop.jpg";
import heroImageMobile from "../../../img/hero-image-mobile.jpg";
import fixedGraphicImage from "../../../img/fixed-graphic-ratio-desktop.svg";
import fixedGraphicImageMobile from "../../../img/fixed-graphic-ratio-mobile.svg";
import backgroundTexture from "../../../img/banner-background-pattern.jpg";
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

export const BlockTitle: Story = {
  args: {
    heading: "Disaster recovery",
    "sub-heading": "and support",
    variant: "advanced",
    "background-option": "none",
    "is-block-type-heading": true,
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner." +
        "<br/>The variant `advanced` used here is used to display a simplified banner layout which includes breadcrumbs, heading, abstract an an optional background texture or image.",
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

export const NoBackground: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "advanced",
    "background-option": "none",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner." +
        "<br/>The variant `advanced` used here is used to display a simplified banner layout which includes breadcrumbs, heading, abstract an an optional background texture or image.",
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

export const BackgroundTexture: Story = {
  args: {
    palette: "bold",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "advanced",
    "background-option": "texture",
    "image-url": backgroundTexture,
    "image-description": "Background texture",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional background texture.",
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

export const BackgroundImage: Story = {
  args: {
    palette: "bold",
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    variant: "advanced",
    "background-option": "image",
    "image-url": backgroundImage,
    "mobile-image-url": backgroundImageMobile,
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional background image.",
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

export const FixedImageRatio: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    palette: "bold",
    variant: "advanced",
    "background-option": "hero-image",
    "image-option": "fixed-image-ratio",
    "image-url": heroImageDesktop,
    "mobile-image-url": heroImageMobile,
    "image-description": "Hero image",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional hero image with fixed image ratio.",
    }, // Disables control
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner.This variant uses the background option, `hero-image`.",
    },
  },
  parameters: {
    controls: {
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "image-option",
        "image-url",
        "mobile-image-url",
        "image-description",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
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

export const FixedGraphicRatio: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    palette: "bold",
    variant: "advanced",
    "background-option": "hero-image",
    "image-option": "fixed-graphic-ratio",
    "image-url": fixedGraphicImage,
    "mobile-image-url": fixedGraphicImageMobile,
    "image-description": "Hero image",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional hero image with fixed graphic ratio.",
    },
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner.This variant uses the background option, `hero-image`.",
    },
  },
  parameters: {
    controls: {
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "image-option",
        "image-url",
        "mobile-image-url",
        "image-description",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
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

export const AlignedToGrid: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    palette: "bold",
    variant: "advanced",
    "background-option": "hero-image",
    "image-option": "grid-align",
    "image-url": heroImageDesktop,
    "mobile-image-url": heroImageMobile,
    "image-description": "Hero image",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional hero image which is aligned to grid.",
    },
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner.This variant uses the background option, `hero-image`.",
    },
  },
  parameters: {
    controls: {
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "image-option",
        "image-url",
        "mobile-image-url",
        "image-description",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
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

export const AlignedToRight: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    palette: "bold",
    variant: "advanced",
    "background-option": "hero-image",
    "image-option": "right-align",
    "image-url": heroImageDesktop,
    "mobile-image-url": heroImageMobile,
    "image-description": "Hero image",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional hero image which is aligned to right.",
    },
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner.This variant uses the background option, `hero-image`.",
    },
  },
  parameters: {
    controls: {
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "image-option",
        "image-url",
        "mobile-image-url",
        "image-description",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
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

export const AlignedToRightWithGradient: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    palette: "bold",
    variant: "advanced",
    "background-option": "hero-image",
    "image-option": "right-align-gradient",
    "image-url": heroImageDesktop,
    "mobile-image-url": heroImageMobile,
    "image-description": "Hero image",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional hero image which is aligned to right with a gradient.",
    }, // Disables control
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner.This variant uses the background option, `hero-image`.",
    },
  },
  parameters: {
    controls: {
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "image-option",
        "image-url",
        "mobile-image-url",
        "image-description",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
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

export const CTAButtons: Story = {
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    palette: "bold",
    variant: "advanced",
    "background-option": "hero-image",
    "image-option": "fixed-image-ratio",
    "image-url": heroImageDesktop,
    "mobile-image-url": heroImageMobile,
    "image-description": "Hero image",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional hero image which is aligned to right with a gradient.",
    }, // Disables control
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner.This variant uses the background option, `hero-image`.",
    },
  },
  parameters: {
    controls: {
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "image-option",
        "image-url",
        "mobile-image-url",
        "image-description",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
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
  args: {
    heading: "Lorem ipsum dolor sit amet, consectetur adipiscing sed",
    palette: "bold",
    variant: "advanced",
    "background-option": "hero-image",
    "image-option": "fixed-image-ratio",
    "image-url": heroImageDesktop,
    "mobile-image-url": heroImageMobile,
    "image-description": "Hero image",
  },
  argTypes: {
    variant: {
      control: false,
      description:
        "The variant of the banner, determines the layout and styling of the banner. This uses `advanced` variant with breadcrumbs, heading, abstract and an optional hero image which is aligned to right with a gradient.",
    }, // Disables control
    "background-option": {
      control: false,
      description:
        "The type of background to display in the banner.This variant uses the background option, `hero-image`.",
    },
  },
  parameters: {
    controls: {
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "image-option",
        "image-url",
        "mobile-image-url",
        "image-description",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
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
