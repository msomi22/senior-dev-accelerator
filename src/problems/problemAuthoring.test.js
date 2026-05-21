import test from 'node:test';
import assert from 'node:assert/strict';

import { defineProblem } from './problemAuthoring.js';
import { normalizeProblem } from './normalizeProblem.js';

const topics = [
  {
    id: 'metadata-topic',
    name: 'Metadata Topic',
    category: 'system'
  }
];

test('helper-authored problems preserve metadata visibility and review status', () => {
  const problem = defineProblem({
    id: 'metadata-topic-001',
    type: 'simple-system-design',
    topicId: 'metadata-topic',
    title: 'Approved metadata problem',
    prompt: 'Design something production ready.',
    metadata: {
      reviewStatus: 'approved',
      visibility: ['dev', 'prod']
    }
  }, { topics });

  assert.equal(problem.metadata.authoringVersion, 2);
  assert.equal(problem.metadata.reviewStatus, 'approved');
  assert.deepEqual(problem.metadata.visibility, ['dev', 'prod']);
});

test('raw object problem exports remain backwards compatible', () => {
  const problem = normalizeProblem({
    id: 'metadata-topic-raw-001',
    type: 'simple-system-design',
    topicId: 'metadata-topic',
    category: 'system',
    title: 'Raw metadata problem',
    difficulty: 'Medium',
    prompt: 'Review a raw object export.'
  });

  assert.deepEqual(problem.metadata, {});
  assert.equal(problem.id, 'metadata-topic-raw-001');
  assert.equal(problem.topicId, 'metadata-topic');
});
