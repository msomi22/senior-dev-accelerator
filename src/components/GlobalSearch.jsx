import { NavLink, useLocation } from 'react-router-dom';

import { usePreferences } from '../hooks/usePreferences.js';
import { useQuestionSearch } from '../hooks/useQuestionSearch.js';
import { allTopics } from '../services/questionBankService.js';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function GlobalResult({ entry, completed, onSelect }) {
  const question = entry.question;
  const questionId = question.id || entry.id;

  return (
    <NavLink
      className={`global-search-result ${completed ? 'done' : ''}`}
      to={`/problem/${encodeURIComponent(questionId)}`}
      state={{ searchEntry: entry }}
      onClick={onSelect}
    >
      <span>{entry.topicName}</span>
      <strong>{question.title}</strong>
      <small>{entry.difficulty} · {entry.type}</small>
    </NavLink>
  );
}

export default function GlobalSearch() {
  const location = useLocation();
  const { completed } = usePreferences();
  const search = useQuestionSearch(allTopics);
  const query = search.query.trim();
  const hasQuery = query.length > 0;
  const showPanel = hasQuery && search.isActive;
  const visibleResults = search.results.slice(0, 6);

  function clearSearch() {
    search.clearSearch();
  }

  return (
    <div className="global-search" role="search">
      <label className="global-search-control">
        <span className="sr-only">Search problems</span>
        <SearchIcon />
        <input
          type="search"
          value={search.query}
          onChange={(event) => search.setQuery(event.target.value)}
          placeholder="Search problems..."
          autoComplete="off"
        />
      </label>

      {showPanel ? (
        <div className="global-search-panel glass-lite">
          {search.isIndexing ? (
            <p className="global-search-status">Building search index…</p>
          ) : visibleResults.length ? (
            <>
              <div className="global-search-head">
                <span>{search.results.length} matches</span>
                <button type="button" onClick={clearSearch}>Clear</button>
              </div>

              <div className="global-search-results">
                {visibleResults.map((entry) => (
                  <GlobalResult
                    key={entry.id}
                    entry={entry}
                    completed={!!completed[entry.question.id || entry.id]}
                    onSelect={clearSearch}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="global-search-empty">
              <strong>No matches found</strong>
              <p>Try a broader term like cache, graph, retry, window, queue, or index.</p>
              <button type="button" onClick={clearSearch}>Clear search</button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
