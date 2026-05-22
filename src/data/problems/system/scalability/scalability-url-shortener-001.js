import { defineComplexSystemDesignProblem } from '../../../../problems/problemAuthoring.js';
import legacyBank from '../../../banks/system/complex-system-design.js';

const legacyProblem = legacyBank.questions.find(
  (question) => question.id === 'complex-system-design-url-shortener-001'
);

if (!legacyProblem) {
  throw new Error('Missing legacy problem complex-system-design-url-shortener-001 during migration.');
}

const problem = defineComplexSystemDesignProblem({
  ...legacyProblem,
  id: 'scalability-url-shortener-001',
  topicId: 'scalability',
  finalPattern: 'Scalability',
  tags: [...new Set([...(legacyProblem.tags || []), 'scalability'])],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
