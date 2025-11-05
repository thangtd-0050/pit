# Research: Vietnam Gross-to-Net Salary Calculator

**Feature**: 001-gross-net-calculator
**Created**: 2025-11-05
**Phase**: 0 (Research & Technology Decisions)

## Overview

This document consolidates research findings and technology decisions for building a client-side Vietnam salary calculator web application. All technical context items from the implementation plan have been evaluated and decisions documented below.

---

## 1. Framework Selection: React + TypeScript + Vite

### Decision
Use **React 18.2+** with **TypeScript 5.3+** (strict mode) and **Vite 5.0+** as the build tool.

### Rationale
- **React**: Industry-standard UI framework with excellent ecosystem, component reusability, and performance
- **TypeScript strict mode**: Provides compile-time type safety, catches bugs early, and serves as self-documenting code (aligns with Constitution Principle I: Code Quality Excellence)
- **Vite**: Modern build tool with lightning-fast HMR (Hot Module Replacement), optimized production builds, and excellent TypeScript support out of the box
- **Bundle size**: Vite's tree-shaking and code-splitting capabilities help achieve <200KB gzipped target

### Alternatives Considered
- **Vue.js**: Excellent framework but React has larger Vietnamese developer community and better shadcn/ui integration
- **Svelte**: Smaller bundle sizes but less mature ecosystem for component libraries
- **Next.js**: Overkill for this project (no SSR/SSG needed, pure client-side), adds unnecessary complexity
- **Webpack**: Slower than Vite, more configuration required

### Best Practices
- Use functional components with hooks
- Implement custom hooks for business logic separation (useCalculator)
- Leverage React.memo for expensive components
- Use React.useMemo for derived calculations
- Debounce input handlers to prevent excessive re-renders

---

## 2. Styling: Tailwind CSS + shadcn/ui

### Decision
Use **Tailwind CSS 3.4+** with **shadcn/ui** component library (Radix UI-based).

### Rationale
- **Tailwind CSS**: Utility-first approach enables rapid development, excellent tree-shaking (unused styles removed), consistent design system
- **shadcn/ui**: Provides accessible (WCAG 2.1 AA compliant), customizable components built on Radix UI primitives
- **Radix UI**: Unstyled, accessible component primitives that handle complex interactions (keyboard navigation, screen reader support, focus management)
- **Dark mode**: Tailwind's built-in dark mode with class strategy perfectly suits our needs
- **Bundle size**: Tailwind's JIT (Just-In-Time) compiler generates only used utilities

### Alternatives Considered
- **Material-UI (MUI)**: Heavier bundle size (~100KB+), opinionated design, harder to customize
- **Ant Design**: Large bundle size, Chinese-centric design patterns
- **Chakra UI**: Good accessibility but larger bundle than shadcn/ui
- **Plain CSS Modules**: More control but requires building accessibility features from scratch

### Best Practices
- Use Tailwind's responsive design utilities (mobile-first: sm:, md:, lg:)
- Leverage Tailwind's dark: variant for dark mode
- Customize theme in tailwind.config.js for consistent spacing/colors
- Use shadcn/ui CLI to add only needed components (reduces bundle size)
- Implement focus-visible states for keyboard navigation

---

## 3. State Management: Local State + Zustand

### Decision
Use **React local state** (useState, useReducer) for calculator logic and **Zustand 4.4+** for global UI preferences.

### Rationale
- **Local state**: Calculator inputs and results are component-local, no need for global state
- **Zustand**: Lightweight (1KB), simple API for global preferences (locale format, dark mode, detail visibility)
- **localStorage persistence**: Zustand middleware for persisting preferences across sessions
- **No prop drilling**: Zustand avoids passing preferences through component tree

### Alternatives Considered
- **Redux**: Overkill for this simple application, adds ~10KB+ to bundle, steep learning curve
- **Context API**: Works but more boilerplate than Zustand, no built-in persistence middleware
- **Jotai/Recoil**: Atomic state management is unnecessary for our use case
- **No state management**: Would require prop drilling or Context API anyway

### Best Practices
- Keep calculator state local to main component (useState or custom hook)
- Use Zustand only for cross-cutting concerns (preferences)
- Implement localStorage persistence with Zustand's persist middleware
- Use TypeScript for type-safe state management

---

## 4. Testing Strategy: Vitest + Testing Library

