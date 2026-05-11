const CONTENT_PROFILE = import.meta.env.VITE_CONTENT_PROFILE || 'dev';

const APPROVED_PROD_QUESTION_IDS = new Set([
  'sliding-window-001'
]);

export function getContentProfile() {
  return CONTENT_PROFILE;
}

export function isProductionContentProfile() {
  return CONTENT_PROFILE === 'prod';
}

export function isQuestionApprovedForProfile(question) {
  if (!isProductionContentProfile()) return true;

  return APPROVED_PROD_QUESTION_IDS.has(question.id);
}

export function filterQuestionsForActiveProfile(questions = []) {
  return questions.filter(isQuestionApprovedForProfile);
}

export function isTopicVisibleForActiveProfile(topicId) {
  if (!isProductionContentProfile()) return true;

  for (const questionId of APPROVED_PROD_QUESTION_IDS) {
    if (questionId.startsWith(`${topicId}-`)) return true;
  }

  return false;
}

export function filterTopicsForActiveProfile(topics = []) {
  return topics.filter((topic) => isTopicVisibleForActiveProfile(topic.id));
}
