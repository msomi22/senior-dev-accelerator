import { useEffect } from 'react';

export function useContentProtection() {
  useEffect(() => {
    const blockContext = e => e.preventDefault();
    const blockKeys = e => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['c','u','s','p','a'].includes(key)) e.preventDefault();
      if (key === 'f12') e.preventDefault();
    };
    window.addEventListener('contextmenu', blockContext);
    window.addEventListener('keydown', blockKeys);
    return () => {
      window.removeEventListener('contextmenu', blockContext);
      window.removeEventListener('keydown', blockKeys);
    };
  }, []);
}
