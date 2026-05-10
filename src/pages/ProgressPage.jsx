import { useEffect, useState } from 'react';
import {
  getAllTopicsWithCounts,
  progressSummary,
  topicProgress
} from '../services/questionBankService.js';

import { usePreferences } from '../hooks/usePreferences.js';

import ProgressChart from '../components/ProgressChart.jsx';
import LoadingCard from '../components/LoadingCard.jsx';

export default function ProgressPage() {
  const { completed } = usePreferences();

  const [summary, setSummary] = useState({
    total: 0,
    done: 0,
    percent: 0
  });

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    setLoading(true);

    Promise.all([
      progressSummary(completed),
      getAllTopicsWithCounts()
    ])
      .then(([nextSummary, nextTopics]) => {
        if (!alive) return;

        setSummary(nextSummary);
        setTopics(nextTopics);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [completed]);

  return (
    <div className="page progress-page">

      <section className="page-title">
        <p className="eyebrow">Browser storage</p>

        <h1>Your progress</h1>

        <p>
          Progress totals are now computed from the real
          quiz banks, not hardcoded manifest counts.
        </p>
      </section>

      <ProgressChart {...summary} />

      {loading ? (
        <LoadingCard label="Calculating real progress counts…" />
      ) : (
        <div className="progress-list">
          {topics.map((topic) => {
            const p = topicProgress(topic, completed);

            return (
              <div
                className="glass progress-row"
                key={topic.id}
              >
                <strong>{topic.name}</strong>

                <span>
                  {p.done}/{p.total}
                </span>

                <meter
                  min="0"
                  max={p.total}
                  value={p.done}
                />
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}