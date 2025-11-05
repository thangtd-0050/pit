# Implementation Plan: Vietnam Gross-to-Net Salary Calculator

**Branch**: `001-gross-net-calculator` | **Date**: 2025-11-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-gross-net-calculator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a modern, client-side web application that calculates Vietnam net salary from gross salary with full insurance (BHXH, BHYT, BHTN) and progressive income tax (PIT) breakdown. The calculator supports side-by-side comparison between 2025 and 2026 tax regimes, showing delta highlights. All calculations run entirely in the browser with no backend required. Users can share results via URL, copy formatted explanations, and customize the viewing experience (number format, dark mode). The application emphasizes accuracy, transparency, and accessibility while maintaining fast performance (<200KB bundle) and offline capability.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode enabled)
**Primary Dependencies**:
- React 18.2+ (UI framework)
- Vite 5.0+ (build tool and dev server)
- Tailwind CSS 3.4+ (utility-first styling)
- shadcn/ui (Radix UI-based accessible component library)
- Zustand 4.4+ (lightweight state management)
- lucide-react (icon library)
- Vitest 1.0+ (unit testing framework)
- Testing Library (component testing)

**Storage**: Browser localStorage only (user preferences: locale format, dark mode, detail visibility)
**Testing**: Vitest + Testing Library for unit tests (calculation logic) and component smoke tests
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), deployed to GitHub Pages as static site
**Project Type**: Web (single-page application, client-side only, no backend)
**Performance Goals**:
- First Contentful Paint <1.5s
- Instant recalculation on input change (<100ms)
- Bundle size <200KB gzipped
- Unit tests complete in <5s

**Constraints**:
- 100% client-side execution (no server calls for calculations)
- Offline-capable after initial load (optional PWA)
- WCAG 2.1 Level AA accessibility compliance
- Mobile-first responsive design (320px - 1920px+ viewports)
- All UI text must be in Vietnamese language
- Number formatting supports both en-US and vi-VN locales

**Scale/Scope**:
- Single-page application with 4-5 main UI components
- ~10 calculation functions (pure, deterministic)
- 5 user stories prioritized for incremental delivery
- Target audience: Vietnamese employees and HR professionals
- No user authentication or backend API required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality Excellence ✅
- **TypeScript strict mode** enforced for type safety
- **ESLint + Prettier** configured for code standards
- Calculation logic separated into pure functions (constants.ts, tax.ts, format.ts)
- All functions will have explicit type annotations
- No magic numbers: all constants centralized in constants.ts

### II. Testing-First Discipline (NON-NEGOTIABLE) ✅
- **TDD approach**: Unit tests for all calculation functions MUST be written first
- Test coverage target: ≥80% for calculation logic
- Tests will cover:
  - Insurance base clamping (floors/caps for all 4 regions)
  - Progressive tax calculation (edge cases at bracket thresholds)
  - Regression tests with known correct values (10M, 30M, 60M, 100M, 185M scenarios)
  - Number formatting and rounding
  - Component smoke tests for UI
- Tests run in <5s (Vitest is fast)

### III. Modern UI/UX Consistency ✅
- **shadcn/ui components** provide accessible, consistent design patterns
- Mobile-first responsive design (320px to 1920px+)
- **WCAG 2.1 Level AA** compliance required
- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Loading states for operations >300ms (not applicable - instant calculations)
- Dark mode support with system preference detection
- Visual feedback on all interactive elements (hover, focus states)

### IV. Performance-By-Design ✅
- **Bundle size <200KB gzipped** (monitored in build process)
- Code splitting for optimal loading
- Calculations optimized (O(n) where n = number of tax brackets ~5-7)
- Debounced input handlers to prevent excessive recalculations
- No network requests after initial load (offline-capable)
- Memoization for expensive formatting operations (Intl.NumberFormat instances)

### V. Security & Privacy Foundation ✅
- **No data leaves browser** (100% client-side calculations)
- No analytics or tracking by default (privacy-first)
- Input sanitization for numeric fields (prevent XSS in edge cases)
- No sensitive data stored (only UI preferences in localStorage)
- No authentication/authorization needed
- GitHub Pages serves over HTTPS (TLS 1.3)

### VI. Maintainability & Technical Debt Management ✅
- **Semantic versioning** for application releases
- Legal constants centralized in constants.ts for easy yearly updates
- Clear separation: presentation (components) vs logic (lib) vs configuration (constants)
- TypeScript provides compile-time type safety
- ESLint catches potential issues early
- No technical debt tracking needed (greenfield project)
- PWA manifest for future offline enhancement (optional)

