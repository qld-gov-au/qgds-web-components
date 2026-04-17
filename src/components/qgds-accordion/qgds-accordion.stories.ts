import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSAccordion } from "./qgds-accordion";
import "./qgds-accordion";
import { action } from "storybook/actions";

const { args, argTypes } = getStorybookHelpers<QGDSAccordion>("qgds-accordion");
type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Accordion",
  component: "qgds",
  tags: ["autodocs"],
  args: {
    ...args,
    title: "Accordion title",
    "default-slot": "<p>This is the content of the accordion. It can include any HTML elements.</p>",
    "qgds-toggle-event": (e: CustomEvent) => action("qgds-toggle")(e.detail),
    // toggleHandler: (e: CustomEvent) => action("qgds-toggle")(e.detail),
  },
  argTypes,
  render: (args) => html`
    <qgds-accordion title=${args.title} ?is-open=${args["is-open"]} @qgds-toggle=${args["qgds-toggle-event"]}>
      ${args["default-slot"]}
    </qgds-accordion>
  `,
};

export default meta;
type Story = StoryObj<Args>;

export const Closed: Story = {};

export const Open: Story = {
  args: {
    "is-open": true,
  },
};
