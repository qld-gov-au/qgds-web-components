import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./qgds-navigation-item";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { type QGDSNavigationItem, tagName } from "./qgds-navigation-item";

const { args, argTypes, template } = getStorybookHelpers<QGDSNavigationItem>(tagName);
type Args = typeof args;

// Some simple helper
const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ";

const meta: Meta<Args> = {
  title: "Components/Navigation/Navigation item",
  component: tagName,
  args: {
    ...args,
    href: "#",
  },
  argTypes,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: (args) => template(args),
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    label: "Default",
    href: "#",
  },
};

export const IconOnly: Story = {
  args: {
    label: "Home",
    href: "#",
    "icon-name": "home",
    "hide-label": true,
  },
};

export const WithIcon: Story = {
  args: {
    label: "With icon",
    href: "#",
    "icon-name": "wheelchair",
  },
};

export const Active: Story = {
  args: {
    label: "Active",
    href: "#",
    "is-active": true,
  },
};

export const ActiveWithIcon: Story = {
  args: {
    label: "Active with icon",
    href: "#",
    "icon-name": "wheelchair",
    "is-active": true,
  },
};

export const LongLabel: Story = {
  args: {
    label: loremIpsum,
    href: "#",
  },
};

export const LongLabelWithIcon: Story = {
  args: {
    label: loremIpsum,
    href: "#",
    "icon-name": "announcement",
  },
};

export const With1Child: Story = {
  args: {
    label: "I have 1 child",
    href: "#",
  },
  render: (args) => {
    return html`${template(args, html`${template({ ...args, ...Default.args })}`)}`;
  },
};

export const With2Children: Story = {
  args: {
    label: "I have 2 children",
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...LongLabel.args })}`
    )}`;
  },
};

export const With3Children: Story = {
  args: {
    label: "I have 3 children",
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...Active.args })}
      ${template({ ...args, ...WithIcon.args })}`
    )}`;
  },
};

export const With4Children: Story = {
  args: {
    label: "I have 4 children",
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...Active.args })}
      ${template({ ...args, ...LongLabel.args })} ${template({ ...args, ...WithIcon.args })}`
    )}`;
  },
};

export const With5ChildrenAndDescription: Story = {
  args: {
    label: "Full mega menu",
    "view-all-url": "#",
    description: loremIpsum,
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...Active.args })}
      ${template({ ...args, ...LongLabel.args })} ${template({ ...args, ...ActiveWithIcon.args })}
      ${template({ ...args, ...IconOnly.args })}`
    )}`;
  },
};

export const MobileCTA: Story = {
  args: {
    label: "Contact information",
    "icon-name": "phone",
    variant: "mobile-cta",
  },
};
