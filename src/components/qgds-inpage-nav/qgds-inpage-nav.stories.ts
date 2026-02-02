import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "./qgds-inpage-nav.ts";
import { QGDSInpageNavProps } from "./qgds-inpage-nav";

/** QGDS In-page Navigation Web Component */
const renderInpageNav = ({
  navtitle = "On this page",
  navitems = [],
  ariaLabel = "In page navigation",
  headingLevel = "h2",
}: QGDSInpageNavProps) => {
  return html`
    <qgds-inpage-nav
      navtitle="${navtitle}"
      ariaLabel="${ariaLabel}"
      headingLevel="${headingLevel}"
      .navitems="${navitems}">
    </qgds-inpage-nav>
  `;
};

const meta: Meta<QGDSInpageNavProps> = {
  title: "Components/QGDS In-page Navigation",
  tags: ["autodocs"],
  render: (args) => renderInpageNav(args),
  argTypes: {
    navtitle: { control: "text" },
    navitems: { control: "object" },
    ariaLabel: { control: "text" },
    headingLevel: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
  },
};

export default meta;
type Story = StoryObj<QGDSInpageNavProps>;

const defaultNavItems = [
  { linkid: "section1", linktext: "List item" },
  { linkid: "section2", linktext: "List item" },
  { linkid: "section3", linktext: "List item" },
  { linkid: "section4", linktext: "List item" },
  { linkid: "section5", linktext: "List item" },
];

export const Default: Story = {
  args: {
    navtitle: "On this page",
    navitems: defaultNavItems,
  },
};

export const CustomTitle: Story = {
  args: {
    navtitle: "Table of contents",
    navitems: defaultNavItems,
  },
};

export const LongList: Story = {
  args: {
    navtitle: "On this page",
    navitems: [
      { linkid: "intro", linktext: "Introduction" },
      { linkid: "getting-started", linktext: "Getting started" },
      { linkid: "installation", linktext: "Installation" },
      { linkid: "configuration", linktext: "Configuration" },
      { linkid: "usage", linktext: "Usage examples" },
      { linkid: "api", linktext: "API reference" },
      { linkid: "advanced", linktext: "Advanced topics" },
      { linkid: "troubleshooting", linktext: "Troubleshooting" },
      { linkid: "faq", linktext: "Frequently asked questions" },
      { linkid: "support", linktext: "Support" },
    ],
  },
};
