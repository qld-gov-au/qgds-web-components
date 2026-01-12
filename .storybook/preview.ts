import type { Preview } from '@storybook/web-components-vite'
import { withThemeByClassName } from '@storybook/addon-themes';
import { html } from 'lit';
import '../src/stories/assets/qgds-styles.scss';

const preview: Preview = {
  parameters: {
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
      test: 'todo'
    }
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'qgds-dark-theme',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;