import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import type { QGDSBlockquote } from "./qgds-blockquote";
import "./qgds-blockquote";

const { args, argTypes, template } = getStorybookHelpers<QGDSBlockquote>("qgds-blockquote");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Blockquote",
  component: "qgds-blockquote",
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => template(args),
  parameters: {
    chromatic: {
      //🔶 Test default story in all different modes
      modes: {
        default: { globalPalette: "default" },
        soft: { globalPalette: "soft" },
        muted: { globalPalette: "muted" },
        bold: { globalPalette: "bold" },
        deep: { globalPalette: "deep" },
      },
    },
  },
};
export default meta;

export const Default: Story = {
  args: {
    "default-slot":
      "<p>The goal of the Web is to serve humanity. We build it now so that those who come to it later will be able to create things we cannot ourselves imagine.</p>",
    "cite-label": "Sir Tim Berners-Lee",
    "cite-url": "https://example.com/source",
  },
};
