import topic from '../../../banks/system/caching.js';

const problems = topic.questions.map((question) => ({ ...question, category: 'system' }));

export default problems;
