# figma design tokens

Package for importing figma design tokens.

Currently only exports to tailwind config.

## Usage

```ts
// generate-design-tokens.ts
import { FigmaDesignTokensGenerator } from '@salling-group/figma-design-tokens';

const designTokener = new FigmaDesignTokensGenerator({
  figmaFileId: 'KvnKtVv6syZZUb5XJrUkWl',
  nodesList: [
    {
      lookFor: 'typography',
      nodeId: '235-44452', // https://www.figma.com/file/KvnKtVv6syZZUb5XJrUkWl/NUI?type=design&node-id=235-44452&t=7fbXn1V1EOJTHK3B-4
    },
  ],
  ignoreMissingTokens: false,
  distFolder: './generated/figma-tokens',
  customFluidFontSizeFunction: (fontSize) => `${fontSize / 16}rem`,
});

designTokener.generate();
```
#ENV EXAMPLE

FIGMA_API_TOKEN="YOUR FIGMA API TOKEN"
