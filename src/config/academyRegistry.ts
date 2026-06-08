import { techAcademy } from './academies/tech.ts';
import { cbcAcademy } from './academies/cbc.ts';
import { customerExperienceAcademy } from './academies/customerExperience.ts';

export const DEFAULT_ACADEMY_ID = 'tech';

export const academyRegistry = {
  tech: techAcademy,
  cbc: cbcAcademy,
  'customer-experience': customerExperienceAcademy
};

export function getAcademyById(academyId = DEFAULT_ACADEMY_ID) {
  return academyRegistry[