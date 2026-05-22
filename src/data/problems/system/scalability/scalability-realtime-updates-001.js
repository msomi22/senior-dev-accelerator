import { defineMcqProblem } from '../../../../problems/problemAuthoring.js';
import { systemDesignMcqsByTopic } from '../../../banks/system/real-world-mcqs.js';

const legacyProblem = systemDesignMcqsByTopic.scalability.find(
  (question) => question.id === 'scalability-realtime-updates-001'
);

if (!legacyProblem) {
  throw new Error('Missing legacy problem scalability-realtime-updates-001 during migration.');
}

const problem = defineMcqProblem({
  ...legacyProblem,
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
