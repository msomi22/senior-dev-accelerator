import type { LearningNode } from '../core/index.ts';
import { getChildIds, normalizeLearningNode } from '../core/index.ts';
import type {
  LearningNodeOrId,
  LearningNodeRegistry,
  LearningNodeRegistryInput,
  LearningNodeRegistrySource
} from './registry.types.ts';

function resolveNodeId(nodeOrId: LearningNodeOrId): string {
  return typeof nodeOrId === 'string' ? nodeOrId : nodeOrId.id;
}

function addUnique(map: Map<string, string[]>, key: string, value: string): void {
  const currentValues = map.get(key) || [];
  if (!currentValues.includes(value)) {
    map.set(key, [...currentValues, value]);
  }
}

function cloneNode(node: LearningNode): LearningNode {
  return normalizeLearningNode(node);
}

export function getDuplicateNodeIds(nodes: LearningNode[]): string[] {
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();

  nodes.forEach((node) => {
    if (seenIds.has(node.id)) {
      duplicateIds.add(node.id);
      return;
    }

    seenIds.add(node.id);
  });

  return [...duplicateIds].sort();
}

export function indexLearningNodes(nodes: LearningNode[]): LearningNodeRegistry {
  const nodesById = new Map<string, LearningNode>();
  const childIdsByParentId = new Map<string, string[]>();
  const parentIdByChildId = new Map<string, string>();

  nodes.forEach((node) => {
    const normalizedNode = cloneNode(node);
    nodesById.set(normalizedNode.id, normalizedNode);
  });

  nodesById.forEach((node) => {
    getChildIds(node).forEach((childId) => {
      addUnique(childIdsByParentId, node.id, childId);
      if (!parentIdByChildId.has(childId)) {
        parentIdByChildId.set(childId, node.id);
      }
    });

    if (node.parentId) {
      addUnique(childIdsByParentId, node.parentId, node.id);
      parentIdByChildId.set(node.id, node.parentId);
    }
  });

  return {
    nodesById,
    childIdsByParentId,
    parentIdByChildId
  };
}

export function createLearningNodeRegistry(input: LearningNodeRegistryInput): LearningNodeRegistry {
  return indexLearningNodes(input.nodes);
}

export function getNodeById(registry: LearningNodeRegistry, id: string): LearningNode | undefined {
  return registry.nodesById.get(id);
}

export function getChildren(registry: LearningNodeRegistry, nodeOrId: LearningNodeOrId): LearningNode[] {
  const nodeId = resolveNodeId(nodeOrId);
  const childIds = registry.childIdsByParentId.get(nodeId) || [];

  return childIds
    .map((childId) => getNodeById(registry, childId))
    .filter((node): node is LearningNode => Boolean(node));
}

export function getParent(registry: LearningNodeRegistry, nodeOrId: LearningNodeOrId): LearningNode | undefined {
  const nodeId = resolveNodeId(nodeOrId);
  const parentId = registry.parentIdByChildId.get(nodeId);
  return parentId ? getNodeById(registry, parentId) : undefined;
}

export function getAncestors(registry: LearningNodeRegistry, nodeOrId: LearningNodeOrId): LearningNode[] {
  const ancestors: LearningNode[] = [];
  const visitedIds = new Set<string>();
  let currentNodeId = resolveNodeId(nodeOrId);

  while (!visitedIds.has(currentNodeId)) {
    visitedIds.add(currentNodeId);
    const parent = getParent(registry, currentNodeId);

    if (!parent) break;

    ancestors.push(parent);
    currentNodeId = parent.id;
  }

  return ancestors;
}

export function getDescendants(registry: LearningNodeRegistry, nodeOrId: LearningNodeOrId): LearningNode[] {
  const descendants: LearningNode[] = [];
  const visitedIds = new Set<string>();
  const pendingIds = [resolveNodeId(nodeOrId)];

  while (pendingIds.length > 0) {
    const currentNodeId = pendingIds.shift();
    if (!currentNodeId || visitedIds.has(currentNodeId)) continue;

    visitedIds.add(currentNodeId);

    const childIds = registry.childIdsByParentId.get(currentNodeId) || [];
    childIds.forEach((childId) => {
      if (visitedIds.has(childId)) return;

      const childNode = getNodeById(registry, childId);
      if (!childNode) return;

      descendants.push(childNode);
      pendingIds.push(childId);
    });
  }

  return descendants;
}

export function getRootNodes(registry: LearningNodeRegistry): LearningNode[] {
  return [...registry.nodesById.values()]
    .filter((node) => !registry.parentIdByChildId.has(node.id))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function mergeLearningNodeSources(sources: LearningNodeRegistrySource[]): LearningNode[] {
  return sources.flatMap((source) => source.nodes.map(cloneNode));
}
