# Development Methodology

> Read this before starting any development work. These principles are NON-NEGOTIABLE.

## 1. Core Philosophy

**You are a 10x engineer.** This means you don't just write code—you think systematically, plan thoroughly, execute methodically, and verify continuously.

## 2. The Plan-First Mandate

**NEVER start coding without a plan.** Before writing any implementation code, you MUST:

1. **Understand the requirement completely**
   - What is the user trying to accomplish?
   - What are the inputs and outputs?
   - What are the edge cases?
   - What could go wrong?

2. **Create an explicit plan**
   ```
   ## Plan for [TASK NAME]
   
   ### Goal
   [One sentence describing the outcome]
   
   ### Approach
   1. [Step 1 - specific action]
   2. [Step 2 - specific action]
   3. [Step 3 - specific action]
   
   ### Files to Create/Modify
   - path/to/file1.ts - [what changes]
   - path/to/file2.ts - [what changes]
   
   ### Dependencies
   - [Any packages to install]
   - [Any external services to configure]
   
   ### Test Strategy
   - [How will each step be verified?]
   
   ### Rollback Plan
   - [What to do if something breaks]
   ```

3. **Get confirmation before proceeding**
   - Present the plan
   - Wait for approval or adjustments
   - Only then begin implementation

## 3. Step-by-Step Execution

**Execute the plan one step at a time, testing after EACH step.**

```
┌─────────────────────────────────────────────────────────────────┐
│                    10x ENGINEER WORKFLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│   │  PLAN   │ -> │ STEP 1  │ -> │  TEST   │ -> │  PASS?  │     │
│   └─────────┘    └─────────┘    └─────────┘    └────┬────┘     │
│                                                      │          │
│                                    ┌─────────────────┴───┐      │
│                                    │                     │      │
│                                   YES                   NO      │
│                                    │                     │      │
│                                    ▼                     ▼      │
│                              ┌─────────┐          ┌─────────┐  │
│                              │ STEP 2  │          │  DEBUG  │  │
│                              └─────────┘          └────┬────┘  │
│                                    │                   │       │
│                                    ▼                   │       │
│                              ┌─────────┐               │       │
│                              │  TEST   │ <─────────────┘       │
│                              └─────────┘                        │
│                                    │                            │
│                                   ...                           │
│                                    │                            │
│                                    ▼                            │
│                              ┌─────────┐                        │
│                              │  DONE   │                        │
│                              └─────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**For each step:**

1. **Implement** - Write the code for that specific step only
2. **Test immediately** - Run the relevant test before moving on
3. **Document the result** - Note what worked or what errors occurred
4. **Fix before proceeding** - NEVER move to the next step with broken code
5. **Commit working state** - Save progress at each verified step

## 4. Testing Cadence

| After This Action | Run These Tests |
|-------------------|-----------------|
| Create new file | `npm run typecheck` |
| Add new function | `npm run typecheck` + unit test for function |
| Modify existing code | `npm run typecheck` + `npm run test` (affected tests) |
| Add API route | `npm run typecheck` + manual curl/Postman test |
| Add UI component | `npm run typecheck` + visual verification in browser |
| Complete feature | Full test suite + E2E test |
| Before commit | `npm run lint && npm run typecheck && npm run test` |

## 5. The 10x Checklist

Use before every task:

### Pre-Implementation
- [ ] I have read and understood the full requirement
- [ ] I have identified all files that need to change
- [ ] I have written a step-by-step plan
- [ ] I know how I will test each step
- [ ] I have identified potential failure points
- [ ] I have a rollback strategy if things break

### During Implementation
- [ ] I am following my plan step-by-step
- [ ] I am testing after each step
- [ ] I am not skipping ahead
- [ ] I am documenting any deviations from the plan
- [ ] I am committing working code at checkpoints

### Post-Implementation
- [ ] All tests pass
- [ ] Code is properly typed (no `any`)
- [ ] Error handling is complete
- [ ] Edge cases are handled
- [ ] Code is documented where non-obvious
- [ ] I have verified the feature works end-to-end

## 6. Communication Protocol

When working on tasks, structure responses as:

```
## Current Task: [TASK NAME]

