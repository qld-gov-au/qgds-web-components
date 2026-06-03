import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { palettes } from "../../../utils/palettes";
import { chromaticModes } from "../../../../.storybook/modes";
import { withEventActions } from "../../../../.storybook/storybook-helpers";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import type { ImagePosition, QGDSCard } from "../qgds-card";
import "../qgds-card";

const { args, argTypes } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const demoImageSrc = "https://picsum.photos/id/206/600/400";

const meta: Meta<Args> = {
  title: "Components/Card/Multiple Action Links",
  component: "qgds-card",
  tags: ["!autodocs"],
  args: {
    ...args,
    action: "multiple",
    heading: "Card Heading",
    "default-slot": "Card content goes here. This is an example of a card with multiple actions.",
    href: "https://example.com",
  },
  argTypes,
  decorators: [
    withEventActions("qgds-click"),
    (Story) =>
      html` <style>
          qgds-card {
            inline-size: clamp(320px, 100%, 440px);
          }
        </style>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">${Story()}</div>`,
  ],

  parameters: {
    eventAction: { name: "qgds-click" },
  },
};
export default meta;

const multiActionArgs: Story["args"] = {
  ...args,
  action: "multiple",
  heading: "Card Heading",
  "default-slot": "Card content goes here. This is an example of a card with multiple actions.",
  href: "https://example.com",
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

export const MultipleAction: Story = {
  name: "With Footer Tags",
  args: {
    ...multiActionArgs,
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

export const MultipleAction_WithFooterLinks: Story = {
  name: "With Footer Links",
  args: {
    ...multiActionArgs,
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          action="${ifDefined(args.action)}"
          palette=${palette}
          target="_blank"
        >
          ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
        </qgds-card>
      `
    )}
  `,
};

export const MultipleAction_WithImage: Story = {
  name: "With Image",
  args: {
    ...multiActionArgs,
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
          image-src=${demoImageSrc}
          image-alt="Placeholder image"
        >
          ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
        </qgds-card>
      `
    )}
  `,
};

export const MultipleAction_FeatureCard: Story = {
  name: "Feature Card (Palettes)",
  parameters: { ...chromaticModes },
  args: {
    ...multiActionArgs,
    "image-position": "start",
  },
  argTypes: {
    "image-position": {
      control: { type: "select" },
      options: ["start", "end"],
    },
  },
  render: (args) => {
    const imagePosition = args["image-position"] as ImagePosition | undefined;

    return html`
      ${Object.entries(palettes).map(([palette]) => {
        return html`
          <qgds-card
            heading=${ifDefined(args.heading)}
            action="${ifDefined(args.action)}"
            layout="feature"
            image-position=${ifDefined(imagePosition)}
            palette=${palette}
            target="_blank"
            image-src=${demoImageSrc}
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
            image-position=${ifDefined(imagePosition)}
            palette=${palette}
            target="_blank"
            image-src=${demoImageSrc}
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

      <div style="display: flex; flex-flow: column nowrap; gap: 1rem;">${Story()}</div>
    `,
  ],
};

export const MultipleAction_FeatureCard_AllPositions: Story = {
  name: "Feature Card (Layouts)",
  args: {
    ...multiActionArgs,
  },
  render: (args) => html`
    <div style="display: grid; gap: 1rem; inline-size: min(100%, 1140px);">
      <qgds-card
        heading=${ifDefined(args.heading)}
        action=${ifDefined(args.action)}
        layout="feature"
        image-position="start"
        target="_blank"
        image-src=${demoImageSrc}
        image-alt="Placeholder image"
      >
        ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
      </qgds-card>
      <qgds-card
        heading=${ifDefined(args.heading)}
        action=${ifDefined(args.action)}
        layout="feature"
        image-position="end"
        target="_blank"
        image-src=${demoImageSrc}
        image-alt="Placeholder image"
      >
        ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
      </qgds-card>
    </div>

    <div style="display: grid; gap: 1rem; inline-size: min(100%, 1140px);">
      <qgds-card
        heading=${ifDefined(args.heading)}
        action=${ifDefined(args.action)}
        layout="feature"
        image-position="start"
        target="_blank"
        image-src=${demoImageSrc}
        image-alt="Placeholder image"
      >
        ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
      </qgds-card>
      <qgds-card
        heading=${ifDefined(args.heading)}
        action=${ifDefined(args.action)}
        layout="feature"
        image-position="end"
        target="_blank"
        image-src=${demoImageSrc}
        image-alt="Placeholder image"
      >
        ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
      </qgds-card>
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
