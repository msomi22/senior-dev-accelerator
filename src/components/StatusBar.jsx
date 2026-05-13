import { useEffect, useState } from 'react';
import { siteConfig } from '../config/siteConfig.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { progressSummary } from '../services/questionBankService.js';

const emptySummary = { total: 0, done: 0, percent: 0 };

export default function StatusBar() {
  const { completed } = usePreferences();
  const [summary, setSummary] = useState(emptySummary);

  useEffect(() => {
    let alive = true;

    progressSummary(completed).then((nextSummary) => {
      if (alive) setSummary(nextSummary);
    });

    return () => {
      alive = false;
    };
  }, [completed]);

  return (
    <footer className="status-bar">
      <div className="status-item">
        Completion <strong>{summary.percent}%</strong>
      </div>
      <span className="status-sep" aria-hidden="true" />
      <div className="status-item">
        Solved <strong>{summary.done} / {summary.total}</strong>
      </div>
      <span className="status-sep" aria-hidden="true" />
      <div className="status-item">
        &copy; {new Date().getFullYear()} {siteConfig.appName}
      </div>
    </footer>
  );
}
