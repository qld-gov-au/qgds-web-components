import type { StoryObj, Meta } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Core styles/Layout/Container",
  component: "qgds-container",
  render: () => {
    return html`<div class="qgds-container">This is the container content.</div>`;
  },
};

export default meta;

export const Primary: StoryObj = {};
