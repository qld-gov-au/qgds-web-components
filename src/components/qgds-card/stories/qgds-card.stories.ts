import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { palettes } from "@/utils/palettes";
import { chromaticModes } from "@storybook-config/modes";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { QGDSCard } from "../qgds-card";
import "../qgds-card";

// DEV NOTE:
// This default story file focuses on "no action" card examples to show the card as a pure container for content, without the affordances of a clickable card.
// Refer to additional stories files for single action and multi action card examples
// card-single-action.stories.ts
// card-multiple-action.stories.ts

const { args, argTypes } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Card",
  component: "qgds-card",
  tags: ["autodocs"],
  args: {
    ...args,
  },
  argTypes,
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card heading=${ifDefined(args.heading)} variant=${ifDefined(args.variant)} palette=${palette}>
          ${unsafeHTML(args["default-slot"] as string)}
        </qgds-card>
      `
    )}
  `,
  decorators: [
    (Story) => html`
      <style>
        qgds-card {
          inline-size: clamp(320px, 100%, 440px);
        }
      </style>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">${Story()}</div>
    `,
  ],

  beforeEach({ canvasElement }) {
    const handleClick = (e: Event) => {
      action("qgds-click")((e as CustomEvent).detail);
    };
    canvasElement.addEventListener("qgds-click", handleClick);

    return () => {
      canvasElement.removeEventListener("qgds-click", handleClick);
    };
  },
};
export default meta;

export const Default: Story = {
  name: "No Action/Default",
  parameters: {
    ...chromaticModes,
  },
  args: {
    heading: "Card title",
    "default-slot": `
    <p>Card content introducing the topic or story. Short introductions are easier to scan.</p>
    `,
  },
};

const noActionArgs: Story["args"] = {
  heading: "Card title",
  "default-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
};

export const NoAction: Story = {
  name: "No Action/Body Only",
  parameters: { ...chromaticModes },
  args: noActionArgs,
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card heading=${ifDefined(args.heading)} action="none" palette=${palette}>
          ${unsafeHTML(args["default-slot"] as string)}
        </qgds-card>
      `
    )}
  `,
};

export const NoAction_WithFooter: Story = {
  name: "No Action/With Footer",
  parameters: { ...chromaticModes },
  args: noActionArgs,
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card heading=${ifDefined(args.heading)} action="none" palette=${palette}>
          ${unsafeHTML(args["default-slot"] as string)}
          <div slot="footer-text">Footer text</div>
        </qgds-card>
      `
    )}
  `,
};

export const NoAction_WithImage: Story = {
  name: "No Action/With Image",
  parameters: { ...chromaticModes },
  args: noActionArgs,
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          action="none"
          palette=${palette}
          image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
          image-alt="Placeholder image"
        >
          ${unsafeHTML(args["default-slot"] as string)}
        </qgds-card>
      `
    )}
  `,
};

export const NoAction_WithImageAndFooter: Story = {
  name: "No Action/With Image and Footer",
  parameters: { ...chromaticModes },
  args: noActionArgs,
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          action="none"
          palette=${palette}
          image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
          image-alt="Placeholder image"
        >
          ${unsafeHTML(args["default-slot"] as string)}
          <div slot="footer-text">Footer text</div>
        </qgds-card>
      `
    )}
  `,
};
