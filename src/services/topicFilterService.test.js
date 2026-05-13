import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getFilteredTopicQuestions,
  getQuestionSetProgress
} from './topicFilterService.js';

const topic = {
  questions: [
    { id: 'trie-001', difficulty: 'Hard' },
    { id: 'trie-002', difficulty: 'Medium' }
  ]
};

test('completed status filter returns only completed questions', () => {
  const filtered = getFilteredTopicQuestions(
    topic,
    { 'trie-001': true },
    'all',
    'completed'
  );

  assert.deepEqual(filtered.map((question) => question.id), ['trie-001']);
});

test('incomplete status filter returns only incomplete questions', () => {
  const filtered = getFilteredTopicQuestions(
    topic,
    { 'trie-001': true },
    'all',
    'incomplete'
  );

  assert.deepEqual(filtered.map((question) => question.id), ['trie-002']);
});

test('completed status filter respects difficulty scope', () => {
  const filtered = getFilteredTopicQuestions(
    topic,
    { 'trie-001': true },
    'Hard',
    'completed'
  );

  assert.deepEqual(filtered.map((question) => question.id), ['trie-001']);
});

test('question set progress counts only visible filtered questions', () => {
  const progress = getQuestionSetProgress(
    [{ id: 'sliding-window-001' }],
    {
      'sliding-window-001': true,
      'trie-001': true
    }
  );

  assert.deepEqual(progress, { done: 1, total: 1, percent: 100 });
});
