import { defineMcqProblem } from '../../../../problems/problemAuthoring.js';
import { systemDesignMcqsByTopic } from '../../../banks/system/real-world-mcqs.js';

const legacyProblem = systemDesignMcqsByTopic['messaging-queues'].find(
  (question) => question.id === 'messaging-queues-email-notification-001'
);

if (!legacyProblem) {
  throw new Error('Missing legacy problem messaging-queues-email-notification-001 during migration.');
}

const problem = defineMcqProblem({
  ...legacyProblem,
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
