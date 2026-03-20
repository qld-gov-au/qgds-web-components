import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSRadio } from "./qgds-radio";
import "./qgds-radio";
import "../qgds-radio-group/qgds-radio-group";

const { args, argTypes } = getStorybookHelpers<QGDSRadio>("qgds-radio");

type QGDSRadioStoryArgs = typeof args;

const meta: Meta<QGDSRadioStoryArgs> = {
  title: "Components/QGDS Radio",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Label",
    value: "option",
    name: "group",
  },
  argTypes,
  render: (storyArgs) => html`
    <qgds-radio
      label="${storyArgs.label ?? "Label"}"
      value="${storyArgs.value ?? "option"}"
      name="${storyArgs.name ?? "group"}"
      status="${storyArgs.status ?? ""}"
      ?checked=${storyArgs.checked}
      ?disabled=${storyArgs.disabled}
      @change=${action("change")}
    ></qgds-radio>
  `,
};

export default meta;
type Story = StoryObj<QGDSRadioStoryArgs>;

export const Default: Story = {
  args: { label: "Label", value: "option", checked: false },
};

export const Checked: Story = {
  args: { label: "Label", value: "option", checked: true },
};

export const Disabled: Story = {
  args: { label: "Label", value: "option", disabled: true, checked: true },
};

export const Success: Story = {
  args: { label: "Label", value: "option", status: "success", checked: true },
};

export const Error: Story = {
  args: { label: "Label", value: "option", status: "error", checked: true },
};
