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

test('migrated DSA problem IDs still resolve to existing visual walkthrough folders', () => {
  assert.deepEqual(buildCandidatePaths('sliding-window-001'), [
    '../data/visuals/dsa/sliding-window/sliding-window-001.js',
    '../data/visuals/system/sliding-window/sliding-window-001.js'
  ]);

  assert.deepEqual(buildCandidatePaths('two-pointers-001'), [
    '../data/visuals/dsa/two-pointers/two-pointers-001.js',
    '../data/visuals/system/two-pointers/two-pointers-001.js'
  ]);
});
