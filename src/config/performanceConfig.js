export const performanceConfig = {
  questionsPerPage: Number(import.meta.env.VITE_QUESTIONS_PER_PAGE || 6),
  paginationWindow: Number(import.meta.env.VITE_PAGINATION_WINDOW || 5),
  enableAnimatedTopicOrbit: import.meta.env.VITE_ENABLE_TOPIC_ORBIT !== 'false'
};
