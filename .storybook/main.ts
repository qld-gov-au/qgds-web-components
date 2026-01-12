import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/web-components-vite",
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    const path = await import("path");

    return mergeConfig(config, {
      plugins: [
        {
          name: "fix-mdx-react-shim",
          enforce: "pre",
          resolveId(source: string) {
            // Fix the file:// protocol import issue with mdx-react-shim
            if (
              source.includes("mdx-react-shim") &&
              source.startsWith("file://")
            ) {
              // Return the correct module path using the package's exports
              return "@storybook/addon-docs/mdx-react-shim";
            }
            return null;
          },
        },
      ],
      optimizeDeps: {
        include: ["@storybook/addon-docs/mdx-react-shim"],
      },
    });
  },
};
export default config;
