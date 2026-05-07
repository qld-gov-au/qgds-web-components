import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import type { QGDSRadioGroup } from "./qgds-radio-group";
import "./qgds-radio-group";
import "../qgds-radio/qgds-radio";

const { args, argTypes } = getStorybookHelpers<QGDSRadioGroup>("qgds-radio-group");

type StoryArgs = typeof args;
type Story = StoryObj<StoryArgs>;

const renderGroup = (storyArgs: StoryArgs) => html`
  <qgds-radio-group
    id=${ifDefined(storyArgs.id ?? "priority")}
    name=${ifDefined(storyArgs.name ?? "priority")}
    label=${ifDefined(storyArgs.label ?? "Priority")}
    hint=${ifDefined(storyArgs.hint ?? "Choose one option.")}
    size=${ifDefined(storyArgs.size ?? "lg")}
    indicate-if=${ifDefined(storyArgs["indicate-if"])}
    validation-state=${ifDefined(storyArgs["validation-state"])}
    validation-message=${ifDefined(storyArgs["validation-message"])}
    ?required=${storyArgs.required}
    ?disabled=${storyArgs.disabled}
    @qgds-change=${action("qgds-change")}
  >
    <qgds-radio value="low" label="Low"></qgds-radio>
    <qgds-radio value="medium" label="Medium"></qgds-radio>
    <qgds-radio value="high" label="High"></qgds-radio>
  </qgds-radio-group>
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
  render: renderGroup,
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
