export const categoryLibraryConfig = {
  categoriesPerPage: Number(import.meta.env.VITE_CATEGORIES_PER_PAGE || 8),
  featuredCategoryLimit: Number(import.meta.env.VITE_FEATURED_CATEGORY_LIMIT || 6),
  categorySearchDebounceMs: Number(import.meta.env.VITE_CATEGORY_SEARCH_DEBOUNCE_MS || 180)
};
