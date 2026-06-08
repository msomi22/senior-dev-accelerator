import assert from 'node:assert/strict';
import test from 'node:test';

import { getBreadcrumbs } from '../navigation/index.ts';
import { getChildren, getNodeById } from '../registry/index.ts';
import { createNodeRoutePath } from '../routing/index.ts';
import { validateLearningNodeRegistry } from '../validation/index.ts';
import { QUBITEL_ACADEMY_ROOT_NODE_ID } from '../platform