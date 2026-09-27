---
name: pr-review
description: Comprehensive UI and frontend code review workflow. Automatically audits diffs for client security risks (XSS, auth bypass, secret leaks), performance bottlenecks (re-renders, memory leaks, bundle bloat), accessibility (WCAG/a11y), state management, and edge cases. Use when reviewing PRs, git diffs, components, or UI branches.
---

# UI & Frontend Pull Request Review

Follow this procedural workflow to conduct a structured, high-signal code review. Detailed checklists, code patterns, and mitigation guides are in [reference.md](reference.md).

## Step 1: Automated Pre-Check & Diff Identification

1. **Run Pre-Checks**:
   Execute `bash .claude/skills/pr-review/check.sh [TARGET_BRANCH] [BASE_BRANCH]` via `execute_command` to immediately identify automated security violations (XSS, tabnabbing, leaked tokens, uncleaned intervals/listeners, non-semantic clickables).
2. **Collect Modified UI Files**:
   Identify all modified components, hooks, styles, state stores, and configs using `git diff --name-only` or file tools (`read_file`, `grep`).
3. **Understand Context**:
   Determine the feature intent, user flow, and scope of changes before diving into line-by-line review.

## Step 2: Multi-Vector Deep Audit

Evaluate changes across four core dimensions (consult [reference.md](reference.md) for detailed patterns):

1. **Security & Data Safety**:
   - Injection & XSS: `dangerouslySetInnerHTML`, `v-html`, dynamic `javascript:` URLs, unescaped user inputs.
   - External Links: Missing `rel="noopener noreferrer"` on `target="_blank"`.
   - Client Secrets: Hardcoded API keys, private tokens, or sensitive user data in client storage (`localStorage`/`sessionStorage`).
   - Authorization: Client-side routing guards accompanied by server-side verification assumptions.

2. **Performance & Lifecycle**:
   - Re-renders: Inline functions/objects passed to memoized children, broken `useMemo`/`useCallback` dependencies.
   - Resource Leaks: Uncleaned `addEventListener`, `setInterval`, WebSocket subscriptions, or uncancelled `fetch` requests (`AbortController`).
   - Bundle Impact: Bulky imports (e.g., non-tree-shaken packages), missing lazy loading for heavy modals/routes.

3. **Accessibility (a11y) & UX**:
   - Semantic Markup: Native interactive elements (`<button>`, `<a>`) over `onClick` on `<div>`/`<span>`.
   - Keyboard & Focus: Visible focus states, focus trapping in modals/dialogs, correct tab orders.
   - ARIA: Correct usage of `aria-label`, `aria-expanded`, `aria-live` for dynamic states.
   - States & Resilience: Loading skeletons, empty states, error boundaries, and network drop recovery.

4. **Architecture & Clean Code**:
   - State Colocation: Local state kept near consuming components rather than over-elevated.
   - Test Coverage: Unit/integration tests covering core user interactions and boundary conditions.

## Step 3: Format and Present the Review Report

Deliver structured, actionable feedback using this standardized template:

### 1. Summary & Recommendation
- **Verdict**: `[APPROVE]`, `[REQUEST CHANGES]`, or `[COMMENT]`
- **Overview**: 2–3 sentence assessment of the change and overall impact.

### 2. Critical & Security Issues (Blockers)
*Issues that compromise security, crash the application, or introduce major bugs.*
- **Location**: `path/to/file.ext:line`
- **Issue**: Precise description of the vulnerability or flaw.
- **Impact**: Real-world exploit scenario or failure mode.
- **Suggested Fix**:
  ```diff
  - // Vulnerable code
  + // Secure, optimized fix
  ```

### 3. Performance & Accessibility Warnings
*Non-blocking but important optimizations (excessive renders, memory leaks, missing ARIA tags, bundle bloat).*
- **Location**: `path/to/file.ext:line`
- **Observation & Recommendation**: Concise explanation and fix.

### 4. Code Quality & UX Polish (Nitpicks)
- Minor styling, naming conventions, code deduplication, or documentation suggestions.

### 5. Highlights
- Note well-architected components, thorough test cases, or clean patterns found in the diff.
