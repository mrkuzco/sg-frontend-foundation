/* eslint-disable */
// @ts-ignore
require('dotenv').config();
import { FigmaDesignTokensGenerator, FigmaInterfaceApp } from '..';

const myApp = new FigmaDesignTokensGenerator({
  version: 1,
  appName: 'example',
  figmaFileId: 'd5Dj4TKv8ZwwCsXis9eRd9',
  ignoreMissingTokens: false,
  distFolder: './src/example/output',
  customFluidFontSizeFunction: (fontSize) => `${fontSize / 16}rem`,
  collections: ['VariableCollectionId:142:6623'],
});

new FigmaInterfaceApp<FigmaDesignTokensGenerator>([myApp]).run();
