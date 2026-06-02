import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSTextInput, tagName } from "./qgds-text-input";
import "./qgds-text-input";
import { html } from "lit";

const { args, argTypes, template } = getStorybookHelpers<QGDSTextInput>(tagName);

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Forms/Text input",
  component: tagName,
  tags: ["autodocs"],
  args,
  argTypes: {
    ...argTypes,
    size: {
      control: "text",
    },
  },
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {
  args: {
    ...args,
    id: "my-text-input",
    label: "Here is the label",
    hint: "This is hint text",
    placeholder: "Hold my place...",
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    variant: "filled",
  },
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

export const FullWidth: Story = {
  args: {
    ...args,
    id: "full-width-text-input",
    label: "A full width text input",
    hint: 'Set the size attribute to "full"',
    size: "full",
  },
};

export const Size4: Story = {
  args: {
    ...args,
    id: "size-4-text-input",
    label: "A small sized text input",
    hint: 'Text inputs ideally be as long as the expected character size. For example, a postcode field should have size="4"',
    size: 4,
  },
};

export const LabelOnly: Story = {
  args: {
    ...args,
    id: "LabelOnly",
    label: "Label only",
    hint: "",
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
