import { FigmaDesignTokensGenerator } from '../index';
import { config as configureEnv } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
configureEnv({ path: resolve(__dirname, '../../../../.env') });

/**
 * MyStore 2.0 Design System
 * Figma: https://www.figma.com/design/vn9H7ncA03gyiMWuQMAAHV/MyStore---2.0
 *
 * Collections (from this file):
 *   - Base Colors: primary, secondary, tertiary, gray, success, warning, danger, info, brand
 *   - Semantic Colors: light/dark mode token mappings
 *   - Utilities & Typefaces: spacing, border-radius, font sizes
 *
 * Styles (from linked libraries, fetched via two-step API):
 *   - Text: Desktop/Tablet/Mobile/Button typography
 *   - Effects: Shadow down/up, Focus rings
 *   - Fills: Gradients
 */
const mystore = new FigmaDesignTokensGenerator({
  appName: 'MyStore',
  version: 1,
  figmaFileId: 'vn9H7ncA03gyiMWuQMAAHV',
  nodes: [],
  collections: [
    'VariableCollectionId:17:1812',  // Base Colors (115 vars)
    'VariableCollectionId:18:2407',  // Semantic Colors (46 vars, Light/Dark)
    'VariableCollectionId:34:1192',  // Utilities & Typefaces (81 vars)
  ],
  fetchStyles: {
    textStylePattern: /^(Desktop|Tablet|Mobile|Button|Labels)\//,
    effectStylePattern: /^(Shadow |Focus Ring)/,
    fillStylePattern: /gradient/i,
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
