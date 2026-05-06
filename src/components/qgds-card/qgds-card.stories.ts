import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { palettes } from "../../utils/palettes";
import { chromaticModes } from "../../../.storybook/modes";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { QGDSCard } from "./qgds-card";
import "./qgds-card";
import { ICON_NAMES } from "../qgds-icon/icon-names";

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

export const Default: Story = {
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
  name: "No Action",
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
  name: "No Action (Footer)",
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
  name: "No Action (Image)",
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
  name: "No Action (Image and Footer)",
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

export const SingleAction: Story = {
  name: "Single Action",
  args: {
    heading: "Card title",
    "default-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
    href: "https://www.designsystem.qld.gov.au/components/card",
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
        </qgds-card>
      `
    )}
  `,
};

export const SingleAction_WithFooter: Story = {
  name: "Single Action (Footer)",
  args: {
    heading: "Card title",
    "default-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
    href: "https://www.designsystem.qld.gov.au/components/card",
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
  name: "Single Action (Image)",
  args: {
    heading: "Card title",
    "default-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
    href: "https://www.designsystem.qld.gov.au/components/card",
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
          image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
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
  name: "Single Action (Image and Footer)",
  args: {
    heading: "Card title",
    "default-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
    href: "https://www.designsystem.qld.gov.au/components/card",
    footerText: "Footer Text",
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
          image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
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

export const SingleAction_WithIcon: Story = {
  name: "Single Action (Icon)",
  args: {
    heading: "Card title",
    "default-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
    href: "https://www.designsystem.qld.gov.au/components/card",
    variant: "stacked-icon",
    iconName: "settings",
  },
  argTypes: {
    href: { control: "text" },
    variant: {
      control: { type: "select" },
      options: ["leading-icon", "stacked-icon"],
    },
    iconName: {
      control: { type: "select" },
      options: [...ICON_NAMES],
      if: { arg: "variant", eq: "stacked-icon" },
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
          icon-name=${ifDefined(args.iconName)}
          palette=${palette}
          target="_blank"
        >
          ${unsafeHTML(args["default-slot"] as string)}
        </qgds-card>
      `
    )}
  `,
};

const footerLinksHTML = html`
  <div slot="footer-links">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
`;

const footerTagsHTML = html`
  <div slot="footer-tags">
    <qgds-tag label="Topic" variant="default"></qgds-tag>
    <qgds-tag label="Topic" variant="default"></qgds-tag>
    <qgds-tag label="Topic" variant="default"></qgds-tag>
  </div>
`;

const footerTagsActionHTML = html`
  <div slot="footer-tags">
    <qgds-tag label="Action" variant="action"></qgds-tag>
    <qgds-tag label="Action" variant="action"></qgds-tag>
    <qgds-tag label="Action" variant="action"></qgds-tag>
  </div>
`;

const footerStoryArgs: Story["args"] = {
  heading: "Card title",
  "default-slot": `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem, blanditiis reprehenderit illum voluptas amet est sapiente ea debitis voluptate, mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</p>`,
};

export const WithFooterText: Story = {
  args: footerStoryArgs,
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

export const WithFooterLinks: Story = {
  args: footerStoryArgs,
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card heading=${ifDefined(args.heading)} action="none" palette=${palette}>
          ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
        </qgds-card>
      `
    )}
  `,
};

export const WithFooterTags: Story = {
  args: footerStoryArgs,
  render: (args) => html`
    ${Object.entries(palettes).map(
      ([palette]) => html`
        <qgds-card heading=${ifDefined(args.heading)} action="none" palette=${palette}>
          ${unsafeHTML(args["default-slot"] as string)} ${footerTagsActionHTML}
        </qgds-card>
      `
    )}
  `,
};

export const WithIcon: Story = {
  args: {
    ...args,
  },
  render: () => html`
    <qgds-card
      heading="Card with icon"
      variant="stacked-icon"
      href="https://www.designsystem.qld.gov.au/components/card"
      target="_blank"
      palette="default"
      icon-id="home"
    >
      Card body text
    </qgds-card>
  `,
};

export const FeatureCard: Story = {
  args: {
    heading: "Card title",
    "default-slot": `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem, blanditiis reprehenderit illum voluptas amet est sapiente ea debitis voluptate, mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</p>`,
  },
  render: (args) => html`
    <qgds-card
      heading=${ifDefined(args.heading)}
      layout="feature"
      target="_blank"
      image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
      image-alt="Placeholder image"
    >
      ${unsafeHTML(args["default-slot"] as string)}
    </qgds-card>

    <qgds-card
      heading=${ifDefined(args.heading)}
      layout="feature"
      action="single"
      href="https://www.designsystem.qld.gov.au/components/card"
      target="_blank"
      image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
      image-alt="Placeholder image"
    >
      ${unsafeHTML(args["default-slot"] as string)}
    </qgds-card>

    <qgds-card
      heading=${ifDefined(args.heading)}
      layout="feature"
      image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
      image-alt="Placeholder image"
    >
      ${unsafeHTML(args["default-slot"] as string)} ${footerTagsHTML}
    </qgds-card>

    <qgds-card
      heading=${ifDefined(args.heading)}
      layout="feature"
      image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
      image-alt="Placeholder image"
    >
      ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
    </qgds-card>

    <qgds-card
      heading=${ifDefined(args.heading)}
      layout="feature"
      image-src="https://picsum.photos/seed/qgds-sunny/600/400/?blur"
      image-alt="Placeholder image"
      image-position="end"
    >
      ${unsafeHTML(args["default-slot"] as string)}
    </qgds-card>

    <div style="height: 1rem;"></div>

    <qgds-card
      heading=${ifDefined(args.heading)}
      layout="feature"
      image-src="https://picsum.photos/seed/qgds-sunny/600/400/"
      image-alt="Placeholder image"
      image-position="end"
    >
      ${unsafeHTML(args["default-slot"] as string)} ${footerTagsHTML}
    </qgds-card>

    <qgds-card
      heading=${ifDefined(args.heading)}
      layout="feature"
      image-src="https://picsum.photos/seed/qgds-sunny/600/400/"
      image-alt="Placeholder image"
      image-position="end"
    >
      ${unsafeHTML(args["default-slot"] as string)} ${footerLinksHTML}
    </qgds-card>
  `,

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
