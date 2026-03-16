import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSCheckboxGroup } from "./qgds-checkbox-group.ts";
import "./qgds-checkbox-group.ts";
import "../qgds-checkbox/qgds-checkbox.ts";

const { args, argTypes } = getStorybookHelpers<QGDSCheckboxGroup>("qgds-checkbox-group");

type Story = StoryObj<typeof args>;

const meta: Meta<typeof args> = {
  title: "Components/QGDS Checkbox Group",
  tags: ["autodocs"],
  args: { ...args, name: "interests" },
  argTypes,
};

export default meta;

export const Default: Story = {
  render: () => html`
    <qgds-checkbox-group
      id="interests"
      name="interests"
      label="Interests"
      hint="Select all that apply."
      @qgds-change=${action("qgds-change")}
    >
      <qgds-checkbox value="design" label="Design"></qgds-checkbox>
      <qgds-checkbox value="code" label="Code"></qgds-checkbox>
      <qgds-checkbox value="research" label="Research"></qgds-checkbox>
    </qgds-checkbox-group>
  `,
};

export const WithError: Story = {
  render: () => html`
    <qgds-checkbox-group
      id="interests-err"
      name="interests"
      label="Interests"
      hint="Select all that apply."
      validation-state="error"
      validation-message="Please select at least one option."
      required
    >
      <qgds-checkbox value="design" label="Design"></qgds-checkbox>
      <qgds-checkbox value="code" label="Code"></qgds-checkbox>
      <qgds-checkbox value="research" label="Research"></qgds-checkbox>
    </qgds-checkbox-group>
  `,
};
