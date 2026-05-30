# Content Preservation Rule

This rule supplements `docs/writing-coding-implementation-instructions.md`.

## Rule

When changing repository files, preserve existing content unless the issue explicitly asks for a content reduction and the user confirms it.

## Required behavior

When editing existing files:

- make the smallest targeted change possible;
- preserve existing sections, tabs, arrays, provider blocks, commands, examples, and learner content;
- avoid full-file rewrites unless unavoidable;
- verify the changed area after pushing;
- verify nearby surrounding content still exists;
- stop and ask before proceeding if a change could reduce existing content.

## Instruction wording

Every future implementation instruction should include this requirement:

```text
Preserve existing content. Keep unrelated sections, arrays, tabs, commands, provider content, examples, and learner-facing explanations intact unless the issue explicitly asks for a confirmed content reduction.
```

## PR validation

Pull requests should confirm that the intended change preserved unrelated content. For config-heavy files, especially problem files with `body`, `tabs`, `items`, `visualWalkthrough`, or provider sections, reviewers should verify that existing arrays still contain their original entries.
