---
name: verify
description: Run automated and manual verification checks on UI code changes before committing or creating PRs. Executes linter (oxlint), build verification (vite build), git status checks, and browser inspection guidelines. Use when the user asks to verify, test, validate, or check changes before finishing a task.
---

# UI Code & Build Verification

Follow this step-by-step workflow to verify that UI code changes are syntactically correct, pass linting, build cleanly without bundle errors, and meet quality standards.

## Step 1: Code Quality & Lint Verification

1. Run the project linter using `execute_command`:
   ```bash
   npm run lint
   ```
2. If any lint errors or warnings are returned:
   - Identify the affected files and lines.
   - Fix the issues directly before proceeding.

## Step 2: Build & Type Verification

1. Run the production build pipeline to ensure modules resolve correctly and no syntax/packaging issues exist:
   ```bash
   npm run build
   ```
2. Check for:
   - Build failures or unresolvable imports.
   - CSS/Tailwind compilation warnings.
   - Heavy chunk warnings or bundle size issues.
3. If the build fails, diagnose and resolve the compilation issue.

## Step 3: Git Status & Unintended Changes Audit

1. Inspect modified and untracked files:
   ```bash
   git status --short
   ```
2. Review the diff of all staged and unstaged modifications:
   ```bash
   git diff
   ```
3. Verify:
   - No leftover debug statements (`console.log`, `debugger`, temporary test code).
   - No sensitive data, API keys, or `.env` files staged accidentally.
   - No temporary or build artifact files untracked that should be in `.gitignore`.

## Step 4: UI & Accessibility Sanity Check

Perform a quick sanity check across the touched UI files:
- **Component Rendering**: Ensure no missing keys in lists (`key={item.id}`).
- **Hooks & State**: Check that hook dependencies and lifecycle cleanups are complete.
- **Accessibility**: Ensure interactive elements use semantic HTML and have visible focus states.

## Step 5: Report Verification Results

Summarize the verification results clearly:
- **Linting**: Passed (oxlint)
- **Build**: Passed (Vite production build)
- **Git Status**: Clean / Files ready for commit or review
- **Any Action Items**: List remaining manual tests (e.g., verifying in a live browser session) if applicable.
