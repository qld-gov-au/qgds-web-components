import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
//Import custom element definitions to ensure they're registered in Storybook environment
import "./qgds-breadcrumbs";
import "./qgds-breadcrumbs-item";

import type { QGDSBreadcrumbs } from "./qgds-breadcrumbs";

const { args, argTypes, template } = getStorybookHelpers<QGDSBreadcrumbs>("qgds-breadcrumbs");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Breadcrumbs",
  component: "qgds-breadcrumbs",
  subcomponents: {
    "Breadcrumb Item": "qgds-breadcrumbs-item",
  },
  tags: ["autodocs"],
  args,
  argTypes,
  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <qgds-breadcrumbs-item href="/home">Home</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level2">Level 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level3">Level 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/level4">Level 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/current_page">Current page</qgds-breadcrumbs-item>
      `
    ),
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    "aria-label": "Breadcrumbs with default items",
  },
};

export const WithLongText: Story = {
  args: {
    "aria-label": "Breadcrumbs with long text",
  },
  render: (storyArgs) =>
    template(
      { ...storyArgs },
      html`
        <qgds-breadcrumbs-item href="/home">Home Page</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/page1"
          >Page 1 is having a very long name that is longer than the others</qgds-breadcrumbs-item
        >
        <qgds-breadcrumbs-item href="/page2">Page 2</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/page3">Page 3</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/page4">Page 4</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/page5">Page 5</qgds-breadcrumbs-item>
        <qgds-breadcrumbs-item href="/page6"
          >Parent page is having a very long name that is longer than the others, a very long name that is longer than
          the others</qgds-breadcrumbs-item
        >
        <qgds-breadcrumbs-item href="/page7"
          >Current page is having a very long name that is longer than the others which is very long name that is longer
          than the others</qgds-breadcrumbs-item
        >
      `
    ),
};
