import type { Preview } from "@storybook/web-components-vite";
import { setCustomElementsManifest } from "@storybook/web-components-vite";
import { setStorybookHelpersConfig } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import "../src/styles/main.scss";
import { palettes } from "../src/utils";
import customElementsManifest from "../custom-elements.json";
import DocumentationTemplate from "./templates/DocumentationTemplate.mdx";

// Register custom elements manifest for API documentation
// This enables automatic API tables and controls in Storybook autodocs
setCustomElementsManifest(customElementsManifest);

// Configure @wc-toolkit/storybook-helpers
setStorybookHelpersConfig({
  // Use type info from Custom Elements Manifest for controls
  hideArgRef: true, // perhaps can be based on env variable, false for local?
  renderDefaultValues: true,
});

const preview: Preview = {
  parameters: {
    tags: ["autodocs"],
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    layout: "fullscreen",

    docs: {
      page: DocumentationTemplate,
      codePanel: true,
      source: {
        // Global default. Override this in local stories to include decorators
        excludeDecorators: true,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  globalTypes: {
    globalPalette: {
      name: "QGDS Palette",
      description: "Default environment palette for components",
      defaultValue: "default",
      toolbar: {
        // icons: https://main--64b56e737c0aeefed9d5e675.chromatic.com/?path=/docs/introduction--docs
        icon: "paintbrush",
        items: Object.entries(palettes).map(([key, value]) => {
          return { value: key, title: value };
        }),
      },
    },
  },

  decorators: [
    (Story, context) => {
      // Get the selected palette from global types (storybook toolbar)
      const paletteName = context?.globals?.globalPalette || "default";

      return html`
        <div class="qgds-palette-${paletteName}" style="padding: 2rem">
          ${Story()}
        </div>
      `;
    },
  ],
};

export default preview;
