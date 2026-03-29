import { FileExportType } from './utils/create-file';

export interface INode {
  /**
   * Can be found in the url of the figma file, when you click on a node
   * Ids use colon (:) instead of dashes (-)
   * @example 256:2352
   */
  nodeId: string;
  /**
   * What type of design tokens you want to generate / expect to find in the node
   *
   * @todo extend with more types
   */
  lookFor: string;
}

/**
 * Individual config options for compound config type.
 */
type ConfigFigmaFileId = {
  /**
   * @description The folder where the generated files are placed
   */
  figmaFileId: string;
};

type ConfigAppName = {
  /**
   * @description The name of the app
   */
  appName: string;
};

type ConfigFigmaAPIToken = {
  /**
   * @description Add your personal figma api token or add it to an .env file
   */
  figmaApiToken?: string;
};

type ConfigNodes = {
  /**
   * @description List of nodes to look for design tokens in.
   */
  nodes?: INode[];
};

type ConfigCollections = {
  /**
   * @description List of variable collections that should be imported.
   */
  collections?: string[];
};

type ConfigFluidFontSizeCallback = {
  /**
   * @description The function will receive the font size as a number and must return a string
   * @warning This function will not be supported in version 2
   * @example (fontSize: number) => `${fontSize}em`
   * @returns string
   */
  customFluidFontSizeFunction?: (fontSize: number) => string;
};

type ConfigGenerateCSS = {
  /**
   * @description Generate a CSS file with custom properties for Tailwind v4.
   * Outputs light/dark mode tokens as CSS custom properties with @theme directive.
   * Specify which variable collections contain light/dark semantic tokens.
   */
  generateCSS?: {
    /** Variable collection IDs that have Light/Dark modes */
    semanticCollections?: string[];
    /** Variable collection IDs for base/primitive colors (single mode) */
    baseCollections?: string[];
    /** Include typography from fetchStyles */
    includeTypography?: boolean;
    /** Include shadows from fetchStyles */
    includeShadows?: boolean;
  };
};

type ConfigFetchStyles = {
  /**
   * @description Fetch text, effect, and fill styles from the file.
   * Uses the two-step approach: get style node_ids from file, then fetch node properties.
   * Useful when styles are defined in a linked library.
   */
  fetchStyles?: {
    /** Pattern to match text style names, e.g. /^(Desktop|Tablet|Mobile|Button|Labels)\// */
    textStylePattern?: RegExp;
    /** Pattern to match effect style names, e.g. /^(Shadow |Focus Ring)/ */
    effectStylePattern?: RegExp;
    /** Pattern to match fill/gradient style names, e.g. /gradient/ */
    fillStylePattern?: RegExp;
  };
};

type ConfigIgnoreMissingTokens = {
  /**
   * @description Decides if missing tokens should be ignored or not. Defaults to showing const with value 'missing'
   * @example export const myColor = 'missing';
   */
  ignoreMissingTokens?: boolean;
};

type ConfigDistFolder = {
  /**
   * @description Choose where to output design token files.
   * @default './design/tokens'
   */
  distFolder?: string;
};

type ConfigFileExportType = {
  /**
   * @description Exports a ts or js file with the design tokens.
   * @default 'ts'
   */
  fileExportType?: FileExportType;
};

export type IConfigV1 = ConfigAppName &
  ConfigFigmaFileId &
  ConfigFigmaAPIToken &
  ConfigNodes &
  ConfigCollections &
  ConfigFluidFontSizeCallback &
  ConfigIgnoreMissingTokens &
  ConfigDistFolder &
  ConfigFileExportType &
  ConfigFetchStyles &
  ConfigGenerateCSS & {
    /**
     * @description The version of the config
     */
    version: 1;

    /**
     * @deprecated Use `nodes` instead.
     */
    nodesList?: never;
  };

export type IConfigV2 = ConfigAppName &
  ConfigFigmaFileId &
  ConfigFigmaAPIToken &
  ConfigCollections &
  ConfigIgnoreMissingTokens &
  ConfigDistFolder &
  ConfigFileExportType & {
    /**
     * @description The version of the config
     */
    version: 2;

    /**
     * Depreacted properties, set to never to cause TS errors.
     */
    nodes?: never;
    customFluidFontSizeFunction?: never;
  };

export type IConfig = IConfigV1 | IConfigV2;
