import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import type { QGDSCheckboxGroup } from "./qgds-checkbox-group";
import "./qgds-checkbox-group";
import "../qgds-checkbox/qgds-checkbox";

const { args, argTypes } = getStorybookHelpers<QGDSCheckboxGroup>("qgds-checkbox-group");

type StoryArgs = typeof args;
type Story = StoryObj<StoryArgs>;

const renderGroup = (storyArgs: StoryArgs) => html`
  <qgds-checkbox-group
    id=${ifDefined(storyArgs.id ?? "interests")}
    name=${ifDefined(storyArgs.name ?? "interests")}
    label=${ifDefined(storyArgs.label ?? "Interests")}
    hint=${ifDefined(storyArgs.hint ?? "Select all that apply.")}
    size=${ifDefined(storyArgs.size ?? "large")}
    indicate-if=${ifDefined(storyArgs["indicate-if"])}
    validation-state=${ifDefined(storyArgs["validation-state"])}
    validation-message=${ifDefined(storyArgs["validation-message"])}
    ?required=${storyArgs.required}
    ?disabled=${storyArgs.disabled}
    @qgds-change=${action("qgds-change")}
  >
    <qgds-checkbox value="design" label="Design"></qgds-checkbox>
    <qgds-checkbox value="code" label="Code"></qgds-checkbox>
    <qgds-checkbox value="research" label="Research"></qgds-checkbox>
  </qgds-checkbox-group>
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
    size: "large",
    "indicate-if": "required",
  },
  argTypes: {
    ...argTypes,
    size: {
      control: { type: "select" },
      options: ["small", "large"],
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
    "validation-message": "Please select at least one option.",
  },
};

// ── Small variants ─────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "small" },
};

export const SmallSuccess: Story = {
  name: "Small / Success",
  args: {
    size: "small",
    "validation-state": "success",
    "validation-message": "Looks good.",
  },
};

export const SmallDisabled: Story = {
  name: "Small / Disabled",
  args: {
    size: "small",
    disabled: true,
  },
};
