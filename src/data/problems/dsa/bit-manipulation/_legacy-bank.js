import topic from '../../../banks/dsa/bit-manipulation.js';

const migratedIds = new Set([
  'bit-manipulation-001',
  'bit-manipulation-002',
  'bit-manipulation-003',
  'bit-manipulation-004',
  'bit-manipulation-005',
  'bit-manipulation-006',
  'bit-manipulation-007'
]);
const problems = topic.questions
  .filter((question) => !migratedIds.has(question.id))
  .map((question) => ({ ...question, category: 'dsa' }));

export default problems;
