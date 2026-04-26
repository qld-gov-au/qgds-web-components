import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { chromaticModes } from "../../../.storybook/modes";
import { action } from "storybook/actions";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { QGDSCard } from "./qgds-card";
import "./qgds-card";

const { args, argTypes, template } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Card",
  component: "qgds-card",
  tags: ["autodocs"],
  args: {
    ...args,
    action: "single",
    href: "https://www.designsystem.qld.gov.au/components/card",
    target: "_blank",
  },
  argTypes,
  render: (args) => template(args),
  decorators: [(Story) => html` <div style="max-width: 540px;">${Story()}</div> `],
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
    "main-slot": `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem, blanditiis reprehenderit illum voluptas amet est sapiente ea debitis voluptate, mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</p>

  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem, blanditiis reprehenderit illum voluptas amet est
    sapiente ea debitis voluptate, mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</p>

    <ul>
      <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
      <li>Iure autem, blanditiis reprehenderit illum voluptas amet est sapiente ea debitis voluptate.</li>
      <li>Mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</li>
    </ul>`,
  },
};

export const WithImage: Story = {
  args: {
    heading: "Card title",
    "main-slot": `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure autem, blanditiis reprehenderit illum voluptas amet est sapiente ea debitis voluptate, mollitia porro temporibus explicabo voluptates laudantium itaque nemo qui tenetur.</p>`,
  },
  render: (args) => html`
    <qgds-card heading=${ifDefined(args.heading)} variant=${ifDefined(args.variant)}>
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-otter/600/400/?blur"
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
    footerType: "tags",
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
    <qgds-card heading=${ifDefined(args.heading)} variant=${ifDefined(args.variant)}>
      <qgds-image
        slot="image"
        src="https://picsum.photos/seed/qgds-otter/600/400/?blur"
        alt="Placeholder image"
      ></qgds-image>

      <div slot="main">${unsafeHTML(args["main-slot"] as string)}</div>

      ${args.footerType === "links"
        ? html`
            <div slot="footer-links">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
            </div>
          `
        : ""}
      ${args.footerType === "tags"
        ? html`
            <div slot="footer-tags">
              <qgds-tag label="Action" variant="${ifDefined(args.tagVariant)}"></qgds-tag>
              <qgds-tag label="Action" variant="${ifDefined(args.tagVariant)}"></qgds-tag>
              <qgds-tag label="Action" variant="${ifDefined(args.tagVariant)}"></qgds-tag>
            </div>
          `
        : ""}
    </qgds-card>
  `,
};
