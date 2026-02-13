import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

//Import custom element definitions to ensure they're registered in Storybook environment
import "./qgds-inpage-nav";
import "./qgds-inpage-nav-item";

//Import types for controls and API tables
import type { QGDSInpageNav } from "./qgds-inpage-nav";

const { args, argTypes, template } =
  getStorybookHelpers<QGDSInpageNav>("qgds-inpage-nav");
type QGDSInpageNavStoryArgs = typeof args;

const meta: Meta<QGDSInpageNavStoryArgs> = {
  title: "Components/QGDS In-page Navigation",
  component: "Inpage Navigation",
  subcomponents: {
    "Nav Item": "qgds-inpage-nav-item",
  },
  tags: ["autodocs"],
  args: {
    ...args,
    "heading": "On this page",
    "heading-level": "h2",
    "arialabel": "In page navigation",
  },
  argTypes: {
    ...argTypes,
  },
  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <qgds-inpage-nav-item href="#introduction"
          >Introduction</qgds-inpage-nav-item
        >
        <qgds-inpage-nav-item href="#overview">Overview</qgds-inpage-nav-item>
        <qgds-inpage-nav-item href="#getting-started"
          >Getting started</qgds-inpage-nav-item
        >
      `,
    ),
};

export default meta;
type Story = StoryObj<QGDSInpageNavStoryArgs>;

export const Default: Story = {
  args: {
    "heading": "On this page",
  },
};

export const CustomTitle: Story = {
  args: {
    "heading": "Table of contents",
    "heading-level": "h3",
    "arialabel": "Custom in-page navigation",
  },
};

export const LongList: Story = {
  args: {
    "heading": "On this page",
    "heading-level": "h2",
    "arialabel": "In page navigation",
  },
  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <qgds-inpage-nav-item href="#section1"
          >Section 1: Introduction</qgds-inpage-nav-item
        >
        <qgds-inpage-nav-item href="#section2"
          >Section 2: Background</qgds-inpage-nav-item
        >
        <qgds-inpage-nav-item href="#section3"
          >Section 3: Requirements</qgds-inpage-nav-item
        >
        <qgds-inpage-nav-item href="#section4"
          >Section 4: Implementation</qgds-inpage-nav-item
        >
        <qgds-inpage-nav-item href="#section5"
          >Section 5: Testing</qgds-inpage-nav-item
        >
        <qgds-inpage-nav-item href="#section6"
          >Section 6: Deployment</qgds-inpage-nav-item
        >
        <qgds-inpage-nav-item href="#section7"
          >Section 7: Maintenance</qgds-inpage-nav-item
        >
      `,
    ),
};
