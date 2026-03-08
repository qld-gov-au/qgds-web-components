import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSFormField } from "./qgds-form-field.ts";
import "./qgds-form-field.ts";
import "../qgds-checkbox/qgds-checkbox.ts";

const { args, argTypes } = getStorybookHelpers<QGDSFormField>("qgds-form-field");

type QGDSFormFieldStoryArgs = typeof args;

const meta: Meta<QGDSFormFieldStoryArgs> = {
  title: "Components/QGDS Form Field",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Label",
    hint: "Hint text",
  },
  argTypes,
  render: (storyArgs) => html`
    <qgds-form-field
      label="${storyArgs.label ?? "Label"}"
      hint="${storyArgs.hint ?? ""}"
      message="${storyArgs.message ?? ""}"
      status="${storyArgs.status ?? ""}"
      ?required=${storyArgs.required}
      ?optional=${storyArgs.optional}
    >
      <qgds-checkbox value="one" label="Label" @change=${action("change")}></qgds-checkbox>
      <qgds-checkbox value="two" label="Label" @change=${action("change")}></qgds-checkbox>
    </qgds-form-field>
  `,
};

export default meta;
type Story = StoryObj<QGDSFormFieldStoryArgs>;

/** Default form field with label and hint. */
export const Default: Story = {
  args: {
    label: "Label",
    hint: "Hint text",
  },
};

/** Required field — displays a red asterisk before the label. */
export const Required: Story = {
  args: {
    label: "Label",
    hint: "Hint text",
    required: true,
  },
};

/** Optional field — displays "(optional)" after the label. */
export const Optional: Story = {
  args: {
    label: "Label",
    hint: "Hint text",
    optional: true,
  },
};

/** Error state — validation message appears between hint and inputs. */
export const Error: Story = {
  args: {
    label: "Label",
    hint: "Hint text",
    status: "error",
    message: "Error message",
    required: true,
    optional: true,
  },
  render: (storyArgs) => html`
    <qgds-form-field
      label="${storyArgs.label ?? "Label"}"
      hint="${storyArgs.hint ?? ""}"
      message="${storyArgs.message ?? "Error message"}"
      status="error"
      ?required=${storyArgs.required}
      ?optional=${storyArgs.optional}
    >
      <qgds-checkbox value="one" label="Label" status="error" @change=${action("change")}></qgds-checkbox>
      <qgds-checkbox value="two" label="Label" status="error" @change=${action("change")}></qgds-checkbox>
    </qgds-form-field>
  `,
};

/** Success state — confirms a valid selection. */
export const Success: Story = {
  args: {
    label: "Label",
    hint: "Hint text",
    status: "success",
    message: "Selection confirmed",
  },
  render: (storyArgs) => html`
    <qgds-form-field
      label="${storyArgs.label ?? "Label"}"
      hint="${storyArgs.hint ?? ""}"
      message="${storyArgs.message ?? "Selection confirmed"}"
      status="success"
    >
      <qgds-checkbox value="one" label="Label" status="success" checked @change=${action("change")}></qgds-checkbox>
      <qgds-checkbox value="two" label="Label" @change=${action("change")}></qgds-checkbox>
    </qgds-form-field>
  `,
};

/** No hint — label directly above inputs. */
export const NoHint: Story = {
  args: {
    label: "Label",
    hint: "",
    required: true,
  },
};
