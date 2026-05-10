export const searchConfig = {
  debounceMs: Number(import.meta.env.VITE_SEARCH_DEBOUNCE_MS || 180),
  minimumQueryLength: Number(import.meta.env.VITE_SEARCH_MIN_CHARS || 2),
  searchPageSize: Number(import.meta.env.VITE_SEARCH_PAGE_SIZE || 6),
  maxIndexedSnippetLength: Number(import.meta.env.VITE_SEARCH_SNIPPET_LENGTH || 180)
};

export const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard'];
export const typeOptions = ['All', 'coding', 'debugging', 'trace', 'optimization', 'system-design', 'production-scenario', 'mcq'];
