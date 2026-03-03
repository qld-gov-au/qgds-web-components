import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import { QGDSTextInput } from "./qgds-text-input";
import "./qgds-text-input";

const { args, argTypes, template } = getStorybookHelpers<QGDSTextInput>("qgds-text-input");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Forms/Text input",
  component: "Text input",
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {
  args: {
    ...args,
    id: "my-text-input",
  },
};
