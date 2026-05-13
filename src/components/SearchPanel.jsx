export default function SearchPanel({
  query,
  onQueryChange
}) {
  return (
    <section className="search-panel compact-search-panel search-only-panel" aria-label="Search questions">
      <label className="search-field search-input-wrap">
        <span>Search</span>
        <textarea
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search problems..."
          autoComplete="off"
          rows={2}
        />
      </label>
    </section>
  );
}
