import assert from 'node:assert/strict';
import test from 'node:test';
import { getAcademyRootNodeIds } from './index.ts';

test('academy registry exposes stable ids', () => {
  assert.deepEqual(getAcademyRootNodeIds(), [
    'technology-academy',
    'cbc-academy',
    'customer-experience-academy'
  ]);
});
