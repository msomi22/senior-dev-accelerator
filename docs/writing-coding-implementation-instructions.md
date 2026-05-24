# Writing Coding Implementation Instructions

Use this guide when creating implementation instructions for a developer or coding agent.

The goal is to make the task executable without guesswork. A good instruction tells the implementer exactly what to read, which branch to use, which files to edit, what not to change, how to validate the work, and how to write the pull request.

## Required structure

Every implementation instruction should include these sections.

### 1. Task summary

Explain the goal in one or two short paragraphs.

Include:

- issue number
- parent epic if applicable
- branch name
- expected user-facing outcome

Example:

```text
Implement #135 on branch feature/add-min-size-subarray-sum-sliding-window.
Add one new explanation-first Sliding Window DSA problem for Minimum Size Subarray Sum.
```

### 2. Required references

List the documents and issues the implementer must read before coding.

For Senior Dev Accelerator problem-authoring tasks, include:

- `docs/adding-new-problems.md`
- #131 — explanation-first problem authoring standard
- the target issue
- the parent epic when relevant
- at least one existing problem file to use as a style reference

### 3. Branch instructions

State whether the branch already exists.

If the branch exists, say:

```bash
git fetch origin
git checkout <branch-name>
git pull --ff-only
```

Do not tell the implementer to create a new branch when one already exists.

### 4. Files to create or edit

Be explicit.

Use three groups:

- create
- edit if needed
- do not edit

This avoids accidental legacy-bank changes, renderer hacks, or unrelated refactors.

### 5. Implementation requirements

Describe the required behavior and content.

For problem-authoring tasks, include:

- problem id
- category
- topicId
- type
- language
- difficulty
- required fields
- visual walkthrough requirements
- metadata visibility

### 6. Content quality requirements

Reference #131 and convert it into task-specific checks.

Include checks for:

- clarity before code
- intuition before formula
- concrete example before abstraction
- no hidden jumps
- no repeated teaching without purpose
- section-specific responsibilities
- visuals that teach state changes

### 7. Testing and validation

List exact commands.

At minimum:

```bash
npm run test:unit
npm run build
```

For visual or UI work, include manual verification steps and console-error checks.

### 8. Pull request requirements

Tell the implementer what the PR must include.

Usually:

- link to the issue
- summary of files changed
- validation commands and results
- screenshots or notes for UI work
- `Closes #<issue-number>` when the PR fully completes the issue

### 9. Non-goals

Call out what should not be done.

Examples:

- do not add a legacy bank entry as the primary source
- do not create one-off visual components unless the issue explicitly requires it
- do not change unrelated topics
- do not weaken tests to make content pass

## Quality checklist

Before posting implementation instructions, confirm:

- [ ] The target branch is named.
- [ ] The task issue is linked.
- [ ] The parent epic is linked when relevant.
- [ ] Required docs are linked.
- [ ] Exact file paths are provided.
- [ ] Existing reference files are provided.
- [ ] Validation commands are provided.
- [ ] Manual verification steps are provided when UI behavior changes.
- [ ] The instruction says what not to change.
- [ ] The PR requirements are clear.

## Preferred instruction template

```md
## Implementation instruction

### Task

Implement <issue-number> on branch `<branch-name>`.

Expected outcome: <short user-facing result>.

### Required references

Read these before coding:

- <target issue>
- <parent epic>
- <quality standard>
- <implementation guide>
- <reference files>

### Branch

The branch already exists. Use:

```bash
git fetch origin
git checkout <branch-name>
git pull --ff-only
```

### Create

- `<new-file-path>`

### Edit if needed

- `<test-file-path>`

### Do not edit

- `<legacy-file-or-unrelated-area>`

### Implementation requirements

- <requirement 1>
- <requirement 2>
- <requirement 3>

### Content quality requirements

- <quality requirement 1>
- <quality requirement 2>
- <quality requirement 3>

### Validation

Run:

```bash
npm run test:unit
npm run build
```

Manually verify:

1. <manual check 1>
2. <manual check 2>
3. <manual check 3>

### Pull request

Open a PR into `main`.

The PR must include:

- summary
- validation results
- screenshots or manual verification notes when UI is affected
- `Closes #<issue-number>` when complete
```

## Common mistakes to avoid

- Giving a high-level plan but no exact file paths.
- Asking the implementer to create a branch that already exists.
- Forgetting to link the parent epic or quality standard.
- Mixing app registration instructions with discovery-based problem loading.
- Forgetting validation commands.
- Forgetting manual UI checks for visual content.
- Allowing renderer-specific data shapes that are known to break components.
- Saying to close the issue before all acceptance criteria are satisfied.
