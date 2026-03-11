import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSRadioGroup } from "./qgds-radio-group.ts";
import "./qgds-radio-group.ts";
import "../qgds-radio/qgds-radio.ts";
import "../qgds-form-field/qgds-form-field.ts";

const { args, argTypes } = getStorybookHelpers<QGDSRadioGroup>("qgds-radio-group");

type Story = StoryObj<typeof args>;

const meta: Meta<typeof args> = {
  title: "Components/QGDS Radio Group",
  tags: ["autodocs"],
  args: { ...args, name: "priority" },
  argTypes,
};

export default meta;

export const Default: Story = {
  render: () => html`
    <qgds-form-field label="Priority" hint="Choose one option.">
      <qgds-radio-group name="priority" @qgds-change=${action("qgds-change")}>
        <qgds-radio value="low"    label="Low"></qgds-radio>
        <qgds-radio value="medium" label="Medium" checked></qgds-radio>
        <qgds-radio value="high"   label="High"></qgds-radio>
      </qgds-radio-group>
    </qgds-form-field>
  `,
};

export const WithError: Story = {
  render: () => html`
    <qgds-form-field
      label="Priority"
      hint="Choose one option."
      status="error"
      message="Please select a priority level."
      required
    >
      <qgds-radio-group name="priority-err" @qgds-change=${action("qgds-change")}>
        <qgds-radio value="low"    label="Low"    status="error"></qgds-radio>
        <qgds-radio value="medium" label="Medium" status="error"></qgds-radio>
        <qgds-radio value="high"   label="High"   status="error"></qgds-radio>
      </qgds-radio-group>
    </qgds-form-field>
  `,
};
