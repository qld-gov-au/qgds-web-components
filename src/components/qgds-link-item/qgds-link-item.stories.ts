import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
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
  },
  argTypes: {
    ...argTypes,
    "icon-name": {
      control: { type: "select" },
      options: ["", "arrow-right", "external-link"],
      labels: { "": "None" },
      table: { category: "Icon" },
    },
    "icon-size": {
      control: { type: "select" },
      options: ["", "sm", "md"],
      if: { arg: "icon-name", truthy: true },
      table: { category: "Icon" },
    },
    animation: {
      control: { type: "select" },
      options: ["", "leftToRight", "rightToLeft", "topToBottom", "bottomToTop", "scaleIn", "scaleOut"],
      labels: { "": "None" },
      if: { arg: "icon-name", truthy: true },
      table: { category: "Icon" },
    },
    hasBorder: {
      control: "boolean",
      table: { category: "Appearance" },
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
    "has-border": true,
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
    "has-border": true,
  },
};

/** Link item with nested sub-items rendered in the default slot. */
export const WithNestedItems: Story = {
  args: {
    label: "Transport and infrastructure",
    href: "/topics/transport",
    animation: "leftToRight",
    "icon-name": "arrow-right",
    "icon-size": "md",
    description: "",
    "has-border": true,
  },

  name: "With Nested Items",

  render: (args) => html`
    <qgds-link-item
      label="${args.label}"
      href="${args.href}"
      icon-name="${args["icon-name"]}"
      animation="${args.animation}"
      icon-size="${args["icon-size"]}"
      description="${args.description}"
      ?has-border="${args["has-border"]}"
    >
      <qgds-link-item
        label="Water quality"
        href="/topics/environment/water"
        icon-name="${args["icon-name"]}"
        animation="${args.animation}"
        icon-size="${args["icon-size"]}"
        description="${args.description}"
        ?has-border="${args["has-border"]}"
      ></qgds-link-item>
      <qgds-link-item
        label="Air quality"
        href="/topics/environment/air"
        icon-name="${args["icon-name"]}"
        animation="${args.animation}"
        icon-size="${args["icon-size"]}"
        description="${args.description}"
        ?has-border="${args["has-border"]}"
      >
        <qgds-link-item
          label="Bad Air quality"
          href="/topics/environment/air"
          icon-name="${args["icon-name"]}"
          animation="${args.animation}"
          icon-size="${args["icon-size"]}"
          description="${args.description}"
          ?has-border="${args["has-border"]}"
        ></qgds-link-item>
        <qgds-link-item
          label="OK Air quality"
          href="/topics/environment/air"
          icon-name="${args["icon-name"]}"
          animation="${args.animation}"
          icon-size="${args["icon-size"]}"
          description="${args.description}"
          ?has-border="${args["has-border"]}"
        ></qgds-link-item>
        <qgds-link-item
          label="Good Air quality"
          href="/topics/environment/air"
          icon-name="${args["icon-name"]}"
          animation="${args.animation}"
          icon-size="${args["icon-size"]}"
          description="${args.description}"
          ?has-border="${args["has-border"]}"
        ></qgds-link-item>
      </qgds-link-item>
      <qgds-link-item
        label="Land management"
        href="/topics/environment/land"
        icon-name="${args["icon-name"]}"
        animation="${args.animation}"
        icon-size="${args["icon-size"]}"
        description="${args.description}"
        ?has-border="${args["has-border"]}"
      ></qgds-link-item>
    </qgds-link-item>
  `,
};
