import {
  FigmaNode,
  TypeStyle,
  isNodeType,
  isNodeTypeWithChildren,
} from '../figmaAPI/types';

/**
 * @description Finds the typography tokens in a figma node and returns the typography tokens
 */
export function findTypographyTokens(
  nodeId: string,
  parentNode: FigmaNode
): undefined | TypeStyle {
  if (!isNodeTypeWithChildren(parentNode)) return undefined;

  for (const node of parentNode.children) {
    if (
      isNodeType(node, 'TEXT') &&
      node.styles?.text === nodeId &&
      node.style
    ) {
      return node.style;
    }
    const result = findTypographyTokens(nodeId, node);
    if (result) return result;
  }
  return undefined;
}
