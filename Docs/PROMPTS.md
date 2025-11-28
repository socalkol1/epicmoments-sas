# Prompt Templates

> Copy and customize these templates when working with Claude Code.

## Feature Implementation

```
Implement: [FEATURE NAME]

## Requirements
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

## Files to create/modify
- path/to/file1.ts
- path/to/file2.ts

## Constraints
- Must work with existing [PATTERN/TYPES]
- Must include error handling
- Must validate with Zod

## Reference
- Types: src/types/database.ts
- Existing pattern: src/lib/[similar-feature]/

Please:
1. Create a step-by-step plan first
2. Show code for Step 1
3. Show test command
4. Report result (✅ or ❌)
5. Only proceed to Step 2 if Step 1 passes
```

---

## Bug Fix

```
Fix: [BUG DESCRIPTION]

## Current Behavior
[What happens now]

## Expected Behavior
[What should happen]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Error Message
```
[Error message]
```

## Relevant Code
```typescript
[Paste relevant code]
```

## Environment
- Browser: [Browser]
- Node: [Version]

Please identify root cause and provide a fix.
```

---

## Code Review

```
Review this code for the photography platform.

## File: [FILE PATH]
```typescript
[Paste code]
```

## Review Criteria
1. TypeScript correctness
2. Error handling
3. Security (especially [AUTH/DATA])
4. Performance
5. Project patterns
6. Edge cases

Please provide:
1. Issues (critical/moderate/minor)
2. Suggested improvements
3. Refactored code if needed
```

---

## Architecture Decision

```
I need to decide between options for [DECISION].

## Context
[Why this decision is needed]

## Options

### Option A: [Name]
- Pros: [List]
- Cons: [List]
- Effort: [Low/Medium/High]

### Option B: [Name]
- Pros: [List]
- Cons: [List]
- Effort: [Low/Medium/High]

## Constraints
- Must work with: [Existing tech]
- Budget: [Cost limits]
- Scale: [Expected usage]

Please analyze and recommend.
```

---

## Error Recovery

Use when something isn't working after initial attempts:

```
## Error Recovery

### What I tried
[Specific code/approach that failed]

### Error
```
[Exact error message]
```

### Files involved
- [path/to/file1.ts]
- [path/to/file2.ts]

### What I've already checked
1. [Check 1]
2. [Check 2]

### What I suspect
[Your hypothesis]

### Please:
1. Don't repeat the same approach
2. Identify what assumption is wrong
3. Suggest a DIFFERENT approach
4. Explain why it should work
```

---

## Session Handoff

Use when ending a session:

```
## Session Summary - [DATE]

### Completed
- [Feature 1]
- [Feature 2]

### Current state
- Last working commit: [HASH]
- All tests passing: [YES/NO]
- Branch: [NAME]

### What's next
- [Next task]
- Blockers: [Any]

### Key decisions
- [Decision 1 and why]

### Files modified
- [path/to/file.ts] - [what changed]

### Notes for next session
- [Important things to remember]
```

---

## Stuck Reset

Use when Claude is looping on a problem:

```
Stop. Let's reassess.

1. What are the 3 most likely root causes?
2. Which is most likely and why?
3. What's the SIMPLEST fix for that cause?
4. Let's try just that one thing.
```

If still stuck:

```
Let's try a completely different approach.

What we tried: [APPROACH]
Why it failed: [REASON]

What's an alternative that avoids [PROBLEM]?
```

---

## Session Start

```
Continuing photography platform development.

Current state: See PROGRESS.md
Today's focus: [TASK]

Please read before we begin:
- docs/[RELEVANT].md

Let me know when ready.
```

---

## Quick Commands

**New component:**
```
Create a [NAME] component.
- Server/Client component
- Props: [PROPS]
- Location: components/[path]/
- Include loading state
```

**New API route:**
```
Create API route: [METHOD] /api/[PATH]
- Input validation with Zod
- Auth required: [YES/NO]
- Rate limit: [TYPE]
- Returns: [RESPONSE]
```

**Database query:**
```
Write a query to [DESCRIPTION].
- Table: [TABLE]
- Filters: [FILTERS]
- Must respect RLS
- Include tenant_id check
```
