import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QgdsDirectionLink } from "./qgds-direction-link.js";
import "./qgds-direction-link.js";

const { args, argTypes, template } = getStorybookHelpers<QgdsDirectionLink>("qgds-direction-link");

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
    trailing: true,
    animation: true,
  },
  argTypes: {
    ...argTypes,
    direction: {
      control: { type: "select" },
      options: ["up", "down", "left", "right"],
    },
    trailing: {
      control: "boolean",
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
    trailing: true,
  },
};

/** All four directional variants. */
export const AllVariants: Story = {
  name: "All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <qgds-direction-link label="${args.label}" href="${args.href}" direction="down" trailing></qgds-direction-link>
      <qgds-direction-link label="${args.label}" href="${args.href}" direction="left"></qgds-direction-link>
      <qgds-direction-link label="${args.label}" href="${args.href}" direction="right" trailing></qgds-direction-link>
      <qgds-direction-link label="${args.label}" href="${args.href}" direction="up" trailing></qgds-direction-link>
    </div>
  `,
};
