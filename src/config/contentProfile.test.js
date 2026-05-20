import test from 'node:test';
import assert from 'node:assert/strict';

import {
  filterQuestionsForActiveProfile,
  filterTopicsForActiveProfile,
  isQuestionApprovedForProfile,
  isTopicVisibleForActiveProfile
} from './contentProfile.js';

test('allows approved production questions', () => {
  const approved = {
    id: 'sliding-window-001',
    topicId: 'sliding-window'
  };

  assert.equal(isQuestionApprovedForProfile(approved), true);
});

test('allows questions from approved production topics during migration', () => {
  const migrated = {
    id: 'api-design-001',
    topicId: 'api-design'
  };

  assert.equal(isQuestionApprovedForProfile(migrated), true);
});

test('keeps multi-hyphen approved production topics visible', () => {
  assert.equal(isTopicVisibleForActiveProfile('api-design'), true);
  assert.equal(isTopicVisibleForActiveProfile('messaging-queues'), true);
});

test('does not treat approved problem slugs as topic IDs', () => {
  assert.equal(isTopicVisibleForActiveProfile('api-design-rate-limiting'), false);
  assert.equal(isTopicVisibleForActiveProfile('caching-product-details'), false);
});

test('filters arrays safely', () => {
  const questions = [
    { id: 'sliding-window-001', topicId: 'sliding-window' },
    { id: 'draft-question-001', topicId: 'draft-question' }
  ];

  const filtered = filterQuestionsForActiveProfile(questions);

  assert.ok(filtered.length > 0);
});

test('filters topic arrays safely', () => {
  const topics = [
    { id: 'api-design' },
    { id: 'draft-topic' }
  ];

  const filtered = filterTopicsForActiveProfile(topics);

  assert.ok(filtered.length > 0);
});
