import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSRadioGroup } from "./qgds-radio-group.ts";
import "./qgds-radio-group.ts";
import "../qgds-radio/qgds-radio.ts";

const { args, argTypes } = getStorybookHelpers<QGDSRadioGroup>("qgds-radio-group");

type Story = StoryObj<typeof args>;

const meta: Meta<typeof args> = {
  title: "Components/Forms/Radio Group",
  component: "qgds-radio-group",
  tags: ["autodocs"],
  args: { ...args, name: "priority" },
  argTypes,
};

export default meta;

export const Default: Story = {
  render: () => html`
    <qgds-radio-group
      id="priority"
      name="priority"
      label="Priority"
      hint="Choose one option."
      @qgds-change=${action("qgds-change")}
    >
      <qgds-radio value="low" label="Low"></qgds-radio>
      <qgds-radio value="medium" label="Medium" checked></qgds-radio>
      <qgds-radio value="high" label="High"></qgds-radio>
    </qgds-radio-group>
  `,
};

export const WithError: Story = {
  render: () => html`
    <qgds-radio-group
      id="priority-err"
      name="priority-err"
      label="Priority"
      hint="Choose one option."
      validation-state="error"
      validation-message="Please select a priority level."
      required
      @qgds-change=${action("qgds-change")}
    >
      <qgds-radio value="low" label="Low"></qgds-radio>
      <qgds-radio value="medium" label="Medium"></qgds-radio>
      <qgds-radio value="high" label="High"></qgds-radio>
    </qgds-radio-group>
  `,
};
