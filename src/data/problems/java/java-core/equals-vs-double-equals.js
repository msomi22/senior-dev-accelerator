import { defineMcqProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineMcqProblem({
  id: 'java-core-equals-vs-double-equals-001',
  topicId: 'java-core',
  title: 'equals() vs ==',
  difficulty: 'Easy',
  prompt: 'For most Java objects, what is the key difference between == and equals()?',
  options: [
    '== compares object identity, while equals() can compare logical equality when implemented correctly.',
    '== always calls equals() internally.',
    'equals() compares memory addresses, while == compares field values.',
    'There is no difference for objects.'
  ],
  correctAnswer: '== compares object identity, while equals() can compare logical equality when implemented correctly.',
  explanation: 'For reference types, == checks whether two references point to the same object. equals() is a method that classes can override to define meaningful equality, such as matching String content.',
  tags: ['java', 'objects', 'equality'],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
