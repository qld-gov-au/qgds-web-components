import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import { withEventActions } from "../../../../.storybook/storybook-helpers";
import type { QGDSRadioGroup } from "./qgds-radio-group";
import "./qgds-radio-group";
import "../qgds-radio/qgds-radio";

const { args, argTypes, template } = getStorybookHelpers<QGDSRadioGroup>("qgds-radio-group");

type StoryArgs = typeof args;
type Story = StoryObj<StoryArgs>;

const slot = html`
  <qgds-radio value="low" label="Low"></qgds-radio>
  <qgds-radio value="medium" label="Medium"></qgds-radio>
  <qgds-radio value="high" label="High"></qgds-radio>
`;

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Radio Group",
  component: "qgds-radio-group",
  tags: ["autodocs"],
  args: {
    ...args,
    id: "priority",
    name: "priority",
    label: "Priority",
    hint: "Choose one option.",
    size: "lg",
    "indicate-if": "required",
  },
  argTypes: {
    ...argTypes,
    size: {
      control: { type: "select" },
      options: ["sm", "lg"],
    },
    "indicate-if": {
      control: { type: "select" },
      options: ["required", "optional", "none"],
    },
  },
  decorators: [withEventActions("qgds-change")],
  render: (storyArgs) => template(storyArgs, slot),
};

export default meta;

// ── Medium (default) variants ──────────────────────────────────────────────

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
    "indicate-if": "required",
  },
};

export const Optional: Story = {
  args: {
    required: false,
    "indicate-if": "optional",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Success: Story = {
  args: {
    "validation-state": "success",
    "validation-message": "Looks good.",
  },
};

export const WithError: Story = {
  args: {
    required: true,
    "validation-state": "error",
    "validation-message": "Please select a priority level.",
  },
};

// ── Small variants ─────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "sm" },
};

export const SmallSuccess: Story = {
  name: "Small / Success",
  args: {
    size: "sm",
    "validation-state": "success",
    "validation-message": "Looks good.",
  },
};

export const SmallDisabled: Story = {
  name: "Small / Disabled",
  args: {
    size: "sm",
    disabled: true,
  },
};
