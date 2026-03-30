import type { Preview } from '@storybook/react-vite'
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--color-surface-lighter, #fafafa)' },
        { name: 'white', value: 'var(--color-surface-lightest, #ffffff)' },
        { name: 'dark', value: 'var(--color-surface-inverse, #002936)' },
      ],
    },
  },
};

export default preview;
