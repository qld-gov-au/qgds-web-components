import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSSearchInput, tagName } from "./qgds-search-input";
import "./qgds-search-input";

const { args, argTypes, template } = getStorybookHelpers<QGDSSearchInput>(tagName);

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Search input",
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
    placeholder: "Search",
  },
};

export const IconOnly: Story = {
  args: {
    ...args,
    "icon-only": true,
    placeholder: "Search",
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    variant: "filled",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: "Queensland",
  },
};
