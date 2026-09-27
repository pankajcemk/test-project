# PR Review Reference Guide (UI & Frontend)

This document provides detailed checklists, code patterns, and best practices referenced during pull request reviews.

---

## 1. Security & Vulnerability Checklist

### 1.1 Cross-Site Scripting (XSS) & Unsafe HTML Rendering
- **Dangerously Set HTML**:
  - React: `dangerouslySetInnerHTML={{ __html: sanitizedData }}`
  - Vue: `v-html="sanitizedData"`
  - Vanilla: `element.innerHTML`, `element.outerHTML`
  - **Rule**: Avoid unless strictly necessary. If used, ensure input is sanitized with a library like DOMPurify before rendering.
- **Dynamic URLs**:
  - Check `<a href={url}>`, `<iframe src={url}>`, `window.location.href = url`.
  - **Risk**: `javascript:` pseudo-protocol URLs execute arbitrary code.
  - **Fix**: Validate protocol matches `http:`, `https:`, or `mailto:`, or use safe URL parsers.
- **Safe External Links**:
  - Any external link with `target="_blank"` must include `rel="noopener noreferrer"` to prevent tabnabbing and window object tampering.

### 1.2 Secrets & Sensitive Client Storage
- **Hardcoded Secrets**: Ensure no API private keys, signing secrets, tokens, or private credentials are in client bundles.
- **Storage**:
  - `localStorage` and `sessionStorage` are accessible via JavaScript and vulnerable to XSS.
  - Do not store unencrypted sensitive tokens/credentials in client web storage. Prefer `HttpOnly`, `Secure`, `SameSite` cookies when possible.

---

## 2. UI Performance & Lifecycle Checklist

### 2.1 Re-rendering & Hook Dependencies
- **Unstable References**:
  - Passing inline object/array literals or inline arrow functions into memoized children (`React.memo`) breaks memoization.
  - Use `useCallback` for functions and `useMemo` for heavy computations or reference-stable objects.
- **Hook Dependency Arrays**:
  - Verify `useEffect`, `useCallback`, and `useMemo` dependency lists are complete.
  - Avoid primitive values triggering infinite render loops (e.g., setting state unconditionally inside `useEffect`).

### 2.2 Cleanup & Memory Leak Prevention
- Always return a cleanup function in `useEffect` for:
  - Event listeners: `window.addEventListener` / `removeEventListener`
  - Timers: `setInterval` / `clearInterval`, `setTimeout` / `clearTimeout`
  - Subscriptions: WebSockets, Observables, event emitters
  - Async requests: Use `AbortController` to cancel pending fetch requests on unmount.

### 2.3 Asset & Bundle Optimization
- **Code Splitting**: Route-level and heavy component code-splitting using `React.lazy()` and `Suspense`.
- **Tree-shaking**: Use specific imports (e.g., `import debounce from 'lodash/debounce'` or `lodash-es` instead of `import { debounce } from 'lodash'`).

---

## 3. Accessibility (a11y) & Semantic HTML

### 3.1 Semantic HTML
- Use native elements (`<button>`, `<a href="...">`, `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`) instead of clickable `<div>` or `<span>`.
- Only use `role="button"` on non-button elements if accompanied by `tabIndex={0}` and keyboard event listeners (`keydown` for Enter and Space).

### 3.2 Keyboard Navigation & Focus Management
- Interactive elements must be focusable and operable via keyboard.
- Modals, drawers, and dialogs must trap focus while open and restore focus to trigger element upon closing.
- Visible focus rings (`:focus-visible`) must not be removed (`outline: none` without replacement).

### 3.3 ARIA & Form Controls
- Form controls must have associated `<label htmlFor="...">` elements or `aria-label` / `aria-labelledby`.
- Dynamic status/loading updates should announce to screen readers using `aria-live="polite"` or `role="status"`.
- Expandable sections (accordions, dropdowns) must use `aria-expanded="true|false"` and `aria-controls`.

---

## 4. State Management & Component Architecture

- **State Colocation**: Keep state local to the components that need it. Avoid global state stores (Redux, Zustand, Context) for local UI state (like modal open/closed state).
- **Error Boundaries**: Wrap major UI sections in Error Boundaries to prevent full-app crashes on unhandled render errors.
- **Async UI States**: Ensure all four states of async operations are handled:
  1. *Idle*
  2. *Loading* (skeletons, spinners)
  3. *Success* (content rendered)
  4. *Error / Empty* (actionable feedback and retry buttons)
