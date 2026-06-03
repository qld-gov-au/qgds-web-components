import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import { QGDSTextarea, tagName } from "./qgds-textarea";
import "./qgds-textarea";
import { html } from "lit";

const { args, argTypes, template } = getStorybookHelpers<QGDSTextarea>(tagName);

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Forms/Textarea",
  component: tagName,
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {
  args: {
    ...args,
    id: "my-text-area",
    label: "Here is the label",
    hint: "This is hint text",
    placeholder: "Hold my place...",
  },
};

export const Filled: Story = {
  args: { ...Default.args, variant: "filled" },
};

export const RequiredIndicator: Story = {
  args: {
    ...args,
    id: "Required-text-input",
    label: "Indicate as required",
    hint: 'To display a required indicator, the input must have required="true" and indicate-if="required"',
    placeholder: "Hold my place...",
    required: true,
    ["indicate-if"]: "required",
  },
};

export const OptionalIndicator: Story = {
  args: {
    ...args,
    id: "Optional-text-input",
    label: "Indicate as optional",
    hint: 'To display an optional indicator, the input must not be required and indicate-if="optional"',
    placeholder: "Hold my place...",
    required: false,
    ["indicate-if"]: "optional",
  },
};

export const LabelOnly: Story = {
  args: {
    ...args,
    id: "LabelOnly",
    label: "Label Only",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  render: (args) =>
    html`${template({ ...args, id: "outline", label: "Disabled outline variant", required: true, class: "qgds-mb-24" })}
    ${template({ ...args, id: "filled", label: "Disabled filled variant", required: true, variant: "filled" })}`,
};

export const Success: Story = {
  args: {
    ...Default.args,
    ["validation-message"]:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    ["validation-state"]: "success",
  },
  render: (args) =>
    html`${template({ ...args, id: "outline", label: "Success outline variant", class: "qgds-mb-24" })}
    ${template({ ...args, id: "filled", label: "Success filled variant", variant: "filled" })}`,
};

export const Error: Story = {
  args: {
    ...Default.args,
    ["validation-message"]:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    ["validation-state"]: "error",
  },
  render: (args) =>
    html`${template({ ...args, id: "outline", label: "Error outline variant", class: "qgds-mb-24" })}
    ${template({ ...args, id: "filled", label: "Error filled variant", variant: "filled" })}`,
};
