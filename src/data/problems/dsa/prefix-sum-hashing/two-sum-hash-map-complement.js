import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'prefix-sum-hashing-two-sum-complement-001',
  topicId: 'prefix-sum-hashing',
  title: 'Two Sum — hash map complement',
  difficulty: 'Easy',
  estimatedTime: '12 min',
  tags: ['arrays', 'hash-map', 'interview-pattern', 'mental-model', 'visual-walkthrough'],
  scenario: 'You are given numbers and a target. Return the two indices whose values add up to the target.',
  prompt: 'How can you solve Two Sum by remembering complements instead of checking every pair?',
  starterThought: 'Do not ask, “Which pair should I try next?” Ask, “What number would complete the pair for the value I am holding now?”',
  plainLanguageExplanation: 'For each number, compute the missing partner: target - current number. A hash map stores numbers you have already passed. If the missing partner is already in the map, the pair is found immediately.',
  mentalPicture: 'Imagine a shopping list where the total must be exactly 9. When you pick up item 7, you ask, “Have I already seen an item priced 2?” The map is your memory of earlier prices.',
  bruteForceThought: 'Brute force feels natural because it checks every possible pair. The problem is that it repeats the same search again and again.',
  optimizationJourney: 'The insight is that every current value has exactly one complement for a fixed target. Hash lookup turns “search all previous values” into “ask directly whether the missing value was seen.”',
  finalPattern: 'Complement lookup with a hash map.',
  commonMistake: 'Adding the current number before checking can accidentally allow using the same element twice unless the implementation is very careful about indices.',
  edgeCases: ['Duplicate values such as [3, 3] with target 6', 'Negative numbers', 'No valid pair if the variant allows that', 'A complement equal to the current value must come from a different index'],
  complexityAnalysis: 'Time is O(n) because each number is processed once and hash lookups are expected constant time. Space is O(n) because the map may store many previously seen numbers.',
  finalTakeaway: 'A hash map turns “search all previous values” into “ask directly whether the missing value was seen.”',
  selfExplanationPrompt: 'In one sentence, explain why checking the complement before inserting the current number avoids reusing the same element.',
  body: [
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use complement lookup when a pair must combine to a target and you can remember values already seen.' },
    {
      type: 'table',
      title: 'Walkthrough: nums = [2, 7, 11, 15], target = 9',
      columns: ['Index', 'Current', 'Needed complement', 'Map before checking', 'Action'],
      rows: [
        ['0', '2', '7', '{}', '7 not seen. Store 2 -> 0.'],
        ['1', '7', '2', '{2: 0}', '2 is seen at index 0. Return [0, 1].']
      ]
    },
    { type: 'flow', title: 'Mental flow', steps: ['Look at current number', 'Compute target - current', 'Check whether complement was seen earlier', 'If yes, return both indices', 'If no, store current number for future values'] },
    { type: 'checklist', title: 'Explain it well', items: ['Define complement clearly', 'Mention the map stores previous values', 'Explain why order matters', 'Explain why the same index is not reused', 'Give O(n) time and O(n) space'] }
  ],
  relatedConcepts: ['hash map lookup', 'complement', 'single-pass scan'],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
