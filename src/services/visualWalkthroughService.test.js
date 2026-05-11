import test from 'node:test';
import assert from 'node:assert/strict';

function buildCandidatePaths(questionId) {
  const segments = questionId.split('-');

  if (segments.length < 2) {
    return [];
  }

  const topicFolder = segments.slice(0, -1).join('-');

  return [
    `../data/visuals/dsa/${topicFolder}/${questionId}.js`,
    `../data/visuals/system/${topicFolder}/${questionId}.js`
  ];
}

test('supports two-segment IDs', () => {
  const paths = buildCandidatePaths('backtracking-001');

  assert.ok(paths[0].includes('backtracking'));
});

test('supports multi-segment IDs', () => {
  const paths = buildCandidatePaths('sliding-window-001');

  assert.ok(paths[0].includes('sliding-window'));
});
