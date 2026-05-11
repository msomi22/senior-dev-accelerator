import test from 'node:test';
import assert from 'node:assert/strict';

import {
  filterQuestionsForActiveProfile,
  isQuestionApprovedForProfile
} from './contentProfile.js';

test('allows approved production questions', () => {
  const approved = {
    id: 'sliding-window-001'
  };

  assert.equal(isQuestionApprovedForProfile(approved), true);
});

test('filters arrays safely', () => {
  const questions = [
    { id: 'sliding-window-001' },
    { id: 'draft-question-001' }
  ];

  const filtered = filterQuestionsForActiveProfile(questions);

  assert.ok(filtered.length > 0);
});
