import type { StoryObj, Meta } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Core styles/Layout/Container",
  args: {
    "Has no padding": false,
  },
  render: (args) => {
    return html`<div class="qgds-container${args["Has no padding"] ? " has-no-padding" : ""}">
      This is the container content.
    </div>`;
  },
};

export default meta;

export const Primary: StoryObj = {};