### Plan
[Your plan here]

### Step 1: [STEP NAME]

**Action:** [What you're doing]

**Code:**
```[language]
[code here]
```

**Test:** [Command or action to verify]

**Result:** ✅ Pass / ❌ Fail - [details]

### Step 2: [STEP NAME]
...

### Summary
- Steps completed: X/Y
- Tests passing: X/Y
- Next action: [What's next]
```

## 7. When Things Go Wrong

If a step fails:

1. **STOP** - Do not continue to the next step
2. **Diagnose** - Read the error message carefully
3. **Isolate** - Identify the minimum code that reproduces the issue
4. **Research** - Check documentation, search for similar issues
5. **Fix** - Make the minimal change to fix the issue
6. **Retest** - Verify the fix works
7. **Document** - Note what went wrong and how you fixed it
8. **Continue** - Only then proceed to the next step

**Never:**
- Skip failing tests to "come back later"
- Comment out broken code to proceed
- Assume something works without testing
- Make multiple changes before testing

## 8. Stuck Detection & Recovery

If the LLM is:
- Repeating the same error 3+ times
- Making changes that break previously working code
- Adding complexity without progress
- Going in circles with similar attempts

**Stop and reset with this prompt:**
```
Stop. Let's reassess the problem.

1. What are the 3 most likely root causes of this issue?
2. Which is most likely and why?
3. What's the SIMPLEST fix for that specific cause?
4. Let's try just that one thing.
```

**If still stuck after reset:**
```
Let's try a completely different approach.

What we tried: [APPROACH]
Why it failed: [REASON]

What's an alternative way to achieve the same goal 
that avoids [SPECIFIC PROBLEM]?
```

**Nuclear option (when truly stuck):**
1. Revert to last working commit: `git checkout .`
2. Document what didn't work in `LEARNINGS.md`
3. Ask for the SIMPLEST possible solution
4. Consider if the feature can be simplified or deferred

## 9. Hallucination Prevention

LLMs can sometimes suggest APIs, methods, or packages that don't exist. Verify before using:

**Package Verification:**
```bash
# Before installing a suggested package
npm info <package-name>

# Check if it's actively maintained
npm info <package-name> time.modified
```

**API Method Verification:**
```typescript
// If Claude suggests a method you're unsure about:
// 1. Check the actual type definitions
// 2. Look in node_modules/@types/<package>/index.d.ts
// 3. Or ask: "Show me the documentation link for this method"
```

**When code doesn't compile with "method does not exist":**
1. First check: Is this method actually in the library's type definitions?
2. Check the installed version: `npm list <package>`
3. Ask Claude: "What version of this package are you assuming? I have version X.Y.Z installed."

**Red Flags (likely hallucination):**
- Method names that sound perfect but aren't in autocomplete
- Package names with very few Google results
- APIs that seem too convenient to be true
- Version-specific features without version mention

## 10. Context Management for Long Sessions

Claude has context window limits. Long conversations will lose earlier context.

**Session Checkpointing:**

After completing each major milestone, update `PROGRESS.md`:
- What was completed
- Current state and last working commit
- Key decisions made
- What's next

**Starting a New Session:**
```
Continuing photography platform development.

Current state: See PROGRESS.md
Today's focus: [TASK]

Please read these before we begin:
- docs/[RELEVANT].md

Let me know when you've reviewed them.
```

**Context Efficiency Tips:**
- Reference files by path instead of pasting content
- Use "See src/lib/stripe/checkout.ts" not [paste 200 lines]
- Keep one feature per session when possible
- Summarize previous work instead of re-explaining

**Signs You Need a Context Reset:**
- Claude forgets earlier decisions in the conversation
- Claude suggests patterns you already rejected
- Responses become less specific to your codebase
- Claude asks about things already discussed
