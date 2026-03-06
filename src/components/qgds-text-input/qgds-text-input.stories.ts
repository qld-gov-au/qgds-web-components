import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import { QGDSTextInput } from "./qgds-text-input";
import "./qgds-text-input";

const { args, argTypes, template } = getStorybookHelpers<QGDSTextInput>("qgds-text-input");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Forms/Text input",
  component: "Text input",
  tags: ["autodocs"],
  args,
  argTypes,
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

export const Interaction: Story = {
  args: { ...Default.args, "data-testid": "test" },
  render: (args) => {
    return html`
      <style>
        input:hover {
          border-color: green;
        }
      </style>
      <input type="text" value="my value" data-testid="native" />
      <qgds-text-input
        id=${args.id}
        label=${args.label}
        hint=${args.hint}
        placeholder=${args.placeholder}
        data-testid=${args["data-testid"]}
      ></qgds-text-input>
    `;
  },
  play: async ({ canvas, userEvent }) => {
    const native = canvas.getByTestId("native");
    const host = canvas.getByTestId("test");
    const input = host?.shadowRoot?.querySelector("input");
    console.log(host);
    console.log(input);

    if (input) {
      await userEvent.tab();
      await userEvent.click(host);
      await userEvent.tab();
      await userEvent.click(input);
      await userEvent.hover(native);
      await userEvent.input(input, "write me text");

      // await userEvent.type(input, "I have a value!");
    }
  },
};
