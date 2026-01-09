import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "./qgds-inpage-nav.ts";

export interface QGDSInpageNavProps {
  /** Navigation title */
  navtitle: string;
  /** Navigation items array */
  navitems: { linkid: string; linktext: string }[];
  /** Variant style (default or dark) */
  variant: "default" | "dark" | "dark-alt";
}

/** QGDS In-page Navigation Web Component */
const renderInpageNav = ({
  navtitle = "On this page",
  navitems = [],
  variant = "default",
}: QGDSInpageNavProps) => {
  return html`
    <qgds-inpage-nav
      navtitle="${navtitle}"
      variant="${variant}"
      .navitems="${navitems}"
    >
    </qgds-inpage-nav>
  `;
};

const meta: Meta<QGDSInpageNavProps> = {
  title: "Components/QGDS In-page Navigation",
  tags: ["autodocs"],
  render: (args) => renderInpageNav(args),
  argTypes: {
    navtitle: { control: "text" },
    variant: {
      control: "select",
      options: ["default", "dark", "dark-alt"],
    },
    navitems: { control: "object" },
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
    variant: "default",
  },
};

export const Dark: Story = {
  args: {
    navtitle: "On this page",
    navitems: defaultNavItems,
    variant: "dark",
  },
};

export const DarkAlt: Story = {
  args: {
    navtitle: "On this page",
    navitems: defaultNavItems,
    variant: "dark-alt",
  },
};

export const CustomTitle: Story = {
  args: {
    navtitle: "Table of contents",
    navitems: defaultNavItems,
    variant: "default",
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
    variant: "default",
  },
};
