import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import LoadingCard from '../components/LoadingCard.jsx';
import {
  getRecentQuestions,
  hydrateRecentQuestions
} from '../services/recentQuestionService.js';

import '../styles/progress-table.css';
import '../styles/recent-page.css';

function formatLastOpened(value) {
  const openedAt = new Date(value);
  if (Number.isNaN(openedAt.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(openedAt);
}

function difficultyClass(difficulty) {
  return String(difficulty || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

export default function RecentPage() {
  const [recentRows, setRecentRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    setLoading(true);

    hydrateRecentQuestions(getRecentQuestions())
      .then((rows) => {
        if (alive) setRecentRows(rows);
      })
      .catch((error) => {
        console.error(error);
        if (alive) setRecentRows([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="page progress-page-focused recent-page">
      {loading ? (
        <LoadingCard label="Loading recent practice…" />
      ) : (
        <section className="glass progress-table-card recent-table-card" aria-labelledby="recent-heading">
          <div className="progress-card-head">
            <div>
              <p className="eyebrow">Recent</p>
              <h1 id="recent-heading">Recent Practice</h1>
              <p>Your most opened questions appear here so you can quickly continue where you left off.</p>
            </div>
          </div>

          {recentRows.length === 0 ? (
            <div className="progress-empty-state recent-empty-state">
              <strong>No recent questions yet.</strong>
              <span>Open a quiz and it will appear here.</span>
            </div>
          ) : (
            <div className="progress-table-scroll">
              <table className="progress-topic-table recent-question-table">
                <thead>
                  <tr>
                    <th scope="col">Question</th>
                    <th scope="col">Topic</th>
                    <th scope="col">Difficulty</th>
                    <th scope="col">Opens</th>
                    <th scope="col">Last opened</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map((row) => (
                    <tr key={row.questionId}>
                      <td>
                        <div className="progress-topic-name">
                          <strong>{row.title}</strong>
                          <span>{row.questionId}</span>
                        </div>
                      </td>
                      <td>{row.topic}</td>
                      <td>
                        <span className={`progress-status-chip recent-difficulty ${difficultyClass(row.difficulty)}`}>
                          {row.difficulty}
                        </span>
                      </td>
                      <td className="progress-solved-count">{row.openCount}</td>
                      <td className="recent-date-cell">{formatLastOpened(row.lastOpenedAt)}</td>
                      <td>
                        {row.available ? (
                          <Link className="btn ghost progress-open-btn" to={row.route}>
                            Open
                          </Link>
                        ) : (
                          <span className="recent-unavailable-action">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
