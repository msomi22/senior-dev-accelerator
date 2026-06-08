import type { LearningNodeOrId, LearningNodeRegistry } from '../registry/index.ts';
import { getParent } from '../registry/index.ts';
import type { LearningNodeNavigationContext, LearningNodeNavigationOptions } from './navigation.types.ts';
import {
  getBreadcrumbs,
  getNavigationChildren,
  getNextSibling,
  getPreviousSibling,
  getSiblings,
  resolveNavigationNode
} from './navigation.utils.ts';

export function getNavigationContext(
  registry: LearningNodeRegistry,
  nodeOrId: LearningNodeOrId,
  options: LearningNodeNavigationOptions = {}
): LearningNodeNavigationContext {
  const current = resolveNavigationNode(registry, nodeOrId);

  if (!current) {
    return {
      children: [],
      siblings: [],
      breadcrumbs: []
    };
  }

  return {
    current,
    parent: getParent(registry, current.id),
    children: getNavigationChildren(registry, current.id, options),
    siblings: getSiblings(registry, current.id, options),
    previousSibling: getPreviousSibling(registry, current.id, options),
    nextSibling: getNextSibling(registry, current.id, options),
    breadcrumbs: getBreadcrumbs(registry, current.id, options)
  };
}
