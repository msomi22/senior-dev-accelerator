import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isMigratedTopic,
  mergeQuestionsById,
  topicProgress
} from './questionBankService.js';

test('bit manipulation is the only migrated topic in this incremental PR', () => {
  assert.equal(isMigratedTopic('bit-manipulation'), true);
  assert.equal(isMigratedTopic('sliding-window'), false);
  assert.equal(isMigratedTopic('scalability'), false);
});

test('mergeQuestionsById prefers primary questions and avoids duplicate IDs', () => {
  const primaryQuestions = [
    { id: 'bit-manipulation-001', title: 'Migrated Bitwise AND', category: 'dsa', topicId: 'bit-manipulation' },
    { id: 'bit-manipulation-002', title: 'Migrated Power of Two', category: 'dsa', topicId: 'bit-manipulation' }
  ];

  const fallbackQuestions = [
    { id: 'bit-manipulation-001', title: 'Legacy Bitwise AND', category: 'dsa', topicId: 'bit-manipulation' },
    { id: 'bit-manipulation-003', title: 'Legacy Single Number', category: 'dsa', topicId: 'bit-manipulation' }
  ];

  const merged = mergeQuestionsById(primaryQuestions, fallbackQuestions);

  assert.deepEqual(
    merged.map((question) => question.id),
    ['bit-manipulation-001', 'bit-manipulation-002', 'bit-manipulation-003']
  );
  assert.equal(merged.find((question) => question.id === 'bit-manipulation-001').title, 'Migrated Bitwise AND');
});

test('mergeQuestionsById keeps legacy questions visible when migrated discovery is empty', () => {
  const legacyQuestions = [
    { id: 'api-design-001', title: 'Legacy API item', category: 'system', topicId: 'api-design' }
  ];

  assert.deepEqual(mergeQuestionsById([], legacyQuestions), legacyQuestions);
});

test('mergeQuestionsById ignores malformed entries without IDs', () => {
  const merged = mergeQuestionsById(
    [{ title: 'Missing ID' }, null, { id: 'graphs-001', title: 'Graph BFS' }],
    [{ id: 'graphs-001', title: 'Legacy Graph BFS' }, { id: 'graphs-002', title: 'Graph DFS' }]
  );

  assert.deepEqual(merged.map((question) => question.id), ['graphs-001', 'graphs-002']);
});

test('topicProgress keeps existing ID-prefix completed status behavior', () => {
  const progress = topicProgress(
    { id: 'scalability', count: 3 },
    {
      'scalability-001': true,
      'scalability-002': false,
      'databases-001': true,
      'scalability-extra': true
    }
  );

  assert.deepEqual(progress, { done: 2, total: 3, percent: 67 });
});
