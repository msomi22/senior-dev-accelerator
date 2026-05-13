import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import './styles/ui-refresh.css';
import './styles/visual-learning.css';
import './styles/learning-dashboard.css';
import './styles/senior-ui.css';
import './styles/light-theme-fixes.css';
import './styles/enhanced-dark-theme.css';
import './styles/enhanced-dark-theme-fixes.css';
import './styles/problem-pill-fixes.css';
import './styles/shared-theme-geometry.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
