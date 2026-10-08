import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSSelect } from "./qgds-select";
import "./qgds-select";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
const { args, argTypes, template } = getStorybookHelpers<QGDSSelect>("qgds-select");

type Args = typeof args;

const defaultChildren = html`
  <qgds-select-option value="dog">Dog</qgds-select-option>
  <qgds-select-option value="cat">Cat</qgds-select-option>
  <qgds-select-option value="hamster">Hamster</qgds-select-option>
  <qgds-select-option value="parrot">Parrot</qgds-select-option>
  <qgds-select-option value="spider">Spider</qgds-select-option>
  <qgds-select-option value="goldfish">Goldfish</qgds-select-option>
`;

const meta: Meta<Args> = {
  title: "Components/Forms/Select",
  component: "qgds-select",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Form label",
  },
  argTypes: {
    ...argTypes,
    id: { control: false },
  },
  render: (storyArgs, context) => template({ ...storyArgs, id: context.name }, defaultChildren),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    hint: "Hint text",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    hint: 'Filled variant with variant="filled"',
  },
};

export const Required: Story = {
  args: {
    required: true,
    hint: "Hint text",
  },
};

export const Optional: Story = {
  args: {
    required: false,
    ["indicate-if"]: "optional",
    hint: "Hint text",
  },
};

export const WithOptgroup: Story = {
  args: {
    label: "Select an animal",
    hint: "Options are grouped using qgds-select-optgroup",
  },
  render: (args) =>
    template(
      args,
      // prettier-ignore
      html`
  <qgds-select-optgroup label="Common Pets">
    <qgds-select-option value="dog" >Dog</qgds-select-option>
    <qgds-select-option value="cat" >Cat</qgds-select-option>
    <qgds-select-option value="hamster" >Hamster</qgds-select-option>
  </qgds-select-optgroup>
  <qgds-select-optgroup label="Birds">
    <qgds-select-option value="parrot" >Parrot</qgds-select-option>
    <qgds-select-option value="canary" >Canary</qgds-select-option>
    <qgds-select-option value="budgie" >Budgie</qgds-select-option>
  </qgds-select-optgroup>
    <qgds-select-optgroup label="Exotic Pets">
    <qgds-select-option value="spider" >Spider</qgds-select-option>
    <qgds-select-option value="snake" >Snake</qgds-select-option>
    <qgds-select-option value="iguana" >Iguana</qgds-select-option>
  </qgds-select-optgroup>
`
    ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    hint: "Hint text",
  },
  render: (storyArgs, context) =>
    html` ${template({ ...storyArgs, id: context.name, class: "qgds-mb-24" }, defaultChildren)}
    ${template({ ...storyArgs, variant: "filled", id: context.name }, defaultChildren)}`,
};

export const Success: Story = {
  args: {
    label: "Form label",
    ["validation-state"]: "success",
    required: true,
    hint: "Hint text",
    ["validation-message"]: "Great choice!",
  },
  render: Disabled.render, // Just borrow the previous
};

export const Error: Story = {
  args: {
    ["validation-state"]: "error",
    required: true,
    hint: "Hint text",
    ["validation-message"]: "Please select a valid option",
  },
  render: Disabled.render, // Just borrow the previous
};

export const Multiple: Story = {
  args: {
    label: "Multiple",
    hint: "Multi select",
    multiple: true,
  },
};
