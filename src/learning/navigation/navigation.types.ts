import type { LearningNode } from '../core/index.ts';

export type LearningNodeNavigationOptions = {
  includeCurrentInBreadcrumbs?: boolean;
  skipKinds?: string[];
};

export type LearningNodeNavigationContext = {
  current?: LearningNode;
  parent?: LearningNode;
  children: LearningNode[];
  siblings: LearningNode[];
  previousSibling?: LearningNode;
  nextSibling?: LearningNode;
  breadcrumbs: LearningNode[];
};

export type LearningNodeNavigationDirection = 'previous' | 'next' | 'parent' | 'child';
