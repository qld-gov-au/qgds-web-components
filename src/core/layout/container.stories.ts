import type { StoryObj, Meta } from "@storybook/web-components-vite";
import { html } from "lit";

interface Container {
  hasNoPadding: boolean;
}

const meta = {
  title: "Core styles/Layout/Container",
  component: "qgds-container",
  tags: ["!dev"],
  args: {
    hasNoPadding: false,
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
  render: (args) => {
    return html`<div class="qgds-container${args.hasNoPadding ? " has-no-padding" : ""}">
      <div>This is the container content.</div>
    </div>`;
  },
  decorators: [
    (story) =>
      html` <style>
          .qgds-container > div {
            background-color: color-mix(#005eb8, transparent 85%);

            padding: 8px;
          }

          .sbdocs-content {
            display: grid;
            grid-template-columns: 1fr min(100%, 1000px) 1fr;
            grid-template-areas: ". content .";
            max-width: unset;
          }

          .sbdocs-content > * {
            grid-column: content;
          }

          .sbdocs-preview,
          .sbdocs-preview-actions {
            grid-column: 1 / -1;
          }

          .sbdocs-preview-actions {
            margin-bottom: 0;
          }
        </style>
        ${story()}`,
  ],
} satisfies Meta<Container>;

export default meta;

export const Default: StoryObj = {};
