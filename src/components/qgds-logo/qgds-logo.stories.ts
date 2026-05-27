import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { QGDSLogo } from "./qgds-logo";
import "./qgds-logo";
import { chromaticModes } from "../../../.storybook/modes";

const { args, argTypes } = getStorybookHelpers<QGDSLogo>("qgds-logo", { setComponentVariable: true });
type Args = typeof args;

// Sample SVG for demonstrations
const sampleSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Queensland Government crest">
  <title>Queensland Government crest</title>
  <rect width="100" height="100" fill="#003a70"/>
  <circle cx="50" cy="50" r="30" fill="#ffffff"/>
  <text x="50" y="55" text-anchor="middle" fill="#003a70" font-size="20" font-weight="bold">QLD</text>
</svg>`;

const meta: Meta<Args> = {
  title: "Components/Logo",
  component: "qgds-logo",
  tags: ["autodocs"],
  args: {
    ...args,
    variant: "masterbrand",
    src: "",
    alt: "Queensland Government logo",
    "site-name": "",
    "hide-site-name": false,
    "hide-image": false,
    "image-slot": sampleSVG,
  },
  argTypes: {
    ...argTypes,
    variant: {
      control: "select",
      options: ["masterbrand", "subbrand", "co-brand", "endorsed", "standalone"],
      description: "Brand variant affecting layout and styling",
    },
  },
  render: (args) => html`
    <qgds-logo
      id="${ifDefined(args.id)}"
      variant=${ifDefined(args.variant)}
      src=${ifDefined(args.src ?? undefined)}
      alt=${ifDefined(args.alt)}
      site-name=${ifDefined(args["site-name"] ?? undefined)}
      ?hide-site-name=${args["hide-site-name"]}
      ?hide-image=${args["hide-image"]}
    >
      ${args["image-slot"] ? html`<div slot="image">${unsafeHTML(args["image-slot"] as string)}</div>` : null}
    </qgds-logo>
  `,
};

export default meta;
type Story = StoryObj<Args>;

export const Masterbrand: Story = {
  args: {
    ...meta.args,
    variant: "masterbrand",
    "site-name": "Department of Health and Wellbeing",
    //Masterbrand use default fallback logo
    src: "",
    "image-slot": "",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const Subbrand: Story = {
  args: {
    ...meta.args,
    variant: "subbrand",
    "site-name": "Queensland Government",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const CoBrand: Story = {
  args: {
    ...meta.args,
    variant: "co-brand",
    "site-name": "External Organisation",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const Endorsed: Story = {
  args: {
    ...meta.args,
    variant: "endorsed",
    "site-name": "Queensland Government",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const Standalone: Story = {
  args: {
    ...meta.args,
    variant: "standalone",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const WithFallbackLogo: Story = {
  args: {
    ...meta.args,
    variant: "masterbrand",
    src: "", // No src provided
    "image-slot": "", // No slot content
    "site-name": "Department of This and That",
  },
  parameters: {
    ...chromaticModes,
    docs: {
      description: {
        story:
          "When no `src` or `image` slot is provided, the component displays the Queensland Coat of Arms as an inline SVG fallback. The fallback SVG uses `currentColor` and can be styled with CSS custom properties (palettes).",
      },
    },
  },
};

export const WithImageSource: Story = {
  args: {
    ...meta.args,
    src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23003a70'/><circle cx='50' cy='50' r='30' fill='%23ffffff'/></svg>",
    "site-name": "Queensland Government",
    "image-slot": "", // Clear slot when using src
  },
  parameters: {
    ...chromaticModes,
  },
};

export const WithoutSiteName: Story = {
  args: {
    ...meta.args,
    "hide-site-name": true,
  },
  parameters: {
    ...chromaticModes,
  },
};

export const WithoutImage: Story = {
  args: {
    ...meta.args,
    "hide-image": true,
    "site-name": "Department of This and That",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const MultilineSiteName: Story = {
  args: {
    ...meta.args,
    variant: "masterbrand",
    "site-name": "Queensland Department of Communities, Housing and Digital Economy",
  },
  parameters: {
    ...chromaticModes,
  },
};
