export function getDifficultyClass(difficulty) {
  const normalized = String(difficulty || '').toLowerCase();

  if (normalized.includes('easy')) return 'difficulty-pill difficulty-easy';
  if (normalized.includes('medium')) return 'difficulty-pill difficulty-medium';
  if (normalized.includes('hard')) return 'difficulty-pill difficulty-hard';

  return 'difficulty-pill';
}
