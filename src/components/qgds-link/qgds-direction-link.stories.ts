import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QgdsLink } from "./qgds-link.js";
import "./qgds-link.js";

const { args, argTypes, template } = getStorybookHelpers<QgdsLink>("qgds-link");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Direction Link",
  component: "qgds-link",
  args: {
    ...args,
    label: "Direction",
    href: "#",
  },
  argTypes,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    "icon-name": "arrow-right",
    "trailing-icon": true,
    "icon-size": "sm",
  },
  render: (args) => template(args),
};

/** All four directional variants. */
export const AllVariants: Story = {
  name: "All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <qgds-link
        label="${args.label}"
        href="${args.href}"
        icon-name="arrow-down"
        icon-size="${args["icon-size"]}"
        trailing-icon
        animation="topToBottom"
      ></qgds-link>
      <qgds-link
        label="${args.label}"
        href="${args.href}"
        icon-name="arrow-left"
        icon-size="${args["icon-size"]}"
        animation="rightToLeft"
      ></qgds-link>
      <qgds-link
        label="${args.label}"
        href="${args.href}"
        icon-name="arrow-right"
        icon-size="${args["icon-size"]}"
        trailing-icon
        animation="leftToRight"
      ></qgds-link>
      <qgds-link
        label="${args.label}"
        href="${args.href}"
        icon-name="arrow-up"
        icon-size="${args["icon-size"]}"
        trailing-icon
        animation="bottomToTop"
      ></qgds-link>
    </div>
  `,
};
