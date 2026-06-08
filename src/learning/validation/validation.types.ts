import type { LearningNode } from '../core/index.ts';

export type LearningNodeValidationSeverity = 'error' | 'warning';

export type LearningNodeValidationIssueCode =
  | 'DUPLICATE_NODE_ID'
  | 'MISSING_PARENT'
  | 'MISSING_CHILD'
  | 'PARENT_CHILD_MISMATCH'
  | 'SELF_PARENT'
  | 'SELF_CHILD'
  | 'CYCLE_DETECTED'
  | 'INVALID_NODE'
  | 'MULTIPLE_ROOTS'
  | 'ORPHAN_NODE';

export type LearningNodeValidationIssue = {
  code: LearningNodeValidationIssueCode | string;
  severity: LearningNodeValidationSeverity;
  nodeId?: string;
  relatedNodeId?: string;
  message: string;
};

export type LearningNodeValidationResult = {
  valid: boolean;
  issues: LearningNodeValidationIssue[];
};

export type LearningNodeValidationOptions = {
  requireSingleRoot?: boolean;
  allowOrphans?: boolean;
};

export type CreateValidationIssueInput = Omit<LearningNodeValidationIssue, 'severity'> & {
  severity?: LearningNodeValidationSeverity;
};

export type LearningNodeValidationInput = {
  nodes: unknown[] | LearningNode[];
  options?: LearningNodeValidationOptions;
};
