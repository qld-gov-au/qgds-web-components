import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSTextInput, tagName } from "./qgds-text-input";
import "./qgds-text-input";

const { args, argTypes, template } = getStorybookHelpers<QGDSTextInput>(tagName);

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Forms/Forms/Text input",
  component: tagName,
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
    label: "Here is the label",
    hint: "This is hint text",
    placeholder: "Hold my place...",
  },
};
