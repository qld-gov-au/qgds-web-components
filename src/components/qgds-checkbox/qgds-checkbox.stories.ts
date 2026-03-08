import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSCheckbox } from "./qgds-checkbox.ts";
import "./qgds-checkbox.ts";
import "../qgds-field-group/qgds-field-group.ts";
import "../qgds-form-field/qgds-form-field.ts";

const { args, argTypes } = getStorybookHelpers<QGDSCheckbox>("qgds-checkbox");

type QGDSCheckboxStoryArgs = typeof args;

const meta: Meta<QGDSCheckboxStoryArgs> = {
  title: "Components/QGDS Checkbox",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Option",
    value: "option",
  },
  argTypes,
  render: (storyArgs) => html`
    <qgds-checkbox
      label="${storyArgs.label ?? "Option"}"
      value="${storyArgs.value ?? "option"}"
      status="${storyArgs.status ?? ""}"
      ?checked=${storyArgs.checked}
      ?disabled=${storyArgs.disabled}
      @change=${action("change")}
    ></qgds-checkbox>
  `,
};

export default meta;
type Story = StoryObj<QGDSCheckboxStoryArgs>;

export const Default: Story = {
  args: { label: "Accept terms", value: "terms", checked: true  },
};

export const Disabled: Story = {
  args: { label: "Unavailable", value: "na", disabled: true },
};

export const Success: Story = {
  args: { label: "Valid option", value: "valid", status: "success", checked: true  },
};

export const Error: Story = {
  args: { label: "Invalid option", value: "invalid", status: "error", checked: true  },
};

/** Multiple checkboxes inside a field group with form field label. */
export const InFieldGroup: Story = {
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
