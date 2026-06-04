# Copilot Implementation Notes — Multi-Academy TypeScript Foundation

## Branch

```text
feature/multiacademy-evaluation
```

## Objective

Stabilize the first safe foundation for a future Qubitel multi-academy platform while preserving the existing Senior Dev Accelerator behavior.

The canonical hierarchy is:

```text
Academy
└── Category
    └── Topic
        ├── Lessons
        ├── Practice
        └── Assessments
```

This branch uses TypeScript as the source of truth for the new academy foundation. It does not migrate learner-facing content and does not expose new academies in the live tech experience.

## Current Active Content Source

The current production experience still uses the existing Senior Dev Accelerator content system:

```text
src/data/problems/
src/data/topicManifest.js
src/services/questionBankService.js
```

Do not move this content into `src/academies/*` as part of this foundation step.

## Foundation Files

The academy foundation currently lives in:

```text
src/types/academy.ts
src/config/academyRegistry.ts
src/config/detectAcademy.ts
src/config/academyStorage.ts
src/config/detectAcademy.test.ts
```

Expected exports:

- `DEFAULT_ACADEMY_ID`
- `academyRegistry`
- `getAcademyById`
- `getDefaultAcademy`
- `getAcademies`
- `detectAcademyIdFromHostname`
- `getActiveAcademy`
- `getAcademyStorageKey`

## Academy IDs

Required safe ids:

```text
tech
cbc
customer-experience
```

Use lowercase kebab-case for ids, folders, routes, and manifest keys. Display names may contain spaces.

## Required Detection Behavior

```text
academy.qubitel.net              → tech
localhost                        → tech
preview / unknown domains         → tech
cbc.academy.qubitel.net          → cbc
cx.academy.qubitel.net           → customer-experience
```

Unknown academy ids must fall back to `tech`.

## Storage Rules

The tech academy must preserve the current storage key:

```text
senior-dev-accelerator:v2
```

This protects existing learner progress.

CBC and Customer Experience must use separate future storage keys:

```text
senior-dev-accelerator:v2:cbc
senior-dev-accelerator:v2:customer-experience
```

`src/config/academyStorage.ts` should return the active academy storage key, but this helper should not be wired into live storage until a later, carefully tested step unless the branch already requires it.

## `src/academies/*` Skeleton

The `src/academies/*` folder is intentionally kept as a future-target skeleton.

Important rules:

- It is not the active content source yet.
- Existing tech content must not be moved in this task.
- CBC learner content must not be added in this task.
- Customer Experience learner content must not be added in this task.
- CBC and Customer Experience skeletons must not be exposed to learners yet.

## TypeScript and Tests

The project targets Node 22 and uses the built-in Node test runner.

Because Node does not execute `.ts` files by default in this setup, test scripts use Node's TypeScript strip-types path:

```text
node --disable-warning=ExperimentalWarning --experimental-strip-types --test
```

This keeps the fix small and avoids adding a new test framework.

TypeScript support should remain minimal:

- `typescript` is a dev dependency.
- `@types/node` is a dev dependency for `node:test` and `node:assert/strict` typings.
- `tsconfig.json` allows `.ts` extension imports because the TS files import other TS files explicitly.

## Existing Routes Must Continue Working

Manual verification should confirm that these still behave as the current Senior Dev Accelerator experience:

```text
/
/categories
/category/dsa
/problem/:questionId
/random
/recent
/progress
/settings
```

CBC categories and Customer Experience categories must not appear in the tech academy.

## Non-Goals

Do not:

- add CBC learner content;
- add Customer Experience learner content;
- expose CBC or Customer Experience in the live UI;
- move existing tech content into `src/academies`;
- rewrite routing;
- rewrite the UI shell;
- change current production routes;
- change existing category ids;
- change existing topic ids;
- change existing question ids;
- modify unrelated dependencies;
- perform a repository-wide JavaScript to TypeScript migration;
- add a new test framework;
- weaken tests.

## Validation

Run:

```bash
npm install
npm run test:unit
npm run build
```

Also inspect:

```bash
git diff main...feature/multiacademy-evaluation --stat
git diff main...feature/multiacademy-evaluation -- package.json
git diff main...feature/multiacademy-evaluation -- src/config
git diff main...feature/multiacademy-evaluation -- src/types
git diff main...feature/multiacademy-evaluation -- src/academies
```

## PR Summary Template

```md
## Summary

- Stabilizes the TypeScript-only multi-academy foundation.
- Keeps Senior Dev Accelerator as the default tech academy.
- Adds/keeps hostname-based academy detection and storage-key helpers.
- Keeps `src/academies/*` as a future-target skeleton only.
- Clarifies current-state vs future-state architecture docs.

## Validation

- npm run test:unit
- npm run build

## Notes

- Existing Senior Dev Accelerator behavior is unchanged.
- `package-lock.json` is not included because the repository does not currently use one.
- No existing content was moved.
- No category, topic, or question ids were changed.

Relates to #261
```