### Decision
Use **Vitest 1.0+** for unit tests and **Testing Library** for component tests.

### Rationale
- **Vitest**: Blazingly fast, Vite-native, compatible with Jest API, instant test re-runs during development
- **Testing Library**: Encourages testing behavior over implementation, accessibility-focused queries
- **TDD approach**: Write tests first for all calculation functions (Constitution Principle II)
- **Target ≥80% coverage**: Focus on calculation logic and critical user paths

### Test Categories
1. **Unit Tests** (pure functions in /lib/):
   - Insurance base clamping (all 4 regions × floor/cap scenarios)
   - Progressive tax calculation (edge cases at bracket thresholds: 5M, 10M, 18M, 32M, 52M, 80M for 2025; 10M, 30M, 60M, 100M for 2026)
   - Number formatting (en-US vs vi-VN locales)
   - URL state encoding/decoding
   - Regression tests with known values (10M, 30M, 60M, 100M, 185M gross; 2 dependents; Region I)

2. **Component Tests**:
   - Smoke tests (components render without crashing)
   - Input sanitization (commas, underscores, spaces)
   - Calculation triggers on input change
   - Copy/share functionality

### Alternatives Considered
- **Jest**: Industry standard but slower than Vitest, requires additional configuration for ESM
- **Cypress/Playwright**: E2E testing is overkill for this project (no backend, simple flow)

### Best Practices
- Write tests in TDD fashion (Red-Green-Refactor)
- Use describe/it blocks for clear test organization
- Test edge cases exhaustively for calculation functions
- Use Testing Library's user-centric queries (getByRole, getByLabelText)
- Run tests in watch mode during development

---

## 5. Deployment: GitHub Pages + GitHub Actions

### Decision
Deploy to **GitHub Pages** using **GitHub Actions** workflow triggered on push to main branch.

### Rationale
- **GitHub Pages**: Free static site hosting, HTTPS by default, perfect for client-side applications
- **GitHub Actions**: Free CI/CD for public repos, integrates seamlessly with GitHub Pages
- **Vite build**: Generates optimized static assets in /dist directory
- **No server required**: Pure client-side application needs only static hosting

### Deployment Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Alternatives Considered
- **Vercel/Netlify**: Great platforms but unnecessary for this simple use case
- **AWS S3 + CloudFront**: More complex setup, potential costs
- **Self-hosted**: Requires server maintenance, overkill for static site

### Best Practices
- Run tests in CI before deploying
- Set base path in vite.config.ts for GitHub Pages subdirectory
- Use pnpm for faster installs in CI
- Configure custom domain (optional)

---

## 6. Package Manager: pnpm

### Decision
Use **pnpm 8+** as the package manager.

### Rationale
- **Disk efficiency**: Content-addressable storage, shared dependencies across projects
- **Speed**: Faster than npm/yarn due to efficient linking
- **Strict**: Prevents phantom dependencies (only declared dependencies accessible)
- **Lockfile**: pnpm-lock.yaml ensures deterministic installs

### Alternatives Considered
- **npm**: Slower, more disk space, comes with Node.js
- **yarn**: Faster than npm but slower than pnpm, larger disk footprint
- **bun**: Very fast but still maturing, less ecosystem support

### Best Practices
- Use `pnpm install --frozen-lockfile` in CI
- Add `node_modules/` to .gitignore
- Commit pnpm-lock.yaml for reproducible builds

---

## 7. Code Quality Tools: ESLint + Prettier

### Decision
Use **ESLint** with TypeScript plugin and **Prettier** for code formatting.

### Rationale
- **ESLint**: Catches potential bugs, enforces best practices, TypeScript-aware
- **Prettier**: Opinionated formatter, eliminates style debates, ensures consistency
- **Integration**: ESLint and Prettier work together (eslint-config-prettier)
- **Constitution alignment**: Enforces Code Quality Excellence principle

### Configuration
- **ESLint**: Extend `@typescript-eslint/recommended`, enable strict rules
- **Prettier**: Single quotes, trailing commas, 100-character line width
- **Pre-commit hook**: Format and lint on commit (optional: husky + lint-staged)

### Best Practices
- Run linter in watch mode during development
- Fix lint errors before committing
- Use Prettier extension in VSCode for format-on-save
- Add lint/format scripts to package.json

---

## 8. Accessibility: WCAG 2.1 Level AA Compliance

