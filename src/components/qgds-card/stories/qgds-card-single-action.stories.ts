import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { palettes } from "../../../utils/palettes";
import { chromaticModes } from "../../../../.storybook/modes";
import { withEventAction } from "../../../../.storybook/storybook-helpers";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { ICON_NAMES, type IconName } from "../../qgds-icon/icon-names";

import type { QGDSCard } from "../qgds-card";
import "../qgds-card";

const { args, argTypes } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const demoImageSrc = "https://picsum.photos/id/124/600/400";

const meta: Meta<Args> = {
  title: "Components/Card/Single Action Link",
  component: "qgds-card",
  tags: ["!autodocs"],
  args: {
    ...args,
  },
  argTypes,
  decorators: [
    withEventAction("qgds-click"),

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

const singleActionArgs: Story["args"] = {
  heading: "Card title",
  "default-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
  href: "https://www.designsystem.qld.gov.au/components/card",
  action: "single",
};

export const SingleAction: Story = {
  name: "Default",
  args: singleActionArgs,
  argTypes: {
    href: { control: "text" },
    footerText: { control: "text" },
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          href=${ifDefined(args.href)}
          action="single"
          palette=${palette}
          target="_blank"
        >
          ${unsafeHTML(args["default-slot"] as string)}
        </qgds-card>
      `
    )}
  `,
};

export const SingleAction_WithFooter: Story = {
  name: "With Footer",
  args: {
    ...singleActionArgs,
    footerText: "Footer text",
  },
  argTypes: {
    href: { control: "text" },
    footerText: { control: "text" },
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          href=${ifDefined(args.href)}
          action="single"
          palette=${palette}
          target="_blank"
        >
          ${unsafeHTML(args["default-slot"] as string)}
          ${String(args.footerText ?? "").trim().length > 0
            ? html`<div slot="footer-text">${args.footerText}</div>`
            : ""}
        </qgds-card>
      `
    )}
  `,
};

export const SingleAction_WithImage: Story = {
  name: "With Image",
  args: {
    ...singleActionArgs,
    footerText: "",
  },
  argTypes: {
    href: { control: "text" },
    footerText: { control: "text" },
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          href=${ifDefined(args.href)}
          action="single"
          palette=${palette}
          target="_blank"
          image-src=${demoImageSrc}
          image-alt="Placeholder image"
        >
          ${unsafeHTML(args["default-slot"] as string)}
          ${String(args.footerText ?? "").trim().length > 0
            ? html`<div slot="footer-text">${args.footerText}</div>`
            : ""}
        </qgds-card>
      `
    )}
  `,
};

export const SingleAction_ImageFooter: Story = {
  name: "With Image and Footer",
  parameters: { ...chromaticModes },
  args: {
    ...singleActionArgs,
    footerText: "Footer text",
  },
  argTypes: {
    href: { control: "text" },
    footerText: { control: "text" },
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          href=${ifDefined(args.href)}
          action="single"
          palette=${palette}
          target="_blank"
          image-src=${demoImageSrc}
          image-alt="Placeholder image"
        >
          ${unsafeHTML(args["default-slot"] as string)}
          ${String(args.footerText ?? "").trim().length > 0
            ? html`<div slot="footer-text">${args.footerText}</div>`
            : ""}
        </qgds-card>
      `
    )}
  `,
};

export const SingleAction_ArrowIcon: Story = {
  name: "Arrow Icon",
  args: {
    ...singleActionArgs,
  },
  argTypes: {
    href: { control: "text" },
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          href=${ifDefined(args.href)}
          action="single"
          palette=${palette}
          target="_blank"
          variant="arrow"
        >
        </qgds-card>
      `
    )}
  `,
};

export const SingleAction_WithStackedIcon: Story = {
  name: "Stacked Icon",
  parameters: { ...chromaticModes },
  args: {
    ...singleActionArgs,
    variant: "stacked-icon",
    "icon-name": "settings",
  },
  argTypes: {
    href: { control: "text" },
    variant: {
      control: { type: "select" },
      options: ["leading-icon", "stacked-icon"],
    },
    "icon-name": {
      control: { type: "select" },
      options: [...ICON_NAMES],
    },
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          href=${ifDefined(args.href)}
          action="single"
          variant=${args.variant ?? "stacked-icon"}
          icon-name=${ifDefined(args["icon-name"] as IconName | undefined)}
          palette=${palette}
          target="_blank"
        >
          ${unsafeHTML(args["default-slot"] as string)}
        </qgds-card>
      `
    )}
  `,
};

export const SingleAction_WithLeadingIcon: Story = {
  name: "Leading Icon",
  parameters: { ...chromaticModes },
  args: {
    ...singleActionArgs,
    variant: "leading-icon",
    "icon-name": "chart",
  },
  argTypes: {
    href: { control: "text" },
    variant: {
      control: { type: "select" },
      options: ["leading-icon", "stacked-icon"],
    },
    "icon-name": {
      control: { type: "select" },
      options: [...ICON_NAMES],
    },
  },
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card
          heading=${ifDefined(args.heading)}
          href=${ifDefined(args.href)}
          action="single"
          variant=${args.variant ?? "leading-icon"}
          icon-name=${ifDefined(args["icon-name"] as IconName | undefined)}
          palette=${palette}
          target="_blank"
        >
          ${unsafeHTML(args["default-slot"] as string)}
        </qgds-card>
      `
    )}
  `,
};
