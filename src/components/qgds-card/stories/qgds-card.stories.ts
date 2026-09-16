import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { palettes } from "../../../utils";

import { chromaticModes } from "../../../../.storybook/modes";
import { withEventActions } from "../../../../.storybook/storybook-helpers";
import { imageHelper } from "../../../../.storybook/image-helpers";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { QGDSCard } from "../qgds-card";
import "../qgds-card";

// DEV NOTE:
// This default story file focuses on "no action" card examples to show the card as a pure container for content, without the affordances of a clickable card.
// Refer to additional stories files for single action and multi action card examples
// card-single-action.stories.ts
// card-multiple-action.stories.ts

const { args, argTypes, template } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const renderPaletteCards = (
  args: Args,
  overrides: Partial<Args> = {},
  slotContent: ReturnType<typeof html> = html`${unsafeHTML(String(args["default-slot"] ?? ""))}`
) => {
  const DEFAULT_CARD_CLASS = "qgds-span-3";
  const baseArgs = { class: DEFAULT_CARD_CLASS, ...args, ...overrides };
  return html` ${Object.entries(palettes).map(([palette]) => template({ ...baseArgs, palette }, slotContent))} `;
};

const meta: Meta<Args> = {
  title: "Components/Card",
  component: "qgds-card",
  tags: ["autodocs"],
  args: {
    ...args,
  },
  argTypes,
  render: (args) => renderPaletteCards(args),
  decorators: [withEventActions("qgds-click"), (Story) => html` <div class="qgds-cols qgds-cols-12">${Story()}</div> `],
  parameters: {
    eventAction: { name: "qgds-toggle" },
  },
};
export default meta;

export const Default: Story = {
  name: "Default",
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
  name: "Content Only",
  args: noActionArgs,
  render: (args) => renderPaletteCards(args, { action: "none" }),
};

export const NoAction_WithFooter: Story = {
  name: "With Footer",
  args: noActionArgs,
  render: (args) =>
    renderPaletteCards(
      args,
      { action: "none" },
      html`
        ${unsafeHTML(String(args["default-slot"] ?? ""))}
        <div slot="footer-text">Footer text</div>
      `
    ),
};

export const NoAction_WithImage: Story = {
  name: "With Image",
  args: noActionArgs,
  render: (args) =>
    renderPaletteCards(args, {
      action: "none",
      "image-src": imageHelper.getByID(4),
      "image-alt": "Placeholder image",
    }),
};

export const NoAction_WithImageAndFooter: Story = {
  name: "With Image and Footer",
  parameters: { ...chromaticModes },
  args: noActionArgs,
  render: (args) =>
    renderPaletteCards(
      args,
      {
        action: "none",
        "image-src": imageHelper.getByID(2),
        "image-alt": "Placeholder image",
      },
      html`
        ${unsafeHTML(String(args["default-slot"] ?? ""))}
        <div slot="footer-text">Footer text</div>
      `
    ),
};

export const NoAction_EqualHeightGroup: Story = {
  name: "Equal Height Row",
  args: {
    ...noActionArgs,
  },
  render: (args) => html`
    ${template(
      {
        ...args,
        action: "none",
        "is-equal-height": true,
      },
      html`
        Use an <kbd>is-equal-height</kbd> attribute on cards to ensure they all have the same height.
        <div slot="footer-text">Footer text</div>
      `
    )}
    ${template(
      {
        ...args,
        action: "none",
        "is-equal-height": true,
      },
      html`
        Card content introducing the topic or story. Short introductions are easier to scan. This card has even more
        content than the others, so it will be the tallest of the three cards in this group.
        <div slot="footer-text">Footer text</div>
      `
    )}
    ${template(
      {
        ...args,
        action: "none",
        "is-equal-height": true,
      },
      html`
        Card content introducing the topic or story. Short introductions are easier to scan. This card has more content
        than the others, so it will be taller.
        <div slot="footer-text">Footer text</div>
      `
    )}
    ${template(
      {
        ...args,
        action: "none",
        "is-equal-height": true,
      },
      html`
        Short card content
        <div slot="footer-text">Footer text</div>
      `
    )}
  `,
};

export const CardGrid: Story = {
  name: "With Card Grid",
  args: {
    ...noActionArgs,
    class: "qgds-span-12 qgds-span-6:md qgds-span-4:lg",
    "image-src": imageHelper.getByID(1),
    "image-alt": "Placeholder image",
  },
  render: (args) => html`
    <!-- This example uses a wrapping .qgds-cols-12 to define a 12 column grid container. Each <qgds-card> carries responive span classes to adapt to different screen sizes.
      <div class="qgds-cols qgds-cols-12">
        <qgds-card ... class="qgds-span-12 qgds-span-6:md qgds-span-4:lg">
      </div>
    -->
    ${[
      { heading: "Card one", palette: "default" },
      { heading: "Card two", palette: "soft" },
      { heading: "Card three", palette: "deep" },
      { heading: "Card four", palette: "bold" },
      { heading: "Card five", palette: "default" },
      { heading: "Card six", palette: "muted" },
      { heading: "Card six", palette: "deep" },
      { heading: "Card six", palette: "default" },
      { heading: "Card six", palette: "soft" },
    ].map(
      ({ heading, palette }) =>
        html`${template({ ...args, heading, palette }, html`${unsafeHTML(String(args["default-slot"] ?? ""))}`)}`
    )}
  `,
};
