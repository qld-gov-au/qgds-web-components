import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import "./qgds-inpage-alert";
import { QGDSInpageAlertProps } from "./qgds-inpage-alert";

type TArgs = QGDSInpageAlertProps & { content: string };

const meta: Meta<TArgs> = {
  title: "Components/QGDS In-page alert",
  component: "qgds-inpage-alert",
  tags: ["autodocs"],

  parameters: {
    docs: {
      description: {
        component: `## \`<qgds-inpage-alert>\`
        
In-page alerts are a helpful tool for informing users about essential updates or modifications on a webpage, all while capturing their attention without disrupting their ongoing task.

Usually positioned at the top of a page after a submit action, these alerts are designed to be noticeable yet unobtrusive.`,
      },
    },
  },
  args: {
    heading: "Here is the heading",
    content: "<span>And here is the content.</span>",
  },

  render: (args) => html`
    <qgds-inpage-alert heading="${args.heading}" variant="${args.variant}">
      ${unsafeHTML(args.content)}
    </qgds-inpage-alert>
  `,
};

export default meta;

type Story = StoryObj<TArgs>;

export const Info: Story = {
  args: {
    ...meta.args,
    variant: "info",
  },
};

export const AllVariants: Story = {
  decorators: [
    (story) =>
      html`<div>
        <style>
          qgds-inpage-alert:not(:last-child) {
            margin-bottom: 20px;
          }</style
        >${story()}
      </div>`,
  ],
  render: (args) => {
    return html`
      <qgds-inpage-alert heading="${args.heading}" variant="info">
        ${unsafeHTML(args.content)}
      </qgds-inpage-alert>

      <qgds-inpage-alert heading="${args.heading}" variant="error">
        ${unsafeHTML(args.content)}
      </qgds-inpage-alert>

      <qgds-inpage-alert heading="${args.heading}" variant="success">
        ${unsafeHTML(args.content)}
      </qgds-inpage-alert>

      <qgds-inpage-alert heading="${args.heading}" variant="warning">
        ${unsafeHTML(args.content)}
      </qgds-inpage-alert>
    `;
  },
};
