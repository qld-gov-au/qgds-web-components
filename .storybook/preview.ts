import type { Preview } from "@storybook/web-components-vite";
import { html } from "lit";

import "../src/stories/assets/qgds-styles.scss";
import { palettes } from "../src/js/utils/palettes";

const preview: Preview = {
  parameters: {
    tags: ["autodocs"],
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
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

      // Find and apply palette class to all .docs-story and .sb-show-main elements
      setTimeout(() => {
        const storyElements = document.querySelectorAll(
          ".docs-story, .sb-show-main",
        );

        storyElements.forEach((el) => {
          // Remove any existing palette classes
          el.classList.forEach((className) => {
            if (className.startsWith("palette-")) {
              el.classList.remove(className);
            }
          });
          // Add the current palette class
          el.classList.add(`palette-${paletteName}`);
        });
      }, 0);

      return html`${Story()}`;
    },
  ],
};

export default preview;
