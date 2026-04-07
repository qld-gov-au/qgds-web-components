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
  argTypes: {
    ...argTypes,
  },

  render: (args) => template(args),
};
export default meta;

export const Default: Story = {
  args: {
    "default-slot": "<p>This is an important blockquote message.</p>",
  },
};
