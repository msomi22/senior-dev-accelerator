import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getCategorySummaries, progressSummary } from '../services/questionBankService.js';
import { usePreferences } from '../hooks/usePreferences.js';
import ProgressChart from '../components/ProgressChart.jsx';
import BuyCoffeeButton from '../components/BuyCoffeeButton.jsx';
import CategoryLibrary from '../components/CategoryLibrary.jsx';

const emptySummary = { total: 0, done: 0, percent: 0 };

export default function Home() {
  const { completed } = usePreferences();
  const [summary, setSummary] = useState(emptySummary);
  const [loadingStats, setLoadingStats] = useState(true);

  const categories = useMemo(() => getCategorySummaries(), []);

  useEffect(() => {
    let alive = true;
    setLoadingStats(true);

    progressSummary(completed)
      .then((nextSummary) => {
        if (alive) setSummary(nextSummary);
      })
      .finally(() => {
        if (alive) setLoadingStats(false);
      });

    return () => { alive = false; };
  }, [completed]);

  const topicCount = categories.reduce((sum, category) => sum + (category.topicCount || 0), 0);

  return (
    <>
      <section className="hero-card glass">
        <p className="eyebrow">Engineering mastery platform</p>
        <h1>Become senior by learning the patterns behind the answers.</h1>
        <p>Train with a scalable category library. The dashboard stays clean whether you have 2 categories or 50 learning paths.</p>
        <div className="hero-actions">
          <Link className="btn" to="/random">Start random practice</Link>
          <Link className="btn ghost" to="/category/dsa">Explore DSA</Link>
          <BuyCoffeeButton className="btn coffee-btn" />
        </div>
      </section>

      <section className="dashboard-grid">
        <ProgressChart {...summary} />
        <div className="glass stat"><h2>{categories.length}</h2><p>categories</p></div>
        <div className="glass stat"><h2>{topicCount}</h2><p>topic banks</p></div>
        <div className="glass stat"><h2>{loadingStats ? '…' : summary.total}</h2><p>real questions</p></div>
      </section>

      <CategoryLibrary categories={categories} completed={completed} />

      <section className="learning-map glass">
        <h2>Senior thinking loop</h2>
        <div className="road">
          <span>Recognize pattern</span>
          <span>State invariant</span>
          <span>Explain trade-off</span>
          <span>Design clean solution</span>
          <span>Review progress</span>
        </div>
      </section>
    </>
  );
}
