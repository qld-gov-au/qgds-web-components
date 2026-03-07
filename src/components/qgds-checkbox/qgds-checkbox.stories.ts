import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSCheckbox } from "./qgds-checkbox.ts";
import "./qgds-checkbox.ts";
import "../qgds-field-group/qgds-field-group.ts";

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
      ?checked=${storyArgs.checked}
      ?disabled=${storyArgs.disabled}
      @change=${action("change")}
    ></qgds-checkbox>
  `,
};

export default meta;
type Story = StoryObj<QGDSCheckboxStoryArgs>;

export const Default: Story = {
  args: { label: "Accept terms", value: "terms" },
};

export const Checked: Story = {
  args: { label: "Pre-selected", value: "pre", checked: true },
};

export const Disabled: Story = {
  args: { label: "Unavailable", value: "na", disabled: true },
};

/** Multiple checkboxes inside a field group — value is a `string[]`. */
export const InFieldGroup: Story = {
  render: () => html`
    <qgds-field-group
      label="Interests"
      @qgds-change=${action("qgds-change")}
    >
      <qgds-checkbox value="design" label="Design"></qgds-checkbox>
      <qgds-checkbox value="code" label="Code"></qgds-checkbox>
      <qgds-checkbox value="research" label="Research"></qgds-checkbox>
    </qgds-field-group>
  `,
};
