import{getActiveAcademyCatalog as g}from'../academies/catalog.js';
import H from'./AcademyHero.jsx';import P from'./AcademyPaths.jsx';
export default function AcademyHome(){const c=g();return <><H academy={c.academy}/><P categories={c.categories}/></>}
