import { FigmaDesignTokensGenerator } from '@sg-foundation/figma-design-tokens';
import { config as configureEnv } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from monorepo root
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
      nodeId: '28:1916', // Foundation > Typography frame
    },
  ],
  collections: [
    'VariableCollectionId:17:1812',  // Base Colors (115 vars)
    'VariableCollectionId:18:2407',  // Semantic Colors (54 vars, Light/Dark)
    'VariableCollectionId:34:1192',  // Utilities & Typefaces (83 vars)
    'VariableCollectionId:74ea7adbe317038402c669e6a5623566faf64e9d/5577:980',  // Primitives (54 vars)
    'VariableCollectionId:7f4a56c05f6d040e1594dd46c96d56a71e060eb0/52762:322',  // Tokens (53 vars, Light/Dark)
  ],
  ignoreMissingTokens: false,
  distFolder: 'design-tokens/mystore',
});

async function main() {
  console.log('\n🎨 Generating MyStore design tokens from Figma...\n');
  await mystore.generate();
  console.log('\n✅ Done!\n');
}

main().catch((err) => {
  console.error('Failed to generate tokens:', err.message);
  process.exit(1);
});
