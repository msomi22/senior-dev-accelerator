import topic from '../../../banks/dsa/sliding-window.js';

const migratedIds = new Set(['sliding-window-001']);
const problems = topic.questions
  .filter((question) => !migratedIds.has(question.id))
  .map((question) => ({ ...question, category: 'dsa' }));

export default problems;
