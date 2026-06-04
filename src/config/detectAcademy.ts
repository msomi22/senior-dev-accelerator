import {
  DEFAULT_ACADEMY_ID,
  academyRegistry,
  getAcademyById
} from './academyRegistry.ts';

import type { AcademyConfig, AcademyId } from '../types/academy.ts';

export function detectAcademyIdFromHostname(hostname = ''): AcademyId {
  const normalized = String(hostname || '').toLowerCase();

  if (normalized.startsWith('cbc.')) return 'cbc';
  if (normalized.startsWith('cx.')) return 'customer-experience';

  const matchedAcademy = Object.values(academyRegistry).find((academy) =>
    (academy.subdomains || []).some((subdomain) => subdomain.toLowerCase() === normalized)
  );

  return matchedAcademy?.id || DEFAULT_ACADEMY_ID;
}

export function getActiveAcademy(hostname = globalThis?.location?.hostname || ''): AcademyConfig {
  return getAcademyById(detectAcademyIdFromHostname(hostname));
}
