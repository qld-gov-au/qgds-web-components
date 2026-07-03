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
    label: "Uploading...",
    "hide-label": false,
    "is-stacked": false,
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    "hide-label": true,
    label: "Uploading, please wait",
  },
};

export const Stacked: Story = {
  args: {
    "hide-label": false,
    "is-stacked": true,
    label: "Uploading...",
  },
};

export const LongText: Story = {
  args: {
    label: "Your application is being processed.",
  },
  decorators: [(Story) => html`<div style="width: 200px;">${Story()}</div>`],
};
