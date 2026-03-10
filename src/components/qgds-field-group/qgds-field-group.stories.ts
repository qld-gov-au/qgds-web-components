import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSFieldGroup } from "./qgds-field-group.ts";
import "./qgds-field-group.ts";
import "../qgds-checkbox/qgds-checkbox.ts";
import "../qgds-radio/qgds-radio.ts";
import "../qgds-form-field/qgds-form-field.ts";

const { args, argTypes } =
  getStorybookHelpers<QGDSFieldGroup>("qgds-field-group");

type QGDSFieldGroupStoryArgs = typeof args;

const meta: Meta<QGDSFieldGroupStoryArgs> = {
  title: "Components/QGDS Field Group",
  tags: ["autodocs"],
  args: {
    ...args,
    name: "interests",
  },
  argTypes,
};

export default meta;
type Story = StoryObj<QGDSFieldGroupStoryArgs>;

/** Checkbox group wrapped in a form field for label and hint. */
export const Checkbox: Story = {
  render: () => html`
    <qgds-form-field label="Interests" hint="Select all that apply.">
      <qgds-field-group name="interests" @qgds-change=${action("qgds-change")}>
        <qgds-checkbox value="design" label="Design"></qgds-checkbox>
        <qgds-checkbox value="code" label="Code"></qgds-checkbox>
        <qgds-checkbox value="research" label="Research"></qgds-checkbox>
      </qgds-field-group>
    </qgds-form-field>
  `,
};

/** Radio group wrapped in a form field. */
export const Radio: Story = {
  render: () => html`
    <qgds-form-field label="Priority" hint="Choose one option.">
      <qgds-field-group name="priority" @qgds-change=${action("qgds-change")}>
        <qgds-radio value="low" label="Low"></qgds-radio>
        <qgds-radio value="medium" label="Medium"></qgds-radio>
        <qgds-radio value="high" label="High"></qgds-radio>
      </qgds-field-group>
    </qgds-form-field>
  `,
};

/** Error state — form field shows validation message above inputs. */
export const WithError: Story = {
  render: () => html`
    <qgds-form-field
      label="Interests"
      hint="Select all that apply."
      status="error"
      message="Please select at least one option."
      required
    >
      <qgds-field-group name="interests" @qgds-change=${action("qgds-change")}>
        <qgds-checkbox
          value="design"
          label="Design"
          status="error"
        ></qgds-checkbox>
        <qgds-checkbox value="code" label="Code" status="error"></qgds-checkbox>
        <qgds-checkbox
          value="research"
          label="Research"
          status="error"
        ></qgds-checkbox>
      </qgds-field-group>
    </qgds-form-field>
  `,
};
