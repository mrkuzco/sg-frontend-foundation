import { FigmaDesignTokensGenerator } from '../index';
import { config as configureEnv } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
configureEnv({ path: resolve(__dirname, '../../../../.env') });

/**
 * MyStore 2.0 Design System
 * Figma: https://www.figma.com/design/vn9H7ncA03gyiMWuQMAAHV/MyStore---2.0
 */
const mystore = new FigmaDesignTokensGenerator({
  appName: 'MyStore',
  version: 1,
  figmaFileId: 'vn9H7ncA03gyiMWuQMAAHV',
  nodes: [],
  collections: [
    'VariableCollectionId:17:1812',  // Base Colors (TS export)
    'VariableCollectionId:34:1192',  // Utilities & Typefaces (TS export)
  ],
  fetchStyles: {
    // Only fetch styles created for the MyStore design system
    textStylePattern: /^(Desktop|Tablet|Mobile|Button|Labels)\//,
    effectStylePattern: /^(Shadow (down|up)|Focus Ring)\//,
    fillStylePattern: /^gradient\//,
  },
  generateCSS: {
    baseCollections: [
      'VariableCollectionId:17:1812',  // Base Colors
      'VariableCollectionId:34:1192',  // Utilities & Typefaces
    ],
    semanticCollections: [
      'VariableCollectionId:18:2407',  // Semantic Colors (Light/Dark)
    ],
  },
  ignoreMissingTokens: true,
  distFolder: '../ui/src/themes/mystore/generated',
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
