import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSFieldGroup } from "./qgds-field-group.ts";
import "./qgds-field-group.ts";

const { args, argTypes } = getStorybookHelpers<QGDSFieldGroup>("qgds-field-group");

type QGDSFieldGroupStoryArgs = typeof args;

const meta: Meta<QGDSFieldGroupStoryArgs> = {
  title: "Components/QGDS Field Group",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Select options",
  },
  argTypes,
  render: (storyArgs) => html`
    <qgds-field-group
      label="${storyArgs.label ?? "Select options"}"
      @qgds-change=${action("qgds-change")}
    >
      <label><input type="checkbox" value="one" /> Option one</label>
      <label><input type="checkbox" value="two" /> Option two</label>
      <label><input type="checkbox" value="three" /> Option three</label>
    </qgds-field-group>
  `,
};

export default meta;
type Story = StoryObj<QGDSFieldGroupStoryArgs>;

/** Checkbox group — value is a `string[]` of checked values. */
export const Checkbox: Story = {
  args: { label: "Interests" },
  render: (storyArgs) => html`
    <qgds-field-group
      label="${storyArgs.label ?? "Interests"}"
      @qgds-change=${action("qgds-change")}
    >
      <label><input type="checkbox" value="design" /> Design</label>
      <label><input type="checkbox" value="code" /> Code</label>
      <label><input type="checkbox" value="research" /> Research</label>
    </qgds-field-group>
  `,
};

/** Radio group — value is a single `string` of the selected option. */
export const Radio: Story = {
  args: { label: "Priority" },
  render: (storyArgs) => html`
    <qgds-field-group
      label="${storyArgs.label ?? "Priority"}"
      @qgds-change=${action("qgds-change")}
    >
      <label><input type="radio" name="priority" value="low" /> Low</label>
      <label><input type="radio" name="priority" value="medium" /> Medium</label>
      <label><input type="radio" name="priority" value="high" /> High</label>
    </qgds-field-group>
  `,
};
