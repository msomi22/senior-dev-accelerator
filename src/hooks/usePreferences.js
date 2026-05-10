import { useEffect, useState } from 'react';
import { storageService } from '../services/storageService.js';
export function usePreferences() {
  const [state, setState] = useState(storageService.read());
  useEffect(() => { document.documentElement.dataset.theme = state.theme; }, [state.theme]);
  const setTheme = theme => { storageService.setTheme(theme); setState(storageService.read()); };
  return { ...state, setTheme, refresh: () => setState(storageService.read()) };
}
