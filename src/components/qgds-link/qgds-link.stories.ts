import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import "./qgds-link.js";
import { ICON_NAMES } from "../qgds-icon/icon-names.js";
import type { IconSize } from "./qgds-link.js";

const meta: Meta = {
  title: "Components/Link",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    href: { control: "text" },
    disabled: { control: "boolean" },
    iconName: {
      control: { type: "select" },
      options: ["", ...ICON_NAMES],
      labels: { "": "None" },
      table: {
        category: "Icon",
      },
    },
    iconSize: {
      control: { type: "select" },
      options: ["", "sm", "md", "lg", "xl"],
      if: { arg: "iconName", truthy: true },
      table: {
        category: "Icon",
      },
    },
    trailingIcon: {
      control: "boolean",
      if: { arg: "iconName", truthy: true },
      table: {
        category: "Icon",
      },
    },
    stretch: {
      control: "boolean",
      if: { arg: "iconName", truthy: true },
      table: {
        category: "Icon",
      },
    },
    animation: {
      control: { type: "select" },
      options: ["", "leftToRight", "rightToLeft", "topToBottom", "bottomToTop", "scaleIn", "scaleOut"],
      labels: { "": "None" },
      if: { arg: "disabled", truthy: false },
      table: {
        category: "Animation",
      },
    },
    onlyIcon: {
      control: "boolean",
      if: { arg: "iconName", truthy: true },
      table: {
        category: "Icon",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const link = (args: Record<string, unknown>) => html`
  <qgds-link
    .label=${args.label}
    .href=${args.href}
    .iconName=${args.iconName}
    .iconSize=${args.iconSize as IconSize}
    .animation=${ifDefined(!args.disabled && args.href ? args.animation : undefined)}
    ?disabled=${args.disabled}
    ?trailing-icon=${args.trailingIcon}
    ?stretch=${args.stretch}
    ?only-icon=${args.onlyIcon}
  ></qgds-link>
`;

const defaultArgs = {
  label: "Continue",
  href: "/next",
  disabled: false,
  iconName: "car",
  iconSize: "" as IconSize,
  trailingIcon: false,
  stretch: false,
  animation: "",
  onlyIcon: false,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
  render: (args) => link(args),
};

export const WithIcon: Story = {
  args: {
    ...defaultArgs,
    label: "Read more",
    href: "/more",
    iconName: "arrow-right",
  },
  render: (args) => link(args),
};

export const Stretch: Story = {
  args: {
    ...defaultArgs,
    label: "Read more",
    href: "/more",
    iconName: "arrow-right",
    trailingIcon: true,
    stretch: true,
  },
  render: (args) => link(args),
};

export const Animated: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <qgds-link
        label="leftToRight"
        href="#"
        icon-name="calendar"
        stretch
        trailing-icon
        animation="leftToRight"
      ></qgds-link>
      <qgds-link
        label="rightToLeft"
        href="#"
        icon-name="calendar"
        stretch
        trailing-icon
        animation="rightToLeft"
      ></qgds-link>
      <qgds-link
        label="topToBottom"
        href="#"
        icon-name="calendar"
        stretch
        trailing-icon
        animation="topToBottom"
      ></qgds-link>
      <qgds-link
        label="bottomToTop"
        href="#"
        icon-name="calendar"
        stretch
        trailing-icon
        animation="bottomToTop"
      ></qgds-link>
      <qgds-link label="scaleIn" href="#" icon-name="calendar" stretch trailing-icon animation="scaleIn"></qgds-link>
      <qgds-link label="scaleOut" href="#" icon-name="calendar" stretch trailing-icon animation="scaleOut"></qgds-link>
    </div>
  `,
};

export const IconOnly: Story = {
  name: "Icon Only",
  args: {
    ...defaultArgs,
    label: "Edit",
    href: "/edit",
    iconName: "edit",
    onlyIcon: true,
  },
  render: (args) => link(args),
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    label: "Unavailable",
    href: "/next",
    iconName: "lock",
    disabled: true,
  },
  render: (args) => link(args),
};
