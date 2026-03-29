import fetch from 'node-fetch';
import {
  GetFileStylesResult,
  GetVariablesResult,
  IFetchFigmaVariablesResult,
  IGetFileNodesResult,
  IStyleMetadata,
} from './apiTypes';
import { FigmaNode } from './types';
import { toQueryParams } from '../utils/toQueryParams';
import { logMessage } from '../utils/logMessage';

const fetchFromFigma = async (relativeUrl: string): Promise<unknown> => {
  const url = new URL(relativeUrl, 'https://api.figma.com/v1/');
  const response = await fetch(url, {
    headers: {
      'X-FIGMA-TOKEN': process.env.FIGMA_API_TOKEN || '',
    },
  });

  return response.json();
};

/**
 * @description Gets the defined styles from a figma team library
 */
export const fetchFigmaStyles = async (
  figmaFileId: string
): Promise<IStyleMetadata[]> => {
  try {
    const { meta } = (await fetchFromFigma(
      `files/${figmaFileId}/styles`
    )) as GetFileStylesResult;
    return meta?.styles ?? [];
  } catch (error) {
    throw new Error(
      `Error trying to get styles. Are you sure you are using the right Figma file id:\n ${error}`
    );
  }
};

/**
 * @description Gets the nodes from a figma file based on the node ids
 */
export const fetchFigmaFileNodes = async (
  nodeIds: string[],
  figmaFileId: string
): Promise<FigmaNode[]> => {
  const nodesIds = nodeIds.join(',');
  const queryParams = toQueryParams({ ids: nodesIds });

  try {
    const figmaFileData = (await fetchFromFigma(
      `files/${figmaFileId}/nodes?${queryParams}`
    )) as IGetFileNodesResult;

    const nodes = nodeIds
      .map((nodeId) => figmaFileData.nodes[nodeId])
      .filter(Boolean);

    if (nodes.length === 0) {
      throw new Error('No nodes found');
    }

    if (nodes.length !== nodeIds.length) {
      logMessage(
        `Could not find all nodes. Found ${nodes.length} out of ${nodeIds.length}`,
        'warning'
      );
    }

    return nodes.map((node) => node!.document);
  } catch (error) {
    throw new Error(
      `Error trying to get nodes with ids: ${nodesIds}: ${error}`
    );
  }
};

/**
 * @description Lets you enumerate local variables created in the file and remote variables used in the file.
 */
export const fetchFigmaVariables = async (
  figmaFileId: string
): Promise<IFetchFigmaVariablesResult> => {
  try {
    const data = (await fetchFromFigma(
      `files/${figmaFileId}/variables/local`
    )) as GetVariablesResult;

    if (data.error || !data.meta)
      throw new Error(JSON.stringify(data, null, 2));

    return data.meta;
  } catch (error) {
    throw new Error(
      `Error trying to get variables. Are you sure you are using the right Figma file id:\n ${error}`
    );
  }
};
