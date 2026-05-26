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
    "is-label-visible": false,
    "is-stacked": false,
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    ...meta.args,
    "is-label-visible": true,
    label: "Uploading, please wait",
  },
};

export const Stacked: Story = {
  args: {
    ...meta.args,
    "is-label-visible": true,
    "is-stacked": true,
    label: "Uploading...",
  },
};

export const Small: Story = {
  args: {
    ...meta.args,
    size: "sm",
    "is-label-visible": true,
    label: "Uploading...",
  },
};

export const Large: Story = {
  args: {
    ...meta.args,
    size: "lg",
    "is-label-visible": true,
    label: "Uploading...",
  },
};

export const ExtraLarge: Story = {
  args: {
    ...meta.args,
    size: "xl",
    "is-label-visible": true,
    label: "Uploading...",
  },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
      <qgds-loading-spinner size="sm" label="Loading" .isLabelVisible="${true}"></qgds-loading-spinner>
      <qgds-loading-spinner size="md" label="Loading" .isLabelVisible="${true}"></qgds-loading-spinner>
      <qgds-loading-spinner size="lg" label="Loading" .isLabelVisible="${true}"></qgds-loading-spinner>
      <qgds-loading-spinner size="xl" label="Loading" .isLabelVisible="${true}"></qgds-loading-spinner>
    </div>
  `,
};
