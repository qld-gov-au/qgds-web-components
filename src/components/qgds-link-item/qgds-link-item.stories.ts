import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { ICON_NAMES } from "../qgds-icon/icon-names.js";
import "./qgds-link-item.js";

const meta: Meta = {
  title: "Components/Link Item",
  tags: ["autodocs"],
  decorators: [
    (story) =>
      html`<ul style="list-style:none;margin:0;padding:0;max-width:320px;">
        ${story()}
      </ul>`,
  ],
  argTypes: {
    label: { control: "text" },
    href: { control: "text" },
    description: { control: "text" },
    disabled: { control: "boolean" },
    viewAll: { control: "boolean" },
    iconName: {
      control: { type: "select" },
      options: ["", ...ICON_NAMES],
      labels: { "": "None" },
      table: { category: "Icon" },
    },
    iconSize: {
      control: { type: "select" },
      options: ["", "sm", "md", "lg", "xl"],
      if: { arg: "iconName", truthy: true },
      table: { category: "Icon" },
    },
    trailingIcon: {
      control: "boolean",
      if: { arg: "iconName", truthy: true },
    },
    stretch: {
      control: "boolean",
      if: { arg: "iconName", truthy: true },
    },
    onlyIcon: {
      control: "boolean",
      if: { arg: "iconName", truthy: true },
    },
    animation: {
      control: { type: "select" },
      options: ["", "leftToRight", "rightToLeft", "topToBottom", "bottomToTop", "scaleIn", "scaleOut"],
      labels: { "": "None" },
      if: { arg: "disabled", truthy: false },
      table: { category: "Animation" },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    label: "Environment and sustainability",
    href: "/topics/environment",
    iconName: "arrow-right",
    iconSize: "",
    animation: "leftToRight",
    description: "",
    disabled: false,
    viewAll: false,
    stretch: false,
    trailingIcon: false,
    onlyIcon: false,
  },
  render: (args) => html`
    <qgds-link-item
      label=${args.label}
      href=${args.href}
      icon-name=${args.iconName}
      icon-size=${ifDefined(args.iconSize ?? undefined)}
      animation=${args.animation}
      ?disabled=${args.disabled}
      ?view-all=${args.viewAll}
      ?stretch=${args.stretch}
      ?trailing-icon=${args.trailingIcon}
      ?only-icon=${args.onlyIcon}
      .description=${args.description}
    ></qgds-link-item>
  `,
};

export const WithDescription: Story = {
  args: {
    label: "Transport and infrastructure",
    href: "/topics/transport",
    iconName: "arrow-right",
    iconSize: "",
    animation: "leftToRight",
    description: "Roads, public transport, cycling and walking.",
    disabled: false,
    viewAll: false,
    stretch: false,
    trailingIcon: false,
    onlyIcon: false,
  },
  render: (args) => html`
    <qgds-link-item
      label=${args.label}
      href=${args.href}
      icon-name=${args.iconName}
      icon-size=${ifDefined(args.iconSize ?? undefined)}
      animation=${args.animation}
      .description=${args.description}
      ?disabled=${args.disabled}
      ?stretch=${args.stretch}
      ?trailing-icon=${args.trailingIcon}
      ?only-icon=${args.onlyIcon}
    ></qgds-link-item>
  `,
};

export const Disabled: Story = {
  args: {
    label: "Health and wellbeing",
    href: "/topics/health",
    iconName: "arrow-right",
    iconSize: "",
    animation: "leftToRight",
    description: "",
    disabled: true,
    viewAll: false,
    stretch: false,
    trailingIcon: false,
    onlyIcon: false,
  },
  render: (args) => html`
    <qgds-link-item
      label=${args.label}
      href=${args.href}
      icon-name=${args.iconName}
      icon-size=${ifDefined(args.iconSize ?? undefined)}
      animation=${args.animation}
      ?disabled=${args.disabled}
      ?stretch=${args.stretch}
      ?trailing-icon=${args.trailingIcon}
      ?only-icon=${args.onlyIcon}
    ></qgds-link-item>
  `,
};

export const ViewAll: Story = {
  name: "View All",
  args: {
    label: "View all topics",
    href: "/topics",
    iconName: "arrow-right",
    iconSize: "",
    animation: "leftToRight",
    description: "",
    disabled: false,
    viewAll: true,
    stretch: false,
    trailingIcon: false,
    onlyIcon: false,
  },
  render: (args) => html`
    <qgds-link-item
      label=${args.label}
      href=${args.href}
      icon-name=${args.iconName}
      icon-size=${ifDefined(args.iconSize ?? undefined)}
      animation=${args.animation}
      ?view-all=${args.viewAll}
      ?stretch=${args.stretch}
      ?trailing-icon=${args.trailingIcon}
      ?only-icon=${args.onlyIcon}
    ></qgds-link-item>
  `,
};

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
