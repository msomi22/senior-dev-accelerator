import { useEffect, useState } from 'react';
import { storageService } from '../services/storageService.js';

const PREFERENCES_CHANGED_EVENT = 'senior-dev-preferences-changed';

function readPreferences() {
  return storageService.read();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function usePreferences() {
  const [state, setState] = useState(readPreferences);

  useEffect(() => {
    applyTheme(state.theme);
  }, [state.theme]);

  useEffect(() => {
    function refreshPreferences() {
      setState(readPreferences());
    }

    window.addEventListener(PREFERENCES_CHANGED_EVENT, refreshPreferences);
    window.addEventListener('storage', refreshPreferences);

    return () => {
      window.removeEventListener(PREFERENCES_CHANGED_EVENT, refreshPreferences);
      window.removeEventListener('storage', refreshPreferences);
    };
  }, []);

  const setTheme = (theme) => {
    storageService.setTheme(theme);
    const nextState = readPreferences();

    applyTheme(nextState.theme);
    setState(nextState);
    window.dispatchEvent(new CustomEvent(PREFERENCES_CHANGED_EVENT));
  };

  return {
    ...state,
    setTheme,
    refresh: () => setState(readPreferences())
  };
}
