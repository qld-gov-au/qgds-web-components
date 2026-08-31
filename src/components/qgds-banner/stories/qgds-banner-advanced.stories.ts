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
    heading: "Cancelling your vehicle, trailer, caravan, motorised mobility device or boat registration",
    "sub-heading": "and support",
    "is-block-type-heading": false,
    "has-shadow": true,
    variant: "advanced",
    palette: "bold",
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const BlockTitle: Story = {
  args: {
    ...meta.args,
    heading: "Disaster recovery",
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
      include: [
        "palette",
        "variant",
        "heading",
        "background-option",
        "sub-heading",
        "is-block-type-heading",
        "has-shadow",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      sub-heading=${args["sub-heading"]}
      background-option=${args["background-option"]}
      ?is-block-type-heading=${args["is-block-type-heading"]}
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

export const NoBackground: Story = {
  args: {
    ...meta.args,
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
    ...meta.args,
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
    ...meta.args,
    "background-option": "image",
    "image-url": backgroundImage,
    "small-image-url": backgroundImageMobile,
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

export const FixedImageRatio: Story = {
  args: {
    ...meta.args,
    "background-option": "hero-image",
    "image-option": "fixed-image-ratio",
    "image-url": heroImageDesktop,
    "small-image-url": heroImageMobile,
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
        "small-image-url",
        "image-description",
        "has-shadow",
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

export const FixedGraphicRatio: Story = {
  args: {
    ...meta.args,
    "background-option": "hero-image",
    "image-option": "fixed-graphic-ratio",
    "image-url": fixedGraphicImage,
    "small-image-url": fixedGraphicImageMobile,
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
        "small-image-url",
        "image-description",
        "has-shadow",
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

export const AlignedToGrid: Story = {
  args: {
    ...meta.args,
    "background-option": "hero-image",
    "image-option": "grid-align",
    "image-url": heroImageDesktop,
    "small-image-url": heroImageMobile,
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
        "small-image-url",
        "image-description",
        "has-shadow",
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

export const AlignedToRight: Story = {
  args: {
    ...meta.args,
    "background-option": "hero-image",
    "image-option": "right-align",
    "image-url": heroImageDesktop,
    "small-image-url": heroImageMobile,
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
        "small-image-url",
        "image-description",
        "has-shadow",
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

export const AlignedToRightWithGradient: Story = {
  args: {
    ...meta.args,
    "background-option": "hero-image",
    "image-option": "right-align-gradient",
    "image-url": heroImageDesktop,
    "small-image-url": heroImageMobile,
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
        "small-image-url",
        "image-description",
        "has-shadow",
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

export const CTAButtons: Story = {
  args: {
    ...meta.args,
    heading: "Disaster recovery",
    "sub-heading": "and support",
    "background-option": "hero-image",
    "image-option": "right-align",
    "image-url": heroImageDesktop,
    "small-image-url": heroImageMobile,
    "image-description": "Hero image",
    "is-block-type-heading": true,
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
        "sub-heading",
        "background-option",
        "image-option",
        "image-url",
        "small-image-url",
        "image-description",
        "has-shadow",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      sub-heading=${args["sub-heading"]}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
      image-url=${args["image-url"]}
      small-image-url=${args["small-image-url"]}
      image-description=${args["image-description"]}
      ?is-block-type-heading=${args["is-block-type-heading"]}
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
    ...meta.args,
    "background-option": "hero-image",
    "image-option": "right-align",
    "image-url": heroImageDesktop,
    "small-image-url": heroImageMobile,
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
        "small-image-url",
        "image-description",
        "has-shadow",
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

export const ContainedBanner: Story = {
  args: {
    ...meta.args,
    heading: "Disaster recovery",
    "sub-heading": "and support",
    variant: "contained",
    "background-option": "hero-image",
    "image-option": "right-align",
    "image-url": heroImageDesktop,
    "small-image-url": heroImageMobile,
    "image-description": "Hero image",
    "is-block-type-heading": true,
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
        "sub-heading",
        "background-option",
        "image-option",
        "image-url",
        "small-image-url",
        "image-description",
        "has-shadow",
      ],
    }, // Shows ONLY specific ones
  },
  render: (args) => html`
    <qgds-banner
      palette=${args.palette}
      variant=${args.variant}
      heading=${args.heading}
      sub-heading=${args["sub-heading"]}
      background-option=${args["background-option"]}
      image-option=${args["image-option"]}
      image-url=${args["image-url"]}
      small-image-url=${args["small-image-url"]}
      image-description=${args["image-description"]}
      ?is-block-type-heading=${args["is-block-type-heading"]}
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
