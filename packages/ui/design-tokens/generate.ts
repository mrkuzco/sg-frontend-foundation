import { FigmaDesignTokensGenerator } from '@sg-foundation/figma-design-tokens';
import { config as configureEnv } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
configureEnv({ path: resolve(__dirname, '../../../.env') });

/**
 * MyStore 2.0 Design System
 * Figma: https://www.figma.com/design/vn9H7ncA03gyiMWuQMAAHV/MyStore---2.0
 */
const mystore = new FigmaDesignTokensGenerator({
  appName: 'MyStore',
  version: 1,
  figmaFileId: 'vn9H7ncA03gyiMWuQMAAHV',
  nodes: [
    {
      lookFor: 'typography',
      nodeId: '28:1916',
    },
  ],
  collections: [
    'VariableCollectionId:17:1812',  // Base Colors
    'VariableCollectionId:18:2407',  // Semantic Colors
    'VariableCollectionId:34:1192',  // Utilities & Typefaces
    'VariableCollectionId:74ea7adbe317038402c669e6a5623566faf64e9d/5577:980',  // Primitives
    'VariableCollectionId:7f4a56c05f6d040e1594dd46c96d56a71e060eb0/52762:322',  // Tokens
  ],
  fetchStyles: {
    textStylePattern: /^(Desktop|Tablet|Mobile|Button|Labels)\//,
    effectStylePattern: /^(Shadow |Focus Ring)/,
    fillStylePattern: /gradient/i,
  },
  ignoreMissingTokens: true,
  distFolder: 'design-tokens/mystore',
});

async function main() {
  console.log('\n🎨 Generating MyStore design tokens from Figma...\n');
  await mystore.generate();
  console.log('\n✅ Done!\n');
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
