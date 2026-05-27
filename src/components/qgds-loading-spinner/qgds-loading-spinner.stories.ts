import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import "./qgds-loading-spinner";
import type { QGDSLoadingSpinner } from "./qgds-loading-spinner";

const { args, argTypes, template } = getStorybookHelpers<QGDSLoadingSpinner>("qgds-loading-spinner");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Loading spinner",
  component: "qgds-loading-spinner",
  tags: ["autodocs"],
  args: {
    ...args,
    size: "md",
    label: "Uploading...",
    "hide-label": false,
    "is-stacked": false,
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {};

export const WithOutLabel: Story = {
  args: {
    ...meta.args,
    "hide-label": true,
    label: "Uploading, please wait",
  },
};

export const Stacked: Story = {
  args: {
    ...meta.args,
    "hide-label": false,
    "is-stacked": true,
    label: "Uploading...",
  },
};

export const Small: Story = {
  args: {
    ...meta.args,
    size: "sm",
    "hide-label": false,
    label: "Uploading...",
  },
};

export const Large: Story = {
  args: {
    ...meta.args,
    size: "lg",
    "hide-label": false,
    label: "Uploading...",
  },
};

export const ExtraLarge: Story = {
  args: {
    ...meta.args,
    size: "xl",
    "hide-label": false,
    label: "Uploading...",
  },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
      <qgds-loading-spinner size="sm" label="Loading" .hideLabel="${false}"></qgds-loading-spinner>
      <qgds-loading-spinner size="md" label="Loading" .hideLabel="${false}"></qgds-loading-spinner>
      <qgds-loading-spinner size="lg" label="Loading" .hideLabel="${false}"></qgds-loading-spinner>
      <qgds-loading-spinner size="xl" label="Loading" .hideLabel="${false}"></qgds-loading-spinner>
    </div>
  `,
};
