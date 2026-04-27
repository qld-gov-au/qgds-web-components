import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { QGDSAccordion } from "./qgds-accordion";
import "./qgds-accordion";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../.storybook/modes";
import { expect } from "storybook/test";

const { args, argTypes } = getStorybookHelpers<QGDSAccordion>("qgds-accordion", { setComponentVariable: true });
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

export const Deeplink: Story = {
  args: {
    ...meta.args,
    id: "myaccordion",
    title: 'This will open if window.location.hash = "myaccordion"',
  },
  decorators: [
    (story) =>
      html`<div style="height: 50vh; overflow: scroll;">
        <p>
          An accordion will auto-open if <code>window.location.hash</code> equals its id attribute, then scroll into
          view.
        </p>
        <p style="margin-bottom: 100vh;"><a href="#myaccordion">Click me and see it in action.</a></p>
        ${story()}
      </div>`,
  ],
};

export const DeeplinkToContent: Story = {
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
          An accordion will auto-open if <code>window.location.hash</code> equals the id of an element within its
          content area, then scroll into view.
        </p>
        <p style="margin-bottom: 100vh;"><a href="#nestedcontent">Click me and see it in action.</a></p>
        ${story()}
      </div>`,
  ],
};

export const Interactions: Story = {
  args: {
    ...Closed.args,
  },
  play: async ({ canvasElement, userEvent }) => {
    const accordion = canvasElement.querySelector("qgds-accordion");
    await accordion?.updateComplete;
    const summary = accordion?.shadowRoot?.querySelector(".summary");
    if (summary) {
      await userEvent.click(summary);
    }
    await expect(accordion?.isOpen).toBe(true);
    if (summary) {
      await userEvent.click(summary);
    }
    await expect(accordion?.isOpen).toBe(false);
  },
};
