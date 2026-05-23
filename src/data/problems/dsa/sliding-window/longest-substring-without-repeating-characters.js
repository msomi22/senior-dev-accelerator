import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineLearningProblem({
  id: 'sliding-window-longest-substring-unique-001',
  topicId: 'sliding-window',
  title: 'Longest Substring Without Repeating Characters — variable sliding window',
  difficulty: 'Medium',
  estimatedTime: '15 min',
  language: 'java',
  tags: ['strings', 'sliding-window', 'hash-set', 'interview-pattern', 'mental-model', 'visual-walkthrough', 'coding'],
  scenario: 'Find the length of the longest contiguous substring that contains no repeated characters.',
  question: 'Given s = "abcabcbb", return 3 because "abc" is the longest substring without repeated characters.',
  examples: ['Input: s = "abcabcbb" -> Output: 3'],
  constraints: [
    'The answer must be a contiguous substring length.',
    'Characters can repeat outside the active window.',
    'The window is valid only when every character inside it is unique.',
    'Use O(n) time.'
  ],
  starterThought: 'Keep one live window and repair it instead of restarting a new substring every time.',
  intuition: 'Think of left and right as two borders around the current substring. The right pointer walks forward and includes one new character. If that new character already exists inside the window, the window is broken. Then left moves forward, removing characters, until the duplicate is gone. Only after the window is valid again do we update best.',
  mentalPicture: 'Imagine a spotlight over part of the string. The spotlight is only allowed to cover unique characters. The right edge expands the spotlight. When a repeated character appears inside the light, the left edge slides forward until the repeated old copy is pushed out.',
  patternSignal: 'Use sliding window when you need the best contiguous range and an invalid range can be repaired by moving the left boundary.',
  invariant: 'After the shrink step finishes, every character inside s[left..right] is unique.',
  bruteForceThought: 'Brute force starts a new substring from many positions and repeatedly checks characters it has already seen.',
  optimizationJourney: 'The sliding window reuses work. Each character enters once through right and leaves at most once through left, so the scan is linear.',
  stepByStepBreakdown: [
    'left marks the start of the current window.',
    'right is the current included character, not the next future character.',
    'Add s[right] into the window.',
    'If s[right] is duplicated, move left until the old duplicate leaves.',
    'Now the window is valid, so update best with right - left + 1.'
  ],
  finalPattern: 'Variable sliding window with a uniqueness invariant.',
  commonMistake: 'Updating best before removing duplicates can accidentally count an invalid window.',
  commonMistakes: [
    'Thinking right points to the next index instead of the current included index.',
    'Shrinking only once when multiple removals may be needed.',
    'Confusing substring with subsequence.',
    'Forgetting to decrement counts while moving left.'
  ],
  edgeCases: ['Empty string', 'All unique characters', 'All same characters', 'Duplicates far apart'],
  complexityAnalysis: 'Time is O(n) because each character enters and leaves the window at most once. Space is O(k), where k is the character set size.',
  explanation: 'For abcabcbb, the window grows to abc. When the next a enters, abca is invalid because a appears twice. Move left past the old a, giving bca. The best valid length remains 3.',
  solutionCode: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> count = new HashMap<>();
        int left = 0;
        int best = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            count.put(c, count.getOrDefault(c, 0) + 1);

            while (count.get(c) > 1) {
                char remove = s.charAt(left);
                count.put(remove, count.get(remove) - 1);
                left++;
            }

            best = Math.max(best, right - left + 1);
        }

        return best;
    }
}`,
  finalTakeaway: 'right grows the window; left repairs the window. best is updated only when the window is valid.',
  visualExplanation: 'The visual uses an inclusive window: left is the first character inside the window, and right is the current character just added. The window text means s[left..right].',
  visualWalkthrough: {
    title: 'Sliding window: grow, break, repair',
    summary: 'Watch right include one character at a time, and left move only when a duplicate breaks the unique-window rule.',
    diagram: {
      type: 'array',
      title: 's = abcabcbb',
      values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
      stateTitle: 'Pointer meaning',
      stateDescription: 'left = first index inside the window. right = current included index. window = s[left..right]. best = longest valid window seen so far.',
      frames: [
        {
          title: 'Start with one character',
          activeRange: [0, 0],
          items: [
            { index: 0, role: 'current', caption: 'left + right' }
          ],
          state: { label: 'valid', values: ['left 0', 'right 0', 'window a', 'best 1'], helper: 'right is inclusive: it points at the character currently inside the window.' },
          description: 'The window starts at index 0. It contains only "a", so it is valid.'
        },
        {
          title: 'Grow right to b',
          activeRange: [0, 1],
          items: [
            { index: 0, role: 'window', caption: 'left' },
            { index: 1, role: 'current', caption: 'right' }
          ],
          state: { label: 'valid', values: ['left 0', 'right 1', 'window ab', 'best 2'], helper: 'No duplicate exists inside the current window.' },
          description: 'right moves to index 1 and includes "b". The window is now "ab".'
        },
        {
          title: 'Grow right to c',
          activeRange: [0, 2],
          items: [
            { index: 0, role: 'window', caption: 'left' },
            { index: 2, role: 'current', caption: 'right' }
          ],
          state: { label: 'valid', values: ['left 0', 'right 2', 'window abc', 'best 3'], helper: 'This is the first length-3 unique window.' },
          description: 'right moves to index 2 and includes "c". The window "abc" is valid, so best becomes 3.'
        },
        {
          title: 'Duplicate a enters',
          activeRange: [0, 3],
          items: [
            { index: 0, role: 'remove', caption: 'old a' },
            { index: 3, role: 'remove', caption: 'right duplicate a' }
          ],
          state: { label: 'invalid', values: ['left 0', 'right 3', 'window abca', 'best 3'], helper: 'The new a at right duplicates the old a at left.' },
          description: 'right moves to index 3 and adds another "a". The window "abca" is invalid because it has two a characters.'
        },
        {
          title: 'Move left past the old a',
          activeRange: [1, 3],
          items: [
            { index: 0, role: 'remove', caption: 'removed' },
            { index: 1, role: 'window', caption: 'left' },
            { index: 3, role: 'current', caption: 'right' }
          ],
          state: { label: 'valid again', values: ['left 1', 'right 3', 'window bca', 'best 3'], helper: 'After the old a leaves, every character is unique again.' },
          description: 'left moves from 0 to 1. The active window becomes "bca", which is valid.'
        },
        {
          title: 'Next duplicate b enters',
          activeRange: [1, 4],
          items: [
            { index: 1, role: 'remove', caption: 'old b' },
            { index: 4, role: 'remove', caption: 'right duplicate b' }
          ],
          state: { label: 'invalid', values: ['left 1', 'right 4', 'window bcab', 'best 3'], helper: 'The new b duplicates the b at the left edge.' },
          description: 'right moves to index 4. The window temporarily becomes "bcab", which has two b characters.'
        },
        {
          title: 'Repair by moving left',
          activeRange: [2, 4],
          items: [
            { index: 1, role: 'remove', caption: 'removed' },
            { index: 2, role: 'window', caption: 'left' },
            { index: 4, role: 'current', caption: 'right' }
          ],
          state: { label: 'valid again', values: ['left 2', 'right 4', 'window cab', 'best 3'], helper: 'The duplicate b is gone.' },
          description: 'left moves to index 2. The window is valid again, but its length is still 3.'
        },
        {
          title: 'Finish: best remains 3',
          activeRange: [3, 5],
          items: [
            { index: 3, role: 'answer', caption: 'best window' },
            { index: 4, role: 'answer', caption: 'best window' },
            { index: 5, role: 'answer', caption: 'best window' }
          ],
          state: { label: 'answer', values: ['best 3'], helper: 'Later valid windows tie length 3 but do not beat it.' },
          description: 'The longest unique substring length is 3. Examples include "abc", "bca", and "cab".',
          finalResult: { title: 'Final answer', body: 'Return 3.' }
        }
      ]
    }
  },
  body: [
    { type: 'callout', tone: 'info', title: 'Pointer convention', content: 'In this walkthrough, right is inclusive. That means right points to the current character already inside the window.' },
    { type: 'callout', tone: 'info', title: 'Pattern signal', content: 'Use a sliding window for best contiguous ranges with a repairable validity rule.' }
  ],
  relatedConcepts: ['two pointers', 'hash map', 'window invariant'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
