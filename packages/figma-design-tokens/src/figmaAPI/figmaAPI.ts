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
 * @description Gets all styles referenced in a file (including from linked libraries).
 * Returns style metadata keyed by node_id. Use fetchFigmaFileNodesBatched to get actual properties.
 */
export const fetchFigmaFileStyles = async (
  figmaFileId: string
): Promise<Record<string, { name: string; styleType: string }>> => {
  try {
    const data = (await fetchFromFigma(`files/${figmaFileId}`)) as any;
    return data.styles || {};
  } catch (error) {
    throw new Error(`Error fetching file styles: ${error}`);
  }
};

/**
 * @description Fetches nodes in batches (Figma has URL length limits).
 * Returns a map of node_id -> node document.
 */
export const fetchFigmaFileNodesBatched = async (
  nodeIds: string[],
  figmaFileId: string,
  batchSize = 50
): Promise<Record<string, any>> => {
  const result: Record<string, any> = {};
  for (let i = 0; i < nodeIds.length; i += batchSize) {
    const batch = nodeIds.slice(i, i + batchSize);
    const queryParams = toQueryParams({ ids: batch.join(',') });
    const data = (await fetchFromFigma(
      `files/${figmaFileId}/nodes?${queryParams}`
    )) as IGetFileNodesResult;

    for (const [id, nodeData] of Object.entries(data.nodes || {})) {
      if (nodeData?.document) result[id] = nodeData.document;
    }
  }
  return result;
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
