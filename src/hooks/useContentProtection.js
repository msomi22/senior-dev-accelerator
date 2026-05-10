// import { useEffect } from 'react';

// export function useContentProtection() {
//   useEffect(() => {
//     const blockContext = e => e.preventDefault();
//     const blockKeys = e => {
//       const key = e.key.toLowerCase();
//       if ((e.ctrlKey || e.metaKey) && ['c','u','s','p','a'].includes(key)) e.preventDefault();
//       if (key === 'f12') e.preventDefault();
//     };
//     window.addEventListener('contextmenu', blockContext);
//     window.addEventListener('keydown', blockKeys);
//     return () => {
//       window.removeEventListener('contextmenu', blockContext);
//       window.removeEventListener('keydown', blockKeys);
//     };
//   }, []);
// }

import { useEffect } from 'react';

/**
 * Content protection is intentionally disabled.
 *
 * This is a learning product, so users should be able to:
 * - highlight explanations
 * - copy notes for personal study
 * - right-click links
 * - use browser search and accessibility tools
 *
 * The quality of the content is the product moat, not blocking normal browser behavior.
 */
export function useContentProtection() {
  useEffect(() => undefined, []);
}
