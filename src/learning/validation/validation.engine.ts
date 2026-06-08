import type { LearningNode } from '../core/index.ts';
import type { LearningNodeRegistry } from '../registry/index.ts';
import { createLearningNodeRegistry } from '../registry/index.ts';
import {
  sortValidationIssues,
  validateNodeShapes,
  validateRules
} from './validation.rules.ts';
import type {
  LearningNodeValidationIssue,
  LearningNodeValidationOptions,
  LearningNodeValidationResult
} from './validation.types.ts';

export function hasValidationErrors(result: LearningNodeValidationResult): boolean {
  return result.issues.some((issue) => issue.severity === 'error');
}

export function getValidationErrors(result: LearningNodeValidationResult): LearningNodeValidationIssue[] {
  return result.issues.filter((issue) => issue.severity === 'error');
}

export function getValidationWarnings(result: LearningNodeValidationResult): LearningNodeValidationIssue[] {
  return result.issues.filter((issue) => issue.severity === 'warning');
}

function createValidationResult(issues: LearningNodeValidationIssue[]): LearningNodeValidationResult {
  const sortedIssues = sortValidationIssues(issues);

  return {
    valid: !sortedIssues.some((issue) => issue.severity === 'error'),
    issues: sortedIssues
  };
}

export function validateLearningNodes(
  nodes: unknown[] | LearningNode[],
  options: LearningNodeValidationOptions = {}
): LearningNodeValidationResult {
  const { validNodes, issues: shapeIssues } = validateNodeShapes([...nodes]);
  const ruleIssues = validateRules(validNodes, options);

  return createValidationResult([
    ...shapeIssues,
    ...ruleIssues
  ]);
}

export function validateLearningNodeRegistry(
  registry: LearningNodeRegistry,
  options: LearningNodeValidationOptions = {}
): LearningNodeValidationResult {
  return validateLearningNodes([...registry.nodesById.values()], options);
}

export function createValidatedLearningNodeRegistry(
  nodes: LearningNode[],
  options: LearningNodeValidationOptions = {}
): {
  registry: LearningNodeRegistry;
  validation: LearningNodeValidationResult;
} {
  const registry = createLearningNodeRegistry({ nodes });
  return {
    registry,
    validation: validateLearningNodeRegistry(registry, options)
  };
}
