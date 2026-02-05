import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

// Import the component and its properties type
import "./qgds-inpage-nav.ts";
import { QGDSInpageNavProps } from "./qgds-inpage-nav";

// Import the child item component and its properties type to use in the story
import "../qgds-inpage-nav-item/qgds-inpage-nav-item.ts";

// Create a type alias for the story props
type StoryProps = QGDSInpageNavProps & {
  items?: { href: string; text: string }[];
};

/** QGDS In-page Navigation Web Component */
const renderInpageNav = ({
  heading = "On this page",
  headingLevel = "h2",
  ariaLabel = "In page navigation",
  items = [
    { href: "#section1", text: "Section 1" },
    { href: "#section2", text: "Section 2" },
    { href: "#section3", text: "Section 3" },
    { href: "#section4", text: "Section 4" },
    { href: "#section5", text: "Section 5" },
  ],
}: StoryProps) => {
  return html`
    <qgds-inpage-nav
      heading="${heading}"
      heading-level="${headingLevel}"
      arialabel="${ariaLabel}">
      ${items.map(
        /* prettier-ignore */
        (item) => html`
        <qgds-inpage-nav-item href="${item.href}">${item.text}</qgds-inpage-nav-item>
        `,
      )}
    </qgds-inpage-nav>
  `;
};

const meta: Meta<StoryProps> = {
  title: "Components/QGDS In-page Navigation",
  tags: ["autodocs"],
  render: (args) => renderInpageNav(args),
  argTypes: {
    heading: {
      control: "text",
      description: "Inpage heading text",
      table: {
        category: "Attributes",
      },
    },
    headingLevel: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      name: "heading-level",
      description: "Semantic heading level (h1-h6)",
      table: {
        category: "Attributes",
      },
    },
    ariaLabel: {
      control: "text",
      name: "arialabel",
      description: "Accessible label for the nav element",
      table: {
        category: "Attributes",
      },
    },
    items: {
      control: false,
      name: "Nav Items",
      description:
        "(Storybook only).<br>Array for child <qgds-inpage-nav-item> elements - refer code examples for markup.",
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryProps>;

export const Default: Story = {
  args: {
    heading: "On this page",
    items: [
      { href: "#section1", text: "Section 1" },
      { href: "#section2", text: "Section 2" },
      { href: "#section3", text: "Section 3" },
      { href: "#section4", text: "Section 4" },
      { href: "#section5", text: "Section 5" },
    ],
  },
};

export const CustomTitle: Story = {
  args: {
    heading: "Table of contents",
    headingLevel: "h3",
    ariaLabel: "Custom in-page navigation",
    items: [
      { href: "#section1", text: "Section 1" },
      { href: "#section2", text: "Section 2" },
      { href: "#section3", text: "Section 3" },
    ],
  },
};

export const LongList: Story = {
  args: {
    heading: "On this page",
    headingLevel: "h2",
    ariaLabel: "In page navigation",
    items: [
      { href: "intro", text: "Introduction" },
      { href: "getting-started", text: "Getting started" },
      { href: "installation", text: "Installation" },
      { href: "configuration", text: "Configuration" },
      { href: "usage", text: "Usage examples" },
      { href: "api", text: "API reference" },
      { href: "advanced", text: "Advanced topics" },
      { href: "troubleshooting", text: "Troubleshooting" },
      { href: "faq", text: "Frequently asked questions" },
      { href: "support", text: "Support" },
    ],
  },
};
