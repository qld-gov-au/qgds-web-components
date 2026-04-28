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

const { args, argTypes } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const footerLinksHTML = html`
  <div slot="footer-links">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
`;

const footerTagsHTML = html`
  <div slot="footer-tags">
    <qgds-tag label="Action" variant="default"></qgds-tag>
    <qgds-tag label="Action" variant="default"></qgds-tag>
    <qgds-tag label="Action" variant="default"></qgds-tag>
  </div>
`;

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
          <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>
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
    "main-slot": `
    <p>Card content introducing the topic or story. Short introductions are easier to scan.</p>
    `,
  },
};

export const WithImage: Story = {
  args: {
    heading: "Card title",
    "main-slot": `<p>Card content introducing the topic or story. Short introductions are easier to scan.</p>`,
  },
  render: (args) => html`
    <!-- Card 1 -->
    <qgds-card heading=${ifDefined(args.heading)} variant=${ifDefined(args.variant)} palette="default" target="_blank">
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-lime/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>
      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>
    </qgds-card>

    <!-- Card 2, muted single -->
    <qgds-card
      heading="Card (single) with link"
      variant=${ifDefined(args.variant)}
      action="single"
      palette="soft"
      href="https://www.designsystem.qld.gov.au/components/card"
      target="_blank"
    >
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-lime/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>
      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>
    </qgds-card>

    <!-- Card 3, deep -->
    <qgds-card
      heading="Card (multiple) links"
      variant=${ifDefined(args.variant)}
      palette="deep"
      href="https://www.designsystem.qld.gov.au/components/card"
      target="_blank"
    >
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-lime/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>
      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>
    </qgds-card>
  `,
};

export const WithFooter: Story = {
  args: {
    heading: "Card title",
    "main-slot": `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem, blanditiis reprehenderit illum voluptas amet est sapiente ea debitis voluptate, mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</p>`,
    tagVariant: "action",
  },
  argTypes: {
    tagVariant: {
      control: { type: "select" },
      options: ["action", "info", "default"],
    },
    footerType: {
      control: { type: "radio" },
      options: ["none", "links", "tags"],
    },
  },
  render: (args) => html`
    <qgds-card
      heading=${ifDefined(args.heading)}
      variant=${ifDefined(args.variant)}
      action="single"
      href="https://www.designsystem.qld.gov.au/components/card"
      target="_blank"
    >
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-otter/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>

      ${footerTagsHTML}
    </qgds-card>

    <qgds-card
      heading=${ifDefined(args.heading)}
      variant=${ifDefined(args.variant)}
      href="https://www.designsystem.qld.gov.au/components/card"
      target="_blank"
    >
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-otter/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>

      ${footerLinksHTML}
    </qgds-card>
  `,
};

export const FeatureCard: Story = {
  args: {
    heading: "Card title",
    "main-slot": `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem, blanditiis reprehenderit illum voluptas amet est sapiente ea debitis voluptate, mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</p>`,
    tagVariant: "action",
  },
  argTypes: {
    footerType: {
      control: { type: "radio" },
      options: ["none", "links", "tags"],
    },
  },
  render: (args) => html`
    <qgds-card heading=${ifDefined(args.heading)} variant="feature">
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-coffee/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>
    </qgds-card>

    <qgds-card
      heading=${ifDefined(args.heading)}
      variant="feature"
      action="single"
      href="https://www.designsystem.qld.gov.au/components/card"
      target="_blank"
    >
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-coffee/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>
    </qgds-card>

    <qgds-card heading=${ifDefined(args.heading)} variant="feature">
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-coffee/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>

      ${footerTagsHTML}
    </qgds-card>

    <qgds-card heading=${ifDefined(args.heading)} variant="feature">
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-coffee/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>

      ${footerLinksHTML}
    </qgds-card>

    <qgds-card heading=${ifDefined(args.heading)} variant="feature" image-position="end">
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-coffee/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>
    </qgds-card>

    <div style="height: 1rem;"></div>

    <qgds-card heading=${ifDefined(args.heading)} variant="feature" image-position="end">
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-coffee/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>

      ${footerTagsHTML}
    </qgds-card>

    <qgds-card heading=${ifDefined(args.heading)} variant="feature" image-position="end">
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-coffee/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>

      ${footerLinksHTML}
    </qgds-card>
  `,

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
