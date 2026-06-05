import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-vitest", "@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/web-components-vite",
  managerHead: (head) => `
    ${head}
    
    <style>
      #storybook-explorer-menu::before {
        content: "QGDS Web Components";
        display: block;
        margin: 0;
        padding-block: 0.25rem 0.75rem;
        padding-inline: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #666;
      }

      main > div {
        height: 100%;
      }
    </style>
  `,
};
export default config;
