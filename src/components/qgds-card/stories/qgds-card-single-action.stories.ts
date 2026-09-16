import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { palettes } from "../../../utils";
import { chromaticModes } from "../../../../.storybook/modes";
import { withEventActions } from "../../../../.storybook/storybook-helpers";
import { imageHelper } from "../../../../.storybook/image-helpers";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { ICON_NAMES, type IconName } from "../../qgds-icon/icon-names";

import type { QGDSCard } from "../qgds-card";
import "../qgds-card";

const { args, argTypes, template } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const footerSlotContent = (args: Args) => html`
  ${unsafeHTML(String(args["default-slot"] ?? ""))}
  ${String(args.footerText ?? "").trim().length > 0 ? html`<div slot="footer-text">${args.footerText}</div>` : ""}
`;

const renderPaletteCards = (
  args: Args,
  overrides: Partial<Args> = {},
  slotContent: ReturnType<typeof html> = html`${unsafeHTML(String(args["default-slot"] ?? ""))}`
) => {
  const DEFAULT_CARD_CLASS = "qgds-span-12 qgds-span-6:md qgds-span-4:lg";
  const baseArgs = { class: DEFAULT_CARD_CLASS, ...args, ...overrides };
  return html` ${Object.entries(palettes).map(([palette]) => template({ ...baseArgs, palette }, slotContent))} `;
};

const meta: Meta<Args> = {
  title: "Components/Card/Single Action Link",
  component: "qgds-card",
  tags: ["!autodocs"],
  args: {
    ...args,
  },
  argTypes,
  decorators: [
    withEventActions("qgds-click"),
    (Story) => {
      return html` <div class="qgds-cols qgds-cols-12">${Story()}</div>`;
    },
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
  render: (args) => renderPaletteCards(args, { action: "single", target: "_blank" }),
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
  render: (args) => renderPaletteCards(args, { action: "single", target: "_blank" }, footerSlotContent(args)),
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
  render: (args) =>
    renderPaletteCards(
      args,
      {
        action: "single",
        target: "_blank",
        "image-src": imageHelper.getByID(2),
        "image-alt": "Placeholder image",
      },
      footerSlotContent(args)
    ),
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
  render: (args) =>
    renderPaletteCards(
      args,
      {
        action: "single",
        target: "_blank",
        "image-src": imageHelper.getByID(7),
        "image-alt": "Placeholder image",
      },
      footerSlotContent(args)
    ),
};

export const SingleAction_ArrowIcon: Story = {
  name: "Arrow Icon",
  args: {
    ...singleActionArgs,
  },
  argTypes: {
    href: { control: "text" },
  },
  render: (args) => renderPaletteCards(args, { action: "single", target: "_blank", variant: "arrow" }, html``),
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
  render: (args) =>
    renderPaletteCards(args, {
      action: "single",
      target: "_blank",
      variant: args.variant ?? "stacked-icon",
      "icon-name": args["icon-name"] as IconName | undefined,
    }),
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
  render: (args) =>
    renderPaletteCards(args, {
      action: "single",
      target: "_blank",
      variant: args.variant ?? "leading-icon",
      "icon-name": args["icon-name"] as IconName | undefined,
    }),
};
