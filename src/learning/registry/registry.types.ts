import type { LearningNode } from '../core/index.ts';

export type LearningNodeRegistry = {
  nodesById: Map<string, LearningNode>;
  childIdsByParentId: Map<string, string[]>;
  parentIdByChildId: Map<string, string>;
};

export type LearningNodeRegistryInput = {
  nodes: LearningNode[];
};

export type LearningNodeRegistrySource = {
  id: string;
  layer: string;
  nodes: LearningNode[];
};

export type LearningNodeSourceLoader = () => Promise<LearningNodeRegistrySource[]>;

export type LearningNodeRegistryLayer = string;

export type LearningNodeOrId = LearningNode | string;
