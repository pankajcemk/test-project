# CLAUDE.md

Guidance for Claude when working in the **Nightbite Eats** codebase.

## Quick Commands

- `npm run dev` — Start Vite development server with HMR
- `npm run build` — Production build (use for fast syntax/bundle/type verification)
- `npm run preview` — Serve production build locally
- `npm run lint` — Run `oxlint` (configured via `.oxlintrc.json`)

## Project Architecture

Client-only React 19 + Vite single-page application (late-night food ordering demo). No backend server; all state resides in client memory and contexts.

### 1. State Management (`src/context/`)
- **`CartContext.jsx`** (`useReducer`): Manages cart `items` and current `order`.
  - Actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QTY`, `CHECKOUT` (assigns `ORD-####` ID and status `'PLACED'`), `ADVANCE_STATUS`.
  - Export: `useCart()` hook.
- **`ThemeContext.jsx`**: Manages `'light'` / `'dark'` theme and syncs with `localStorage.theme`.
  - Anti-FOUC: Blocking inline `<script>` in `index.html` sets `<html class="dark">` before React mounts. `ThemeProvider.getInitialTheme()` reads this initial state directly from DOM.
  - Export: `useTheme()` hook.

### 2. Routing & Navigation (`App.jsx`)
- Uses `react-router-dom`:
  - `/` → `MenuPage`
  - `/track` → `OrderTrackingPage`
- Persistent layout elements (`NavBar`, `CartDrawer`) render outside `<Routes>`.

### 3. Order Lifecycle Simulation
- **`src/utils/orderSimulator.js`**: `STATUS_STEPS` (`PLACED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`) and `useOrderAutoAdvance` simulation hook.

### 4. Menu & Static Data
- **`src/data/menu.js`**: Static `CATEGORIES` and `MENU_ITEMS`.

### 5. Styling & Design Conventions (Tailwind CSS v4)
- **Dark Mode**: Explicitly declared via `@custom-variant dark (&:where(.dark, .dark *));` in `src/index.css`.
- **Color Tokens**: Custom palettes defined in `@theme` block (`midnight-950..600`, `ember-400..600`).
- **Pairing Rule**: Always pair light default utility with `dark:` variant (e.g., `bg-stone-50 dark:bg-midnight-950`, `text-amber-700 dark:text-ember-400`).
- **Contrast Rule**: Use `text-amber-700` in light mode for readable text contrast, rather than low-contrast amber shades on light surfaces.

## Agent & Skill Tools in `.claude/`

- **Skills**:
  - `pr-review`: Frontend & UI code review with security, a11y, and performance checks ([`SKILL.md`](.claude/skills/pr-review/SKILL.md), [`reference.md`](.claude/skills/pr-review/reference.md), [`check.sh`](.claude/skills/pr-review/check.sh)).
  - `verify`: Automated pre-commit lint and build checks ([`SKILL.md`](.claude/skills/verify/SKILL.md)).
  - `commit-message`: Conventional commits generator ([`SKILL.md`](.claude/skills/commit-message/SKILL.md)).
- **Agents**:
  - `pr-agent`: Dedicated PR reviewer and description generator ([`AGENT.md`](.claude/agents/pr-agent/AGENT.md)).
- **Hooks**:
  - `Stop`: Automatically validates builds and linting via [`.claude/hooks/verify-stop.mjs`](.claude/hooks/verify-stop.mjs) upon task completion.