### VII. Documentation & Knowledge Sharing ✅
- **README.md** with setup instructions and architecture overview
- **quickstart.md** for development workflow
- **Inline comments** for complex calculation logic (e.g., progressive tax slabs)
- All Vietnamese terminology documented (BHXH, BHYT, BHTN, etc.)
- User-facing help text in Vietnamese explaining formulas
- OpenAPI-style documentation for calculation interfaces (TypeScript types serve as contract)

**Gate Status**: ✅ **PASSED** - All constitutional principles satisfied. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions for GitHub Pages deployment
├── public/
│   ├── favicon.ico
│   └── manifest.json           # PWA manifest (optional)
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   │   ├── card.tsx
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── label.tsx
│   │   │   ├── switch.tsx
│   │   │   └── tooltip.tsx
│   │   ├── GrossInputCard.tsx  # Input form (gross, deps, region, insurance mode)
│   │   ├── RegimeResultCard.tsx # Results display (NET, breakdown, copy/share)
│   │   ├── SummaryDeltaCard.tsx # Delta comparison summary
│   │   ├── Footer.tsx          # Disclaimer + last updated
│   │   └── Header.tsx          # Title, regime toggle, dark mode, GitHub link
│   ├── lib/
│   │   ├── constants.ts        # Legal constants (regions, regimes, rates, brackets)
│   │   ├── tax.ts              # Pure calculation functions
│   │   ├── format.ts           # Number formatting utilities
│   │   ├── url-state.ts        # URL query parameter encoding/decoding
│   │   └── utils.ts            # Shared utility functions (cn, etc.)
│   ├── hooks/
│   │   └── useCalculator.ts    # Custom hook for calculator state & logic
│   ├── store/
│   │   └── preferences.ts      # Zustand store for UI preferences
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── styles/
│   │   └── globals.css         # Tailwind base + custom styles
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # React entry point
│   └── vite-env.d.ts           # Vite type declarations
├── tests/
│   ├── unit/
│   │   ├── tax.test.ts         # Calculation logic tests
│   │   ├── constants.test.ts   # Constants validation
│   │   ├── format.test.ts      # Formatting tests
│   │   └── url-state.test.ts   # URL state tests
│   └── components/
│       └── Calculator.test.tsx  # Component smoke tests
├── index.html                   # Entry HTML
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json                # TypeScript config (strict mode)
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── eslint.config.js             # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── vitest.config.ts             # Vitest test configuration
└── README.md                    # Setup and development instructions
```

**Structure Decision**: Selected **single-page web application** structure (frontend only, no backend). This is a pure client-side React application with clear separation of concerns:

- **`/src/components/`**: React UI components (shadcn/ui + custom components)
- **`/src/lib/`**: Pure business logic (calculations, constants, utilities) - fully testable
- **`/src/hooks/`**: Custom React hooks for state management
- **`/src/store/`**: Zustand store for global preferences (locale, dark mode)
- **`/tests/`**: Comprehensive unit and component tests

This structure aligns with:
- **Code Quality**: Clear separation between presentation and logic
- **Testability**: Pure functions in `/lib/` are easily unit tested
- **Maintainability**: Constants centralized, logic decoupled from UI
- **Scalability**: Component-based architecture allows easy feature additions

## Complexity Tracking

> **No violations** - Constitution check passed. No complexity justifications needed.

---

## Phase Status

### ✅ Phase 0: Research (COMPLETED)
- **Output**: `research.md`
- **Status**: All technology decisions documented
- **Decisions Made**:
  1. Framework: React 18.2+ (component-based architecture, mature ecosystem)
  2. Language: TypeScript 5.3+ strict mode (type safety, maintainability)
  3. Build Tool: Vite 5.0+ (fast dev server, optimized builds)
  4. Styling: Tailwind CSS 3.4+ (utility-first, fast development)
  5. Component Library: shadcn/ui (accessible, customizable, zero runtime overhead)
  6. State Management: Zustand 4.4+ (lightweight, simple API)
  7. Testing: Vitest 1.0+ + Testing Library (fast, Vite-native)
  8. Icons: lucide-react (tree-shakeable, consistent)
  9. Deployment: GitHub Pages + GitHub Actions (free, automatic)
  10. Package Manager: pnpm 8+ (fast, disk-efficient)
  11. Code Quality: ESLint + Prettier (automated formatting, linting)

### ✅ Phase 1: Design & Contracts (COMPLETED)
- **Outputs**:
  - ✅ `data-model.md` — All TypeScript interfaces defined (20+ entities)
  - ✅ `contracts/calculation-api.md` — Pure function signatures (11 calculation functions)
  - ✅ `contracts/component-api.md` — React component props (20 components)
  - ✅ `quickstart.md` — Development setup guide (<5 min setup)
  - ✅ Agent context updated (`.github/copilot-instructions.md`)
- **Status**: Design phase complete, all contracts documented

### ⏳ Phase 2: Task Breakdown (PENDING)
- **Output**: `tasks.md` (generated by `/speckit.tasks` command)
- **Status**: NOT STARTED
- **Note**: This phase is NOT part of the `/speckit.plan` command. Run `/speckit.tasks` separately to generate task breakdown.

---

## Next Steps

### 1. Re-validate Constitution Check ✅
After completing Phase 1 design, re-check all 7 constitutional principles:
- ✅ I. Code Quality Excellence — TypeScript strict mode, pure functions, no magic numbers
- ✅ II. Testing-First Discipline — TDD approach, ≥80% coverage target
- ✅ III. Modern UI/UX Consistency — shadcn/ui, WCAG AA, mobile-first
- ✅ IV. Performance-By-Design — <200KB bundle, instant calculations
- ✅ V. Security & Privacy — Client-side only, no tracking
- ✅ VI. Maintainability — Semantic versioning, clear separation of concerns
- ✅ VII. Documentation — README, quickstart, inline comments, help text

**Result**: ✅ **PASSED** - All principles satisfied post-design. No violations.

### 2. Generate Task Breakdown (Manual Step)
Run the following command to generate `tasks.md`:
```bash
/speckit.tasks 001-gross-net-calculator
```

This will:
- Parse functional requirements from `spec.md`
- Break down into atomic tasks (1-4 hour estimates)
- Prioritize based on user story priorities (P1-P5)
- Generate dependency graph
- Output to `specs/001-gross-net-calculator/tasks.md`

### 3. Begin Implementation (After tasks.md)
Follow this sequence:
1. **Setup** — Initialize project structure, install dependencies
2. **Core Logic** — Implement calculation functions (TDD approach)
3. **UI Components** — Build React components (refer to contracts)
4. **Integration** — Connect UI to logic, test end-to-end
5. **Polish** — Accessibility, performance, documentation
6. **Deploy** — GitHub Actions to GitHub Pages

---

## Generated Artifacts

### Planning Phase Outputs

| File | Status | Description |
|------|--------|-------------|
| `plan.md` | ✅ Complete | This file — implementation plan summary |
| `research.md` | ✅ Complete | Technology research and decisions (11 choices) |
| `data-model.md` | ✅ Complete | TypeScript interfaces (20+ entities) |
| `contracts/calculation-api.md` | ✅ Complete | Pure function signatures (11 functions) |
| `contracts/component-api.md` | ✅ Complete | React component props (20 components) |
| `quickstart.md` | ✅ Complete | Development setup guide (5 min quickstart) |
| `.github/copilot-instructions.md` | ✅ Updated | AI agent context with tech stack |
| `tasks.md` | ⏳ Pending | Task breakdown (requires `/speckit.tasks` command) |

### Key Decisions Made

**Architecture**: Single-page React application (client-side only)
**State Strategy**: React hooks for local state, Zustand for global preferences
**Calculation Approach**: Pure functions, progressive tax logic, clamped insurance bases
**UI Framework**: shadcn/ui (Radix UI) for accessibility and consistency
**Testing Strategy**: TDD with Vitest, ≥80% coverage target
**Deployment**: GitHub Pages via GitHub Actions (automatic on push)
**Language**: Vietnamese (primary), i18n-ready structure for future expansion

---

## Summary

✅ **Implementation plan complete**
✅ **All technology decisions documented**
✅ **Data model defined (20+ TypeScript interfaces)**
✅ **API contracts specified (11 functions, 20 components)**
✅ **Quickstart guide created (5-minute setup)**
✅ **Agent context updated**
✅ **Constitution check passed (all 7 principles satisfied)**

**Ready for**: Task breakdown via `/speckit.tasks` command

**Branch**: `001-gross-net-calculator`
**Spec Path**: `specs/001-gross-net-calculator/spec.md`
**Plan Path**: `specs/001-gross-net-calculator/plan.md`
**Research Path**: `specs/001-gross-net-calculator/research.md`
**Data Model Path**: `specs/001-gross-net-calculator/data-model.md`
**Contracts Path**: `specs/001-gross-net-calculator/contracts/`
**Quickstart Path**: `specs/001-gross-net-calculator/quickstart.md`

---

**Plan completed**: 2025-11-05
**Next command**: `/speckit.tasks 001-gross-net-calculator`
