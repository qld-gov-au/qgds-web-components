import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSCheckbox } from "./qgds-checkbox";
import "./qgds-checkbox";
import "../qgds-checkbox-group/qgds-checkbox-group";

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
      validationState="${storyArgs.validationState ?? ""}"
      ?checked=${storyArgs.checked}
      ?disabled=${storyArgs.disabled}
      @change=${action("change")}
    ></qgds-checkbox>
  `,
};

export default meta;
type Story = StoryObj<QGDSCheckboxStoryArgs>;

export const Default: Story = {
  args: { label: "Accept terms", value: "terms", checked: true },
};

export const Disabled: Story = {
  args: { label: "Unavailable", value: "na", disabled: true, checked: true },
};

export const Success: Story = {
  args: {
    label: "Valid option",
    value: "valid",
    validationState: "success",
    checked: true,
  },
};

export const Error: Story = {
  args: {
    label: "Invalid option",
    value: "invalid",
    validationState: "error",
    checked: true,
  },
};
