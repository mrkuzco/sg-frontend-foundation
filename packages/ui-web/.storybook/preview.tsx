import type { Preview } from '@storybook/react-vite';
import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design system theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'mystore', title: 'MyStore', icon: 'store' },
          // Future themes:
          // { value: 'netto', title: 'Netto', icon: 'store' },
          // { value: 'bilka', title: 'Bilka', icon: 'store' },
        ],
        dynamicTitle: true,
      },
    },
    colorMode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'mystore',
    colorMode: 'light',
  },
  decorators: [
    (Story, context) => {
      const colorMode = context.globals.colorMode || 'light';
      // When we have multiple themes, we'd swap the CSS import here
      // const theme = context.globals.theme || 'mystore';

      return (
        <div
          className={colorMode === 'dark' ? 'dark' : ''}
          style={{
            padding: '24px',
            minHeight: '100px',
            backgroundColor: colorMode === 'dark'
              ? 'var(--color-surface-lightest)'
              : 'var(--color-surface-lighter)',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
