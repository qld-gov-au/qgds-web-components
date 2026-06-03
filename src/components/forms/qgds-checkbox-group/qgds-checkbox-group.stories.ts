import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import { withEventActions } from "../../../../.storybook/storybook-helpers";
import type { QGDSCheckboxGroup } from "./qgds-checkbox-group";
import "./qgds-checkbox-group";
import "../qgds-checkbox/qgds-checkbox";

const { args, argTypes, template } = getStorybookHelpers<QGDSCheckboxGroup>("qgds-checkbox-group");

type StoryArgs = typeof args;
type Story = StoryObj<StoryArgs>;

const slot = html`
  <qgds-checkbox value="design" label="Design"></qgds-checkbox>
  <qgds-checkbox value="code" label="Code"></qgds-checkbox>
  <qgds-checkbox value="research" label="Research"></qgds-checkbox>
`;

const meta: Meta<StoryArgs> = {
  title: "Components/Forms/Checkbox Group",
  component: "qgds-checkbox-group",
  tags: ["autodocs"],
  args: {
    ...args,
    id: "interests",
    name: "interests",
    label: "Interests",
    hint: "Select all that apply.",
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
    "validation-message": "Please select at least one option.",
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
