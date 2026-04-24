import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { QGDSDirectionLink } from "./qgds-direction-link.js";
import "./qgds-direction-link.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSDirectionLink>("qgds-direction-link");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Direction Link",
  component: "qgds-direction-link",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Direction",
    href: "#",
    direction: "right",
    animation: true,
  },
  argTypes: {
    ...argTypes,
    direction: {
      control: { type: "select" },
      options: ["up", "down", "left", "right"],
    },
    animation: {
      control: "boolean",
    },
  },
  render: (args) => template(args),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    direction: "right",
  },
};
