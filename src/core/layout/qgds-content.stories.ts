import type { StoryObj, Meta } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Core styles/Layout/Content",
  component: "qgds-content",
  args: {},
  render: () => {
    return html`<body class="qgds">
      <div class="qgds-content">
        <h2>This is the content container.</h2>
      </div>
    </body>`;
  },
};

export default meta;

export const Primary: StoryObj = {};
