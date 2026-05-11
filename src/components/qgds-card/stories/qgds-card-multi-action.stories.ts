import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { palettes } from "../../../utils/palettes";
import { chromaticModes } from "../../../../.storybook/modes";

import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import type { FeatureRatios, ImagePosition, QGDSCard } from "../qgds-card";
import "../qgds-card";

const { args, argTypes } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Card/Multiple Action",
  component: "qgds-card",
  tags: ["!autodocs"],
  args: {
    ...args,
    action: "multiple",
    heading: "Card Heading",
    "default-slot": "Card content goes here. This is an example of a card with multiple actions.",
    href: "https://media.tenor.com/4YCgHLAsE3UAAAAj/rick-roll.gif",
  },
  argTypes,
  decorators: [
    (Story) =>
      html` <style>
          qgds-card {
            inline-size: clamp(320px, 100%, 440px);
          }
        </style>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">${Story()}</div>`,
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

const mutliActionArgs: Story["args"] = {
  ...args,
  action: "multiple",
  heading: "Card Heading",
  "default-slot": "Card content goes here. This is an example of a card with multiple actions.",
  href: "https://media.tenor.com/4YCgHLAsE3UAAAAj/rick-roll.gif",
};

const footerLinksHTML = html`
  <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
  <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
  <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
`;

const footerTagsActionHTML = html`
  <qgds-tag slot="footer-tags" label="Action" variant="action"></qgds-tag>
  <qgds-tag slot="footer-tags" label="Action" variant="action"></qgds-tag>
  <qgds-tag slot="footer-tags" label="Action" variant="action"></qgds-tag>
`;

const featureRatios: FeatureRatios[] = ["8-4", "6-6"];

export const MultipleAction: Story = {
  name: "Default",
  parameters: { ...chromaticModes },
  args: {
    ...mutliActionArgs,
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          action=${ifDefined(args.action)}
          href=${ifDefined(args.href)}
          palette=${palette}
          target="_blank"
        >
          ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
        </qgds-card>
      `
    )}
  `,
};

export const MultipleAction_WithImage: Story = {
  name: "With Image",
  parameters: { ...chromaticModes },
  args: {
    ...mutliActionArgs,
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          action=${ifDefined(args.action)}
          href=${ifDefined(args.href)}
          palette=${palette}
          target="_blank"
          image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
          image-alt="Placeholder image"
        >
          ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
        </qgds-card>
      `
    )}
  `,
};

export const MultipleAction_WithFooterLinks: Story = {
  name: "Footer Links",
  parameters: { ...chromaticModes },
  args: {
    ...mutliActionArgs,
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          action="${ifDefined(args.action)}"
          palette=${palette}
          target="_blank"
          image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
          image-alt="Placeholder image"
        >
          ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
        </qgds-card>
      `
    )}
  `,
};

export const MultipleAction_FeatureCard: Story = {
  name: "Feature Card",
  parameters: { ...chromaticModes },
  args: {
    ...mutliActionArgs,
    "feature-ratio": "8-4",
    "image-position": "start",
  },
  argTypes: {
    "feature-ratio": {
      control: { type: "select" },
      options: [...featureRatios],
    },
    "image-position": {
      control: { type: "select" },
      options: ["start", "end"],
    },
  },
  render: (args) => {
    const featureRatio = args["feature-ratio"] as FeatureRatios | undefined;
    const imagePosition = args["image-position"] as ImagePosition | undefined;

    return html`
      ${Object.entries(palettes).map(([palette]) => {
        return html`
          <qgds-card
            heading=${ifDefined(args.heading)}
            action="${ifDefined(args.action)}"
            layout="feature"
            feature-ratio=${ifDefined(featureRatio)}
            image-position=${ifDefined(imagePosition)}
            palette=${palette}
            target="_blank"
            image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
            image-alt="Placeholder image"
          >
            ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
          </qgds-card>
        `;
      })}
      ${Object.entries(palettes).map(([palette]) => {
        return html`
          <qgds-card
            heading=${ifDefined(args.heading)}
            action="${ifDefined(args.action)}"
            layout="feature"
            feature-ratio=${ifDefined(featureRatio)}
            image-position=${ifDefined(imagePosition)}
            palette=${palette}
            target="_blank"
            image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
            image-alt="Placeholder image"
          >
            ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
          </qgds-card>
        `;
      })}
    `;
  },

  decorators: [
    (Story) => html`
      <style>
        qgds-card {
          inline-size: 100%;
        }
      </style>

      <div style="display: flex; flex-flow: column nowrap; gap: 1rem; inline-size: 1140px;">${Story()}</div>
    `,
  ],
};

export const MultipleAction_FeatureCard_AllRatios: Story = {
  name: "Feature Card/All Ratios",
  parameters: { ...chromaticModes },
  args: {
    ...mutliActionArgs,
  },
  render: (args) => html`
    <div style="display: grid; gap: 1rem; inline-size: min(100%, 1140px);">
      ${featureRatios.map(
        (ratio) => html`
          <qgds-card
            heading=${ifDefined(args.heading)}
            action=${ifDefined(args.action)}
            layout="feature"
            feature-ratio=${ratio}
            image-position="start"
            target="_blank"
            image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
            image-alt="Placeholder image"
          >
            ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
          </qgds-card>
          <qgds-card
            heading=${ifDefined(args.heading)}
            action=${ifDefined(args.action)}
            layout="feature"
            feature-ratio=${ratio}
            image-position="end"
            target="_blank"
            image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
            image-alt="Placeholder image"
          >
            ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
          </qgds-card>
        `
      )}
    </div>

    <div style="display: grid; gap: 1rem; inline-size: min(100%, 1140px);">
      ${featureRatios.map(
        (ratio) => html`
          <qgds-card
            heading=${ifDefined(args.heading)}
            action=${ifDefined(args.action)}
            layout="feature"
            feature-ratio=${ratio}
            image-position="start"
            target="_blank"
            image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
            image-alt="Placeholder image"
          >
            ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
          </qgds-card>
          <qgds-card
            heading=${ifDefined(args.heading)}
            action=${ifDefined(args.action)}
            layout="feature"
            feature-ratio=${ratio}
            image-position="end"
            target="_blank"
            image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
            image-alt="Placeholder image"
          >
            ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
          </qgds-card>
        `
      )}
    </div>
  `,
  decorators: [
    (Story) => html`
      <style>
        qgds-card {
          inline-size: 100%;
        }
      </style>

      <div style="display: flex; flex-flow: column nowrap; gap: 1rem; inline-size: min(100%, 1140px);">${Story()}</div>
    `,
  ],
};
