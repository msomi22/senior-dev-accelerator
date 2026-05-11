import { describe, expect, it } from 'vitest';

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

describe('visual walkthrough path resolution', () => {
  it('supports two-segment IDs', () => {
    const paths = buildCandidatePaths('backtracking-001');

    expect(paths[0]).toContain('backtracking');
  });

  it('supports multi-segment IDs', () => {
    const paths = buildCandidatePaths('sliding-window-001');

    expect(paths[0]).toContain('sliding-window');
  });
});
