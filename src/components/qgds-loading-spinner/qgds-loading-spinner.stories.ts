import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import "./qgds-loading-spinner";
import type { QGDSLoadingSpinner } from "./qgds-loading-spinner";

const { args, argTypes } = getStorybookHelpers<QGDSLoadingSpinner>("qgds-loading-spinner");

type Args = typeof args;
type Story = StoryObj<Args>;

const storyRender = (args: Args) => {
  const cssProps = Object.fromEntries(
    Object.entries(args)
      .filter(([key]) => key.startsWith("--"))
      .map(([key, val]) => [key, String(val)])
  );
  return html`
    <qgds-loading-spinner
      style=${styleMap(cssProps)}
      size="${ifDefined(args.size)}"
      label="${ifDefined(args.label)}"
      .labelVisible="${args["label-visible"] ?? false}"
      .stacked="${args.stacked ?? false}"
    ></qgds-loading-spinner>
  `;
};

const meta: Meta<Args> = {
  title: "Components/Loading spinner",
  component: "qgds-loading-spinner",
  tags: ["autodocs"],
  args: {
    ...args,
    size: "md",
    label: "Uploading...",
    "label-visible": false,
    stacked: false,
  },
  argTypes,
  render: storyRender,
};

export default meta;

export const Default: Story = {
  args: {
    ...meta.args,
  },
};

export const WithLabel: Story = {
  args: {
    ...meta.args,
    "label-visible": true,
    label: "Uploading, please wait",
  },
};

export const Stacked: Story = {
  args: {
    ...meta.args,
    "label-visible": true,
    stacked: true,
    label: "Uploading...",
  },
};

export const Small: Story = {
  args: {
    ...meta.args,
    size: "sm",
    "label-visible": true,
    label: "Uploading...",
  },
};

export const Large: Story = {
  args: {
    ...meta.args,
    size: "lg",
    "label-visible": true,
    label: "Uploading...",
  },
};

export const ExtraLarge: Story = {
  args: {
    ...meta.args,
    size: "xl",
    "label-visible": true,
    label: "Uploading...",
  },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
      <qgds-loading-spinner size="sm" label="Loading" .labelVisible="${true}"></qgds-loading-spinner>
      <qgds-loading-spinner size="md" label="Loading" .labelVisible="${true}"></qgds-loading-spinner>
      <qgds-loading-spinner size="lg" label="Loading" .labelVisible="${true}"></qgds-loading-spinner>
      <qgds-loading-spinner size="xl" label="Loading" .labelVisible="${true}"></qgds-loading-spinner>
    </div>
  `,
};
