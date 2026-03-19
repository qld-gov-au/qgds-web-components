import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import "./qgds-inpage-alert";
import type { QGDSInpageAlert } from "./qgds-inpage-alert";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

// The type parameter helps TypeScript understand your component's API
const { args, argTypes, template } = getStorybookHelpers<QGDSInpageAlert>("qgds-inpage-alert");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/In-page alert",
  component: "qgds-inpage-alert",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `## \`<qgds-inpage-alert>\`
        
In-page alerts are a helpful tool for informing users about essential updates or modifications on a webpage, all while capturing their attention without disrupting their ongoing task.

Usually positioned at the top of a page after a submit action, these alerts are designed to be noticeable yet unobtrusive.`,
      },
    },
  },
  args: {
    ...args,
    heading: "Here is the heading",
    "default-slot": "<span>And here is the content.</span>",
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const Info: Story = {
  args: {
    ...meta.args,
    variant: "info",
  },
};

export const AllVariants: Story = {
  decorators: [
    (story) => {
      return html`<div>
        <style>
          qgds-inpage-alert:not(:last-child) {
            margin-bottom: 20px;
          }</style
        >${story()}
      </div>`;
    },
  ],
  render: (args) => {
    return html`
      <qgds-inpage-alert heading="${args.heading}" variant="info">
        ${unsafeHTML(args["default-slot"] as string)}
      </qgds-inpage-alert>

      <qgds-inpage-alert heading="${args.heading}" variant="error">
        ${unsafeHTML(args["default-slot"] as string)}
      </qgds-inpage-alert>

      <qgds-inpage-alert heading="${args.heading}" variant="success">
        ${unsafeHTML(args["default-slot"] as string)}
      </qgds-inpage-alert>

      <qgds-inpage-alert heading="${args.heading}" variant="warning">
        ${unsafeHTML(args["default-slot"] as string)}
      </qgds-inpage-alert>
    `;
  },
};

export const AllVariantsSoft: Story = {
  ...AllVariants,
  globals: { globalPalette: "soft" },
};

export const AllVariantsMuted: Story = {
  ...AllVariants,
  globals: { globalPalette: "muted" },
};

export const AllVariantsBold: Story = {
  ...AllVariants,
  globals: { globalPalette: "bold" },
};

export const AllVariantsDeep: Story = {
  ...AllVariants,
  globals: { globalPalette: "deep" },
};
