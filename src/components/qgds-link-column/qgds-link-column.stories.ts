import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSLinkColumn } from "./qgds-link-column.js";
import "./qgds-link-column.js";
import "../qgds-link-item/qgds-link-item.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSLinkColumn>("qgds-link-column");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Link Column",
  component: "qgds-link-column",
  tags: ["autodocs"],
  args: {
    ...args,
    "aria-label": "Important services",
    "aria-role": "navigation",
  },
  argTypes: {
    ...argTypes,
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item label="Pay a fine" href="#"></qgds-link-item>
        <qgds-link-item label="Register to vote" href="#"></qgds-link-item>
        <qgds-link-item label="Apply for a grant" href="#"></qgds-link-item>
        <qgds-link-item label="Book a health appointment" href="#"></qgds-link-item>
        <qgds-link-item label="Renew your passport" href="#"></qgds-link-item>
        <qgds-link-item label="Update your address" href="#"></qgds-link-item>
        <qgds-link-item label="Apply for a business licence" href="#"></qgds-link-item>
        <qgds-link-item label="Check your rates" href="#"></qgds-link-item>
        <qgds-link-item label="Report an issue" href="#"></qgds-link-item>
        <qgds-link-item label="Access your tax records" href="#"></qgds-link-item>
        <qgds-link-item label="Find a service centre" href="#"></qgds-link-item>
        <qgds-link-item label="Submit a complaint" href="#"></qgds-link-item>
      `
    ),
};

export default meta;

type Story = StoryObj<Args>;

/** Default link column with vertical multi-column layout. */
export const Default: Story = {
  args: {
    columns: 1,
  },
};

/** Two-column layout with description text on each item. */
export const TwoColumns: Story = {
  args: {
    columns: 2,
  },
};

/** Three-column vertical layout with many links — a typical popular services component. */
export const ThreeColumns: Story = {
  args: {
    columns: 3,
  },
};

/** Three-column horizontal layout — links flow left-to-right across columns. */
export const ThreeColumnsHorizontal: Story = {
  args: {
    columns: 3,
    direction: "horizontal",
  },
};
