import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import { QGDSTextarea, tagName } from "./qgds-textarea";
import "./qgds-textarea";

const { args, argTypes, template } = getStorybookHelpers<QGDSTextarea>(tagName);

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Forms/Textarea",
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
    id: "my-text-area",
    label: "Here is the label",
    hint: "This is hint text",
    placeholder: "Hold my place...",
  },
};
