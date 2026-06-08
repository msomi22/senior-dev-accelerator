import{t}from'./academies/t.ts';import{c}from'./academies/c.ts';import{x}from'./academies/x.ts';
export const DEFAULT_ACADEMY_ID='tech';
export const academyRegistry={tech:t,cbc:c,'customer-experience':x};
export function getAcademyById(a=DEFAULT_ACADEMY_ID){return academyRegistry[a]||academyRegistry[DEFAULT_ACADEMY_ID]}
export function getDefaultAcademy(){return