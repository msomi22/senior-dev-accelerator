import { useEffect, useMemo, useState } from 'react';
import { searchConfig } from '../config/searchConfig.js';
import { buildSearchIndex, searchQuestionIndex } from '../services/searchService.js';
import { useDebouncedValue } from './useDebouncedValue.js';

const EMPTY_FILTER = 'All';

export function useQuestionSearch(topics) {
  const [query, setQuery] = useState('');
  const [topicId, setTopicId] = useState(EMPTY_FILTER);
  const [difficulty, setDifficulty] = useState(EMPTY_FILTER);
  const [type, setType] = useState(EMPTY_FILTER);
  const [index, setIndex] = useState([]);
  const [isIndexing, setIsIndexing] = useState(false);

  const debouncedQuery = useDebouncedValue(query, searchConfig.debounceMs);

  const isActive = useMemo(() => {
    return (
      debouncedQuery.trim().length >= searchConfig.minimumQueryLength ||
      topicId !== EMPTY_FILTER ||
      difficulty !== EMPTY_FILTER ||
      type !== EMPTY_FILTER
    );
  }, [debouncedQuery, topicId, difficulty, type]);

  useEffect(() => {
    if (!isActive) return;

    let alive = true;
    setIsIndexing(true);

    buildSearchIndex(topics)
      .then((nextIndex) => {
        if (!alive) return;
        setIndex(nextIndex);
      })
      .finally(() => {
        if (alive) setIsIndexing(false);
      });

    return () => { alive = false; };
  }, [isActive, topics]);

  const results = useMemo(() => {
    if (!isActive || !index.length) return [];
    return searchQuestionIndex(index, {
      query: debouncedQuery,
      topicId,
      difficulty,
      type
    });
  }, [index, isActive, debouncedQuery, topicId, difficulty, type]);

  function clearSearch() {
    setQuery('');
    setTopicId(EMPTY_FILTER);
    setDifficulty(EMPTY_FILTER);
    setType(EMPTY_FILTER);
  }

  return {
    query,
    topicId,
    difficulty,
    type,
    setQuery,
    setTopicId,
    setDifficulty,
    setType,
    clearSearch,
    results,
    isActive,
    isIndexing
  };
}
