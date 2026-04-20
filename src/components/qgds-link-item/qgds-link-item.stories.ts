import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ICON_NAMES } from "../qgds-icon/icon-names.js";
import type { QgdsLinkItem } from "./qgds-link-item.js";
import "./qgds-link-item.js";

const { args, argTypes, template } = getStorybookHelpers<QgdsLinkItem>("qgds-link-item");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Link Item",
  component: "qgds-link-item",
  tags: ["autodocs"],
  decorators: [
    (story) =>
      html`<ul style="list-style:none;margin:0;padding:0;max-width:320px;">
        ${story()}
      </ul>`,
  ],
  args: {
    ...args,
    label: "Environment and sustainability",
    href: "/topics/environment",
    "icon-name": "arrow-right",
    animation: "leftToRight",
  },
  argTypes: {
    ...argTypes,
    "icon-name": {
      control: { type: "select" },
      options: ["", ...ICON_NAMES],
      labels: { "": "None" },
      table: { category: "Icon" },
    },
    "icon-size": {
      control: { type: "select" },
      options: ["", "sm", "md", "lg", "xl"],
      if: { arg: "icon-name", truthy: true },
      table: { category: "Icon" },
    },
    "trailing-icon": {
      control: "boolean",
      if: { arg: "icon-name", truthy: true },
    },
    stretch: {
      control: "boolean",
      if: { arg: "icon-name", truthy: true },
    },
    "only-icon": {
      control: "boolean",
      if: { arg: "icon-name", truthy: true },
    },
    animation: {
      control: { type: "select" },
      options: ["", "leftToRight", "rightToLeft", "topToBottom", "bottomToTop", "scaleIn", "scaleOut"],
      labels: { "": "None" },
      if: { arg: "disabled", truthy: false },
      table: { category: "Animation" },
    },
  },
  render: (args) => template(args),
};

export default meta;

type Story = StoryObj<Args>;

/** Default link item with arrow-right icon and leftToRight animation. */
export const Default: Story = {
  args: {
    label: "Environment and sustainability",
    href: "/topics/environment",
    "icon-name": "arrow-right",
    animation: "leftToRight",
  },
};

/** Link item with a description shown below the label. */
export const WithDescription: Story = {
  args: {
    label: "Transport and infrastructure",
    href: "/topics/transport",
    "icon-name": "arrow-right",
    animation: "leftToRight",
    description: "Roads, public transport, cycling and walking.",
  },
};

/** Disabled state — the link is not interactive. */
export const Disabled: Story = {
  args: {
    label: "Health and wellbeing",
    href: "/topics/health",
    "icon-name": "arrow-right",
    animation: "leftToRight",
    disabled: true,
  },
};

/** View-all variant — no separator border, positioned after the list. */
export const ViewAll: Story = {
  name: "View All",
  args: {
    label: "View all topics",
    href: "/topics",
    "icon-name": "arrow-right",
    animation: "leftToRight",
    "view-all": true,
  },
};

/** Link item with nested sub-items rendered in the default slot. */
export const WithNestedItems: Story = {
  args: {
    stretch: false,
  },

  name: "With Nested Items",

  render: () => html`
    <qgds-link-item
      label="Environment and sustainability"
      href="/topics/environment"
      icon-name="arrow-right"
      animation="leftToRight"
      stretch
      trailing-icon
    >
      <qgds-link-item
        label="Water quality"
        href="/topics/environment/water"
        icon-name="arrow-right"
        animation="leftToRight"
        stretch
        trailing-icon
      ></qgds-link-item>
      <qgds-link-item
        label="Air quality"
        href="/topics/environment/air"
        icon-name="arrow-right"
        animation="leftToRight"
        stretch
        trailing-icon
      >
        <qgds-link-item
          label="Bad Air quality"
          href="/topics/environment/air"
          icon-name="arrow-right"
          animation="leftToRight"
          stretch
          trailing-icon
        ></qgds-link-item>
        <qgds-link-item
          label="OK Air quality"
          href="/topics/environment/air"
          icon-name="arrow-right"
          animation="leftToRight"
          stretch
          trailing-icon
        ></qgds-link-item>
        <qgds-link-item
          label="Good Air quality"
          href="/topics/environment/air"
          icon-name="arrow-right"
          animation="leftToRight"
          stretch
          trailing-icon
        ></qgds-link-item>
      </qgds-link-item>
      <qgds-link-item
        label="Land management"
        href="/topics/environment/land"
        icon-name="arrow-right"
        animation="leftToRight"
        stretch
        trailing-icon
      ></qgds-link-item>
    </qgds-link-item>
  `,
};
