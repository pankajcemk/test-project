---
name: commit-message
description: Generate concise, conventional git commit messages following project standards. Use when preparing to commit changes or asking for a commit message.
---

# Commit Message Generator

Generate standard Conventional Commits messages based on staged or unstaged changes.

## Format

```
<type>(<scope>): <short summary in imperative mood>

[optional body explaining motivation and context]

[optional footer(s) like BREAKING CHANGE or issue refs]
```

## Types
- `feat`: A new user-facing feature or capability
- `fix`: A bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Formatting, CSS/UI styling tweaks with no logic changes
- `perf`: Code changes that improve performance
- `chore`: Build scripts, dependencies, tooling, or config updates
- `docs`: Documentation changes

## Guidelines
1. Keep the first line under 72 characters.
2. Use imperative present tense: "add" not "added" or "adds".
3. Reference relevant components or contexts in scope, e.g. `feat(cart)`, `style(theme)`.
