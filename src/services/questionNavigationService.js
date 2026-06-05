function normalizeQuestionList(questions = []) {
  return (Array.isArray(questions) ? questions : [])
    .filter((question) => question?.id)
    .map((question) => ({
      id: question.id,
      title: question.title || question.question || question.id,
      topicId: question.topicId,
      category: question.category
    }));
}

export function getAdjacentQuestions(questions = [], currentQuestionId = '') {
  const rows = normalizeQuestionList(questions);
  const currentIndex = rows.findIndex((question) => question.id === currentQuestionId);

  if (currentIndex === -1) {
    return {
      previousQuestion: null,
      nextQuestion: null,
      currentIndex: -1,
      total: rows.length
    };
  }

  return {
    previousQuestion: rows[currentIndex - 1] || null,
    nextQuestion: rows[currentIndex + 1] || null,
    currentIndex,
    total: rows.length
  };
}

export function buildQuestionNavigationState({ returnToCategory } = {}) {
  return returnToCategory ? { returnToCategory } : undefined;
}
