import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import TopicSection from '../components/TopicSection.jsx';
import TopicLibrary from '../components/TopicLibrary.jsx';
import LoadingCard from '../components/LoadingCard.jsx';
import SearchPanel from '../components/SearchPanel.jsx';
import SearchResultsSection from '../components/SearchResultsSection.jsx';

import { storageService } from '../services/storageService.js';
import {
  ALL_FILTER,
  getFilteredTopicQuestions
} from '../services/topicFilterService.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { useQuestionSearch } from '../hooks/useQuestionSearch.js';

import {
  getCategory,
  getTopicsForCategory,
  loadTopicBank
} from '../services/questionBankService.js';

export default function CategoryPage({ fixedCategoryId }) {
  const params = useParams();
  const categoryId = fixedCategoryId || params.categoryId;
  const category = getCategory(categoryId);

  const pref = usePreferences();

  const [topics, setTopics] = useState([]);
  const [topicBanks, setTopicBanks] = useState({});
  const [completed, setCompleted] = useState(pref.completed);

  const [selectedId, setSelectedId] = useState(
    pref.selectedTopics?.[categoryId] || ''
  );

  const [topicDifficulty, setTopicDifficulty] = useState(ALL_FILTER);
  const [completionFilter, setCompletionFilter] = useState('all');

  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);

  useEffect(() => {
    let alive = true;

    setLoadingTopics(true);
    setLoadingBanks(true);

    Promise.resolve(getTopicsForCategory(categoryId))
      .then(async (nextTopics) => {
        if (!alive) return;

        setTopics(nextTopics);

        const storedSelectedId =
          storageService.getSelectedTopic?.(categoryId) || selectedId;

        const validSelectedId = nextTopics.some(
          (topic) => topic.id === storedSelectedId
        )
          ? storedSelectedId
          : nextTopics[0]?.id || '';

        setSelectedId(validSelectedId);

        const loadedBanks = await Promise.all(
          nextTopics.map(async (topic) => {
            const bank = await loadTopicBank(topic.id);
            return [topic.id, bank];
          })
        );

        if (!alive) return;

        setTopicBanks(Object.fromEntries(loadedBanks));
      })
      .finally(() => {
        if (!alive) return;

        setLoadingTopics(false);
        setLoadingBanks(false);
      });

    return () => {
      alive = false;
    };
  }, [categoryId]);

  useEffect(() => {
    if (selectedId) {
      storageService.setSelectedTopic(categoryId, selectedId);
    }
  }, [categoryId, selectedId]);

  const topicsWithBanks = useMemo(() => {
    return topics.map((topic) => {
      const bank = topicBanks[topic.id];

      return {
        ...topic,
        questions: bank?.questions || [],
        count: bank?.questions?.length || 0
      };
    });
  }, [topics, topicBanks]);

  const topicDifficultyOptions = useMemo(() => {
    const order = {
      Easy: 1,
      Medium: 2,
      Hard: 3
    };

    const set = new Set();

    topicsWithBanks.forEach((topic) => {
      topic.questions.forEach((question) => {
        if (question.difficulty) {
          set.add(question.difficulty);
        }
      });
    });

    return Array.from(set).sort(
      (a, b) => (order[a] || 99) - (order[b] || 99)
    );
  }, [topicsWithBanks]);

  const filteredTopics = useMemo(() => {
    return topicsWithBanks
      .map((topic) => {
        const filteredQuestions = getFilteredTopicQuestions(
          topic,
          completed,
          topicDifficulty,
          completionFilter
        );

        return {
          ...topic,
          filteredQuestions,
          filteredCount: filteredQuestions.length
        };
      })
      .filter((topic) => topic.filteredCount > 0);
  }, [topicsWithBanks, topicDifficulty, completionFilter, completed]);

  const selectedTopic = useMemo(() => {
    return filteredTopics.find((topic) => topic.id === selectedId);
  }, [filteredTopics, selectedId]);

  useEffect(() => {
    if (!filteredTopics.length) return;

    const selectedStillVisible = filteredTopics.some(
      (topic) => topic.id === selectedId
    );

    if (!selectedStillVisible) {
      setSelectedId(filteredTopics[0].id);
    }
  }, [filteredTopics, selectedId]);

  const searchTopics = useMemo(() => topics, [topics]);
  const search = useQuestionSearch(searchTopics);

  const toggle = (id) => {
    setCompleted(storageService.toggleComplete(id));
  };

  if (!category) {
    return (
      <main className="page category-page">
        <section className="hero-card glass">
          <p className="eyebrow">Unknown category</p>
          <h1>Category not found</h1>
          <p>This category does not exist in the category manifest.</p>
          <Link className="btn" to="/">
            Go back home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page category-page">
      <section className="page-title">
        <p className="eyebrow">{category.shortName || category.name}</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>

        {!loadingTopics && !loadingBanks ? (
          <div className="header-search">
            <SearchPanel
              query={search.query}
              onQueryChange={search.setQuery}
            />
          </div>
        ) : null}
      </section>

      {!loadingTopics && !loadingBanks && search.isActive ? (
        search.isIndexing ? (
          <LoadingCard label="Building search index…" />
        ) : (
          <SearchResultsSection
            results={search.results}
            completed={completed}
            onToggle={toggle}
          />
        )
      ) : null}

      {loadingTopics || loadingBanks ? (
        <LoadingCard label="Loading category topics…" />
      ) : (
        <>
          <TopicLibrary
            topics={filteredTopics}
            allTopicsCount={topics.length}
            selectedId={selectedId}
            completed={completed}
            onSelect={setSelectedId}
            difficulty={topicDifficulty}
            onDifficultyChange={setTopicDifficulty}
            difficultyOptions={topicDifficultyOptions}
            completionFilter={completionFilter}
            onCompletionFilterChange={setCompletionFilter}
          />

          {selectedTopic ? (
            <TopicSection
              topic={selectedTopic}
              questions={selectedTopic.filteredQuestions}
              completed={completed}
              onToggle={toggle}
              activeDifficulty={topicDifficulty}
            />
          ) : null}

        </>
      )}
    </main>
  );
}
