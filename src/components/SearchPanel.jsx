import {
  difficultyOptions,
  searchConfig,
  typeOptions
} from '../config/searchConfig.js';

function typeLabel(type) {
  if (type === 'All') return 'All types';

  return type
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function SearchPanel({
  topics,
  query,
  topicId,
  difficulty,
  type,
  onQueryChange,
  onTopicChange,
  onDifficultyChange,
  onTypeChange,
  onClear,
  isActive,
  isIndexing,
  resultCount
}) {
  return (
    <section className="search-panel compact-search-panel" aria-label="Search and filter questions">
      <div className="search-header compact-search-header">
        <div>
          <p className="eyebrow">Fast search</p>
          <h2>Find a specific problem</h2>
          <p>
            Search title, topic description, tags, scenario, question text,
            intuition, explanation, and production notes.
          </p>
        </div>

        {isActive ? (
          <button type="button" className="clear-search" onClick={onClear}>
            Clear search
          </button>
        ) : null}
      </div>

      <div className="search-grid">
        <label className="search-field search-input-wrap">
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Try: rate limiting, sliding window, retry storm, cache stampede…"
            autoComplete="off"
          />
        </label>

        <label className="search-field">
          <span>Topic</span>
          <select
            value={topicId}
            onChange={(event) => onTopicChange(event.target.value)}
          >
            <option value="All">All topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>

        <label className="search-field">
          <span>Difficulty</span>
          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value)}
          >
            {difficultyOptions.map((item) => (
              <option key={item} value={item}>
                {item === 'All' ? 'All levels' : item}
              </option>
            ))}
          </select>
        </label>

        <label className="search-field">
          <span>Type</span>
          <select
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
          >
            {typeOptions.map((item) => (
              <option key={item} value={item}>
                {typeLabel(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="search-status">
        {isIndexing
          ? 'Building search index…'
          : isActive
            ? `${resultCount} result${resultCount === 1 ? '' : 's'} found`
            : `Type at least ${searchConfig.minimumQueryLength} characters or use a filter.`}
      </div>
    </section>
  );
}
