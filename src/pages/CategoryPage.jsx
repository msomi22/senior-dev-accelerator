import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopicSection from '../components/TopicSection.jsx';
import TopicLibrary from '../components/TopicLibrary.jsx';
import LoadingCard from '../components/LoadingCard.jsx';
import SearchPanel from '../components/SearchPanel.jsx';
import SearchResultsSection from '../components/SearchResultsSection.jsx';
import { storageService } from '../services/storageService.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { useQuestionSearch } from '../hooks/useQuestionSearch.js';
import { getCategory, getTopicsForCategory, loadTopicBank } from '../services/questionBankService.js';

export default function CategoryPage({ fixedCategoryId }) {
  const params = useParams();
  const categoryId = fixedCategoryId || params.categoryId;
  const category = getCategory(categoryId);
  const pref = usePreferences();

  const [topics, setTopics] = useState([]);
  const [completed, setCompleted] = useState(pref.completed);
  const [selectedId, setSelectedId] = useState(pref.selectedTopics?.[categoryId] || '');
  const [topic, setTopic] = useState(null);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingTopic, setLoadingTopic] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoadingTopics(true);

    Promise.resolve(getTopicsForCategory(categoryId))
      .then((nextTopics) => {
        if (!alive) return;
        setTopics(nextTopics);

        const storedSelectedId = storageService.getSelectedTopic?.(categoryId) || selectedId;
        const stillValid = nextTopics.some((topicMeta) => topicMeta.id === storedSelectedId);
        if (!storedSelectedId || !stillValid) {
          setSelectedId(nextTopics[0]?.id || '');
        } else {
          setSelectedId(storedSelectedId);
        }
      })
      .finally(() => {
        if (alive) setLoadingTopics(false);
      });

    return () => { alive = false; };
  }, [categoryId]);

  useEffect(() => {
    if (!selectedId) return;

    let alive = true;
    setLoadingTopic(true);

    loadTopicBank(selectedId)
      .then((bank) => {
        if (alive) setTopic(bank);
      })
      .finally(() => {
        if (alive) setLoadingTopic(false);
      });

    storageService.setSelectedTopic(categoryId, selectedId);

    return () => { alive = false; };
  }, [categoryId, selectedId]);

  const searchTopics = useMemo(() => topics, [topics]);
  const search = useQuestionSearch(searchTopics);

  const toggle = (id) => setCompleted(storageService.toggleComplete(id));

  if (!category) {
    return (
      <section className="hero-card glass">
        <p className="eyebrow">Unknown category</p>
        <h1>Category not found</h1>
        <p>This category does not exist in the category manifest.</p>
        <Link className="btn" to="/">Go back home</Link>
      </section>
    );
  }

  return (
    <>
      <section className="page-title">
        <p className="eyebrow">{category.shortName || category.name}</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </section>

      {loadingTopics ? (
        <LoadingCard label="Loading category topics…" />
      ) : (
        <>
          <SearchPanel
            topics={topics}
            query={search.query}
            topicId={search.topicId}
            difficulty={search.difficulty}
            type={search.type}
            onQueryChange={search.setQuery}
            onTopicChange={search.setTopicId}
            onDifficultyChange={search.setDifficulty}
            onTypeChange={search.setType}
            onClear={search.clearSearch}
            isActive={search.isActive}
            isIndexing={search.isIndexing}
            resultCount={search.results.length}
          />

          {search.isActive ? (
            search.isIndexing ? (
              <LoadingCard label="Building search index…" />
            ) : (
              <SearchResultsSection
                results={search.results}
                completed={completed}
                onToggle={toggle}
              />
            )
          ) : (
            <>
              <TopicLibrary
                topics={topics}
                selectedId={selectedId}
                completed={completed}
                onSelect={setSelectedId}
              />
              {loadingTopic ? (
                <LoadingCard label="Loading topic bank…" />
              ) : (
                <TopicSection
                  topic={topic}
                  completed={completed}
                  onToggle={toggle}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
