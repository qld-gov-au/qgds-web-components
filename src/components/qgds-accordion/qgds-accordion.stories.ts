import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { QGDSAccordion } from "./qgds-accordion";
import "./qgds-accordion";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../.storybook/modes";

const { args, argTypes } = getStorybookHelpers<QGDSAccordion>("qgds-accordion");
type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Accordion",
  component: "qgds-accordion",
  tags: ["autodocs"],
  args: {
    ...args,
    title: "Accordion title",
    "default-slot": "<p>This is the <strong>content</strong>.</p>",
    "qgds-toggle-event": (e: CustomEvent) => action("qgds-toggle")(e.detail),
  },
  argTypes,
  render: (args) => html`
    <qgds-accordion
      id="${ifDefined(args.id)}"
      title=${args.title}
      ?is-open=${args["is-open"]}
      @qgds-toggle=${args["qgds-toggle-event"]}
    >
      ${unsafeHTML(args["default-slot"] as string)}
    </qgds-accordion>
  `,
};

export default meta;
type Story = StoryObj<Args>;

export const Open: Story = {
  args: {
    ...meta.args,
    "is-open": true,
    title: "This accordion is initially open.",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const Closed: Story = {
  args: {
    ...meta.args,
    title: "This accordion is initially closed.",
  },
};

export const OpenOnHashChange: Story = {
  args: {
    ...meta.args,
    id: "myaccordion",
    title: 'This will open if window.location.hash = "myaccordion"',
  },
  decorators: [
    (story) =>
      html`<div style="height: 50vh; overflow: scroll;">
        <p>An accordion will auto-open if <code>window.location.hash</code> equals its id attribute.</p>
        <p style="margin-bottom: 100vh;"><a href="#myaccordion">Click me and see it in action.</a></p>
        ${story()}
      </div>`,
  ],
};

export const OpenContentWithinOnHashChange: Story = {
  args: {
    ...meta.args,
    title: 'This will open to display nested content if window.location.hash = "nestedcontent"',
    "default-slot":
      '<p>This paragraph contains a <span id="nestedcontent"> nested element</span> which can be linked to. The accordion will be rendered as open when linked to via window.location.hash </p>',
  },
  decorators: [
    (story) =>
      html`<div style="height: 50vh; overflow: scroll;">
        <p>
          An accordion will auto-open if <code>window.location.hash</code> equals an element's id within its content
          area.
        </p>
        <p style="margin-bottom: 100vh;"><a href="#nestedcontent">Click me and see it in action.</a></p>
        ${story()}
      </div>`,
  ],
};
