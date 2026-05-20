import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ICON_NAMES } from "../qgds-icon/icon-names.js";
import type { QGDSLink } from "./qgds-link.js";
import "./qgds-link.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSLink>("qgds-link");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Link",
  component: "qgds-link",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Continue",
    href: "/next",
    "icon-size": "md",
  },
  argTypes: {
    ...argTypes,
    "icon-name": {
      control: { type: "select" },
      options: ["", ...ICON_NAMES],
      labels: { "": "None" },
      table: {
        category: "Icon",
      },
    },
    "icon-size": {
      control: { type: "select" },
      options: ["", "sm", "md", "lg", "xl"],
      if: { arg: "icon-name", truthy: true },
      table: {
        category: "Icon",
      },
    },
    "has-trailing-icon": {
      control: "boolean",
      if: { arg: "icon-name", truthy: true },
      table: {
        category: "Icon",
      },
    },
    stretch: {
      control: "boolean",
      if: { arg: "icon-name", truthy: true },
      table: {
        category: "Icon",
      },
    },
    animation: {
      control: { type: "select" },
      options: ["", "leftToRight", "rightToLeft", "topToBottom", "bottomToTop", "scaleIn", "scaleOut"],
      labels: { "": "None" },
      if: { arg: "icon-name", truthy: true },
      table: {
        category: "Icon Animation",
      },
    },
    "only-icon": {
      control: "boolean",
      if: { arg: "icon-name", truthy: true },
      table: {
        category: "Icon",
      },
    },
  },
  render: (args) => template(args),
};

export default meta;

type Story = StoryObj<Args>;

/** Default link without an icon. */
export const Default: Story = {
  args: {
    label: "qgds link",
    href: "#",
  },
};

/** Link with a leading icon. */
export const WithIcon: Story = {
  args: {
    label: "Read more",
    href: "#",
    "icon-name": "arrow-right",
  },
};

/** Link stretched to fill its container with a trailing icon. */
export const Stretch: Story = {
  args: {
    label: "Read more",
    href: "#",
    "icon-name": "arrow-right",
    "has-trailing-icon": true,
    stretch: true,
  },
};

/** Icon-only link with a visually hidden label for screen readers. */
export const IconOnly: Story = {
  name: "Icon Only",
  args: {
    label: "Edit",
    href: "/edit",
    "icon-name": "edit",
    "only-icon": true,
  },
};

/** Disabled state — prevents navigation and events. */
export const Disabled: Story = {
  args: {
    label: "Unavailable",
    href: "/next",
    "icon-name": "lock",
    "is-disabled": true,
  },
};

/** All icon animation variants side by side. */
export const Animated: Story = {
  args: {
    href: "#",
    "icon-name": "calendar",
    "has-trailing-icon": true,
    iconSize: "md",
    stretch: true,
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <qgds-link
        label="leftToRight"
        href="#"
        icon-name="${args["icon-name"]}"
        icon-size="${args["icon-size"]}"
        ?stretch="${args.stretch}"
        ?has-trailing-icon="${args["has-trailing-icon"]}"
        animation="leftToRight"
      >
      </qgds-link>
      <qgds-link
        label="rightToLeft"
        href="#"
        icon-name="${args["icon-name"]}"
        icon-size="${args["icon-size"]}"
        ?stretch="${args.stretch}"
        ?has-trailing-icon="${args["has-trailing-icon"]}"
        animation="rightToLeft"
      >
      </qgds-link>
      <qgds-link
        label="topToBottom"
        href="#"
        icon-name="${args["icon-name"]}"
        icon-size="${args["icon-size"]}"
        ?stretch="${args.stretch}"
        ?has-trailing-icon="${args["has-trailing-icon"]}"
        animation="topToBottom"
      >
      </qgds-link>
      <qgds-link
        label="bottomToTop"
        href="#"
        icon-name="${args["icon-name"]}"
        icon-size="${args["icon-size"]}"
        ?stretch="${args.stretch}"
        ?has-trailing-icon="${args["has-trailing-icon"]}"
        animation="bottomToTop"
      >
      </qgds-link>
      <qgds-link
        label="scaleIn"
        href="#"
        icon-name="${args["icon-name"]}"
        icon-size="${args["icon-size"]}"
        ?stretch="${args.stretch}"
        ?has-trailing-icon="${args["has-trailing-icon"]}"
        animation="scaleIn"
      >
      </qgds-link>
      <qgds-link
        label="scaleOut"
        href="#"
        icon-name="${args["icon-name"]}"
        icon-size="${args["icon-size"]}"
        ?stretch="${args.stretch}"
        ?has-trailing-icon="${args["has-trailing-icon"]}"
        animation="scaleOut"
      >
      </qgds-link>
    </div>
  `,
};
