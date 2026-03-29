import { IComponent, IStyle, NodeType, FigmaNode } from './types';

export interface IFigmaAPIResult<TMetaData> {
  status?: number;
  error?: boolean;
  meta?: TMetaData;
}

/** A description of a user */
export interface IUser {
  /** Unique stable id of the user */
  id: string;
  /** Name of the user */
  handle: string;
  /** URL link to the user's profile image */
  img_url: string;
  /** Email associated with the user's account. This will only be present on the /v1/me endpoint */
  email?: string;
}

export type StyleType = 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';

export interface IStyleMetadata {
  /** The unique identifier of the style */
  key: string;
  /** The unique identifier of the file which contains the style */
  file_key: string;
  /** Id of the style node within the figma file */
  node_id: string;
  /** The type of style */
  style_type: StyleType;
  /** URL link to the style's thumbnail image */
  thumbnail_url: string;
  /** Name of the style */
  name: string;
  /** The description of the style as entered by the publisher */
  description: string;
  /** The UTC ISO 8601 time at which the component set was created */
  created_at: string;
  /** The UTC ISO 8601 time at which the style was updated */
  updated_at: string;
  /** The user who last updated the style */
  sort_position: string;
  /** A user specified order number by which the style can be sorted */
  user: IUser;
}

export type GetFileStylesResult = IFigmaAPIResult<{
  styles: IStyleMetadata[];
}>;

/** The `name`, `lastModified`, `thumbnailUrl`, and `version` attributes are all metadata of the specified file. */
export interface IGetFileNodesResult<NType extends NodeType = NodeType> {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  err?: string;
  nodes: {
    [nodeId: string]: {
      document: FigmaNode<NType>;
      components: { [nodeId: string]: IComponent };
      schemaVersion: number;
      styles: { [styleName: string]: IStyle };
    } | null;
  };
}

export interface IRGBA {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  /** "Alpha" or "opacity" */
  readonly a: number;
}

export interface IRGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export type Color = IRGBA | IRGB;

/** A structure used to describe when a particular node or variable is directly bound to a variable. */
export interface IVariableAlias {
  type: 'VARIABLE_ALIAS';
  id: string;
}

export type VariableScope =
  | 'ALL_SCOPES'
  | 'TEXT_CONTENT'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'GAP'
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR';

export type CodeSyntaxPlatform = 'WEB' | 'ANDROID' | 'iOS';
export type VariableCodeSyntax = { [platform in CodeSyntaxPlatform]?: string };

export interface IVariable {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: 'BOOLEAN' | 'FLOAT' | 'string' | 'COLOR';
  valuesByMode: {
    [modeId: string]: boolean | number | string | Color | IVariableAlias;
  };
  remote: boolean;
  description: string;
  hiddenFromPublishing: boolean;
  scopes: VariableScope[];
  codeSyntax: VariableCodeSyntax;
}

export type VariableId = string;

export interface IVariableCollection {
  id: string;
  name: string;
  modes: [
    {
      modeId: string;
      name: string;
    },
  ];
  defaultModeId: string;
  remote: boolean;
  hiddenFromPublishing: boolean;
}

export type VariableCollectionId = string;

export interface IFetchFigmaVariablesResult {
  variables: Record<VariableId, IVariable>;
  variableCollections: Record<VariableCollectionId, IVariableCollection>;
}

export type GetVariablesResult = IFigmaAPIResult<IFetchFigmaVariablesResult>;

export function isVariableAlias(
  value: boolean | number | string | Color | IVariableAlias
): value is IVariableAlias {
  return (value as IVariableAlias)?.type === 'VARIABLE_ALIAS';
}

export function isColorValue(
  value: boolean | number | string | Color
): value is Color {
  return typeof (value as Color)?.b === 'number';
}
