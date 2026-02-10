import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import type { QGDSCallout } from "./qgds-callout";
import "./qgds-callout";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes, template } = getStorybookHelpers<QGDSCallout>("qgds-callout");

/**
 * Storybook args interface using kebab-case attribute names from CEM.
 * This matches the format returned by getStorybookHelpers.
 */
type QGDSCalloutStoryArgs = typeof args & { content?: string };

const meta: Meta<QGDSCalloutStoryArgs> = {
  title: "Components/QGDS Callout",
  tags: ["autodocs"],
  args: {
    ...args,
    heading: "Important information",
    "heading-level": "h3",
  },
  argTypes: {
    ...argTypes,
    content: {
      control: "text",
      description: "Slot content for the callout body",
      table: {
        category: "slots",
      },
    },
  },
  render: (storyArgs) => {
    const { content, ...componentArgs } = storyArgs;
    const safeContent = typeof content === "string" ? content : "";
    return html`
      ${template(componentArgs)}
        ${unsafeHTML(safeContent)}
      </qgds-callout>
    `;
  },
  parameters: {
    docs: {
      story: {
        inline: true,
      },
      description: {
        component: `## \`<qgds-callout>\`

This component is used to highlight important information within content areas. It features a prominent border and background to draw attention to its contents.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<QGDSCalloutStoryArgs>;

export const Default: Story = {
  args: {
    heading: "Important information",
    "heading-level": "h3",
    content: "<p>This is a callout with simple paragraph.</p>",
  },
};

export const Complex: Story = {
  args: {
    heading: "Important information",
    "heading-level": "h3",
    content: `<p>This is a callout with more complex content, including <strong>bold text</strong>, <em>italic text</em> and a list of items.</p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>`,
  },
};
