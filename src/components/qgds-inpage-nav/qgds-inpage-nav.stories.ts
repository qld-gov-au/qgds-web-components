import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import type { QGDSInpageNav } from "./qgds-inpage-nav";
import "./qgds-inpage-nav.ts";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes, template } = getStorybookHelpers<QGDSInpageNav>("qgds-inpage-nav");

/**
 * Storybook args interface using kebab-case attribute names from CEM.
 * This matches the format returned by getStorybookHelpers.
 */
type QGDSInpageNavStoryArgs = typeof args;

const meta: Meta<QGDSInpageNavStoryArgs> = {
  title: "Components/QGDS In-page Navigation",
  tags: ["autodocs"],
  args: {
    ...args,
    navtitle: "On this page",
    "aria-label": "In page navigation",
    "heading-level": "h2",
  },
  argTypes,
  render: (storyArgs) => template(storyArgs),
};

export default meta;
type Story = StoryObj<QGDSInpageNavStoryArgs>;

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
