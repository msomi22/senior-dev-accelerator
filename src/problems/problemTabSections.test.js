import test from 'node:test';
import assert from 'node:assert/strict';

import { getFocusedProblemTabs, getReinforcementCardsForTab } from './problemTabSections.js';

const sampleProblem = {
  id: 'dynamic-programming-020',
  intuition: 'DP lane transitions.',
  starterThought: 'Track best lane state.',
  stepByStepBreakdown: ['Initialize', 'Transition'],
  commonMistake: 'Blocked lanes must be invalidated.',
  commonMistakes: ['Using stale state'],
  complexityAnalysis: 'O(n) time.'
};

test('common mistakes render only in approach context', () => {
  assert.equal(getReinforcementCardsForTab(sampleProblem, 'approach').length > 0, true);
  assert.equal(getReinforcementCardsForTab(sampleProblem, 'solution').length, 0);
  assert.equal(getReinforcementCardsForTab(sampleProblem, 'complexity').length, 0);
  assert.equal(getReinforcementCardsForTab(sampleProblem, 'intuition').length, 0);
});

test('focused tabs remain available for multiple problem categories', () => {
  const dsaTabs = getFocusedProblemTabs({
    question: sampleProblem,
    codeContent: 'function solve() {}',
    explanation: 'DP solution',
    hasMcq: false,
    hasVisualRichBody: true
  }).map(([id]) => id);

  const javaTabs = getFocusedProblemTabs({
    question: {
      intuition: 'HashMap collision handling.',
      explanation: 'Buckets and resizing.'
    },
    codeContent: 'new HashMap<>()',
    explanation: 'Java explanation',
    hasMcq: false,
    hasVisualRichBody: false
  }).map(([id]) => id);

  const systemTabs = getFocusedProblemTabs({
    question: {
      intuition: 'Rate limiting tradeoffs.',
      complexityAnalysis: 'Operational complexity.'
    },
    codeContent: '',
    explanation: 'Token bucket',
    hasMcq: false,
    hasVisualRichBody: false
  }).map(([id]) => id);

  assert.ok(dsaTabs.includes('approach'));
  assert.ok(javaTabs.includes('solution'));
  assert.ok(systemTabs.includes('complexity'));
});
