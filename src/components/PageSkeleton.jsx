/**
 * PageSkeleton — shown via Suspense fallback while lazy routes load.
 * Matches the rough visual shape of the DSA/category page so the
 * transition feels like content appearing, not a blank flash.
 */
export default function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-hidden="true" aria-label="Loading page…">
      {/* Page title bar */}
      <div className="skeleton skeleton-header" style={{ width: '55%', height: 48, borderRadius: 16 }} />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 18 }} />
        ))}
      </div>

      {/* Topic cards */}
      {[160, 140, 160, 140].map((h, i) => (
        <div key={i} className="skeleton skeleton-card" style={{ height: h }} />
      ))}

      <span className="sr-only">Loading page content…</span>
    </div>
  );
}

/**
 * QuestionSkeleton — optional fallback for individual question cards.
 * Kept here for reuse by future lazy-loaded problem/detail screens.
 */
export function QuestionSkeleton() {
  return (
    <article className="question-skeleton glass" aria-hidden="true">
      <div className="skeleton" style={{ width: '40%', height: 20, borderRadius: 999 }} />
      <div className="skeleton" style={{ width: '85%', height: 28, borderRadius: 12 }} />
      <div className="skeleton" style={{ width: '100%', height: 90, borderRadius: 18 }} />
      <div className="skeleton" style={{ width: '65%', height: 16, borderRadius: 999 }} />
    </article>
  );
}