### Decision
Ensure **WCAG 2.1 Level AA** compliance throughout the application.

### Rationale
- **Constitution Principle III**: Modern UI/UX Consistency requires accessibility
- **shadcn/ui**: Built on Radix UI, provides accessible primitives out of the box
- **Vietnamese users**: Screen reader support benefits all users

### Implementation Strategy
1. **Semantic HTML**: Use appropriate elements (button, input, label, etc.)
2. **ARIA labels**: Add aria-label, aria-labelledby, aria-describedby where needed
3. **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus management**: Visible focus indicators, logical tab order
5. **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text (Tailwind colors meet this)
6. **Screen reader announcements**: Use aria-live for dynamic content (calculation results)
7. **Form labels**: All inputs have associated labels

### Testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Lighthouse accessibility audit (target: 100 score)
- axe DevTools browser extension

---

## 9. Internationalization: Vietnamese First

### Decision
Build with **Vietnamese as the primary and only language** for initial version. Prepare architecture for future i18n.

### Rationale
- **Target audience**: Vietnamese employees and HR professionals
- **Simplicity**: Single language reduces complexity for v1
- **Future-ready**: String externalization makes adding i18next trivial later

### Implementation
- All UI strings in Vietnamese (labels, buttons, error messages, tooltips)
- Vietnamese terminology for domain concepts (BHXH, BHYT, BHTN, Thuế TNCN, Giảm trừ gia cảnh)
- Number formatting supports both en-US (1,234,567) and vi-VN (1.234.567) via Intl.NumberFormat
- No hardcoded strings in components (prepare for extraction)

### Future i18n (out of scope for v1)
- Use i18next for English translation
- Extract strings to JSON files (vi.json, en.json)
- Add language switcher in header

---

## 10. Performance Optimization Techniques

### Decision
Implement multiple performance optimizations to achieve <200KB bundle and <1.5s FCP.

### Strategies
1. **Code Splitting**: Vite automatically splits vendor code
2. **Tree Shaking**: Import only needed utilities from libraries
3. **Lazy Loading**: shadcn/ui components on-demand
4. **Memoization**: Cache Intl.NumberFormat instances
5. **Debouncing**: Input handlers debounced to 300ms
6. **Minification**: Vite minifies JS/CSS in production
7. **Compression**: Enable gzip/brotli compression on GitHub Pages

### Monitoring
- Lighthouse performance audit (target: >90 score)
- Bundle analyzer to identify large dependencies
- Monitor bundle size in CI (fail if >200KB gzipped)

---

## 11. Progressive Web App (PWA) - Optional Enhancement

### Decision
**Optional**: Add basic PWA support (service worker + manifest) for offline capability.

### Rationale
- **Offline-first**: Calculator works without network after initial load
- **Installation**: Users can install as standalone app
- **Low effort**: Vite PWA plugin automates most setup

### Implementation (if added)
- Use vite-plugin-pwa
- Cache calculation logic and static assets
- Add manifest.json with app metadata
- Register service worker in main.tsx

### Deferred to Post-MVP
- Not critical for initial release
- Can be added incrementally without breaking changes

---

## Summary of Key Decisions

| Aspect | Technology | Rationale |
|--------|-----------|-----------|
| Framework | React 18.2+ + TypeScript 5.3+ | Industry standard, excellent ecosystem, type safety |
| Build Tool | Vite 5.0+ | Fast HMR, optimized builds, <200KB target achievable |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, accessible components, tree-shakeable |
| State Management | Local state + Zustand 4.4+ | Lightweight, only for preferences, localStorage persistence |
| Testing | Vitest + Testing Library | Fast, Vite-native, behavior-focused testing |
| Deployment | GitHub Pages + Actions | Free, HTTPS, CI/CD integrated |
| Package Manager | pnpm 8+ | Fast, disk-efficient, strict dependency management |
| Code Quality | ESLint + Prettier | Enforce standards, consistent formatting |
| Accessibility | WCAG 2.1 Level AA | Constitutional requirement, shadcn/ui support |
| Language | Vietnamese (i18n-ready) | Primary audience, future-proof architecture |

---

## Next Steps (Phase 1)

With all technology decisions finalized, proceed to Phase 1:
1. Generate **data-model.md** (entity definitions)
2. Generate **contracts/** (API interfaces - TypeScript types)
3. Generate **quickstart.md** (development setup guide)
4. Update agent context with technology stack
