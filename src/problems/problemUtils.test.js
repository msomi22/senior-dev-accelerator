import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeProblem } from './normalizeProblem.js';
import { validateProblem, validateProblemCollection } from './validateProblem.js';
import { discoverProblems, getDiscoveredQuestionsForTopic } from './problemDiscovery.js';

const topics = [
  { id: 'scalability', category: 'system' },
  { id: 'sliding-window', category: 'dsa' }
];

test('normalizeProblem keeps legacy fields and creates prompt/question aliases', () => {
  const normalized = normalizeProblem({
    id: 'legacy-1',
    type: 'coding',
    category: 'dsa',
    topicId: 'sliding-window',
    title: 'Legacy problem',
    difficulty: 'Easy',
    question: 'Legacy question',
    scenario: 'Keep me'
  });

  assert.equal(normalized.prompt, 'Legacy question');
  assert.equal(normalized.question, 'Legacy question');
  assert.equal(normalized.scenario, 'Keep me');
});

test('validateProblem accepts a complete supported problem', () => {
  const result = validateProblem({
    id: 'valid-1',
    type: 'simple-system-design',
    category: 'system',
    topicId: 'scalability',
    title: 'Valid problem',
    difficulty: 'Easy',
    prompt: 'Explain the design.'
  }, { topics });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('validateProblem reports invalid topicId and invalid problem type', () => {
  const result = validateProblem({
    id: 'invalid-1',
    type: 'unknown-type',
    category: 'system',
    topicId: 'missing-topic',
    title: 'Invalid problem',
    difficulty: 'Easy',
    prompt: 'Explain the design.'
  }, { topics });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.field === 'type'));
  assert.ok(result.errors.some((item) => item.field === 'topicId'));
});

test('validateProblemCollection detects duplicate ids', () => {
  const result = validateProblemCollection([
    {
      id: 'duplicate-1',
      type: 'coding',
      category: 'dsa',
      topicId: 'sliding-window',
      title: 'First',
      difficulty: 'Easy',
      question: 'First question'
    },
    {
      id: 'duplicate-1',
      type: 'coding',
      category: 'dsa',
      topicId: 'sliding-window',
      title: 'Second',
      difficulty: 'Easy',
      question: 'Second question'
    }
  ], { topics });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.field === 'id' && item.message.includes('Duplicate')));
});

test('discoverProblems loads default and named problem exports', async () => {
  const modules = {
    '../data/problems/system/scalability/a.js': async () => ({
      default: {
        id: 'discovered-default-1',
        type: 'simple-system-design',
        category: 'system',
        topicId: 'scalability',
        title: 'Default export',
        difficulty: 'Easy',
        question: 'Default question'
      }
    }),
    '../data/problems/dsa/sliding-window/b.js': async () => ({
      problem: {
        id: 'discovered-named-1',
        type: 'coding',
        category: 'dsa',
        topicId: 'sliding-window',
        title: 'Named export',
        difficulty: 'Medium',
        prompt: 'Named prompt'
      }
    })
  };

  const problems = await discoverProblems({ modules, topics });
  const byTopic = await getDiscoveredQuestionsForTopic('scalability', { modules, topics });

  assert.equal(problems.length, 2);
  assert.equal(byTopic.length, 1);
  assert.equal(byTopic[0].id, 'discovered-default-1');
});
