import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import "./qgds-callout";
import { QGDSCalloutProps } from "./qgds-callout";

/** QGDS Callout Web Component */
const renderCallout = ({
  heading,
  headingLevel,
  content,
}: QGDSCalloutProps) => {
  return html`
    <qgds-callout heading="${heading}" heading-level="${headingLevel ?? "h3"}">
      ${unsafeHTML(content)}
    </qgds-callout>
  `;
};

const meta: Meta<QGDSCalloutProps> = {
  title: "Components/QGDS Callout",
  component: "qgds-callout",
  tags: ["autodocs"],
  render: (args) => renderCallout(args),

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

  argTypes: {
    headingLevel: {
      control: {
        type: "select",
      },
      options: ["h2", "h3", "h4", "h5", "h6"],
      description: "",
      defaultValue: { value: "h3" },
    },
  },
};

export default meta;
type Story = StoryObj<QGDSCalloutProps>;

export const Default: Story = {
  args: {
    heading: "Important information",
    headingLevel: "h3",
    content: "<p>This is a callout with simple paragraph.</p>",
  },
};

export const Complex: Story = {
  args: {
    heading: "Important information",
    headingLevel: "h3",
    content: `<p>This is a callout with more complex content, including <strong>bold text</strong>, <em>italic text</em> and a list of items.</p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>`,
  },
};
