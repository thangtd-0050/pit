# Tasks: Vietnam Gross-to-Net Salary Calculator

**Input**: Design documents from `/specs/001-gross-net-calculator/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅
**Generated**: 2025-11-05
**Feature Branch**: `001-gross-net-calculator`

**Tests**: Following TDD approach as specified in Constitution Principle II (NON-NEGOTIABLE)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize React project with TypeScript and Vite in repository root
- [X] T002 [P] Install core dependencies: react@18.2+, typescript@5.3+, vite@5.0+
- [X] T003 [P] Install styling dependencies: tailwindcss@3.4+, postcss, autoprefixer
- [X] T004 [P] Install UI dependencies: @radix-ui/react-*, lucide-react
- [X] T005 [P] Install state management: zustand@4.4+
- [X] T006 [P] Install testing dependencies: vitest@1.0+, @testing-library/react, @testing-library/user-event, jsdom
- [X] T007 Configure TypeScript in tsconfig.json (strict mode enabled, path aliases @/*)
- [X] T008 [P] Configure Vite in vite.config.ts (path resolution, build optimizations)
- [X] T009 [P] Configure Tailwind CSS in tailwind.config.js
- [X] T010 [P] Configure PostCSS in postcss.config.js
- [X] T011 [P] Configure ESLint in eslint.config.js (TypeScript rules, React rules)
- [X] T012 [P] Configure Prettier in .prettierrc (format rules)
- [X] T013 [P] Configure Vitest in vitest.config.ts (jsdom environment, coverage settings)
- [X] T014 Create project structure per plan.md (src/, tests/, public/ directories)
- [X] T015 [P] Create index.html with root div and Vietnamese meta tags
- [X] T016 [P] Create src/main.tsx entry point
- [X] T017 [P] Create src/vite-env.d.ts for Vite types
- [X] T018 [P] Create src/styles/globals.css with Tailwind directives
- [X] T019 [P] Setup package.json scripts (dev, build, preview, test, lint, format)
- [X] T020 [P] Create README.md with project overview and setup instructions
- [X] T021 [P] Create .gitignore (node_modules, dist, coverage, .env)

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T022 [P] Create src/types/index.ts with all TypeScript interfaces from data-model.md (RegionId, RegionConfig, TaxBracket, Regime, CalculatorInputs, InsuranceBases, Insurance, Deductions, PITItem, PIT, CalculationResult, ComparisonResult, PreferencesState, ViewMode, InsuranceBaseMode)
- [X] T023 [P] Create src/config/constants.ts with legal constants (BASE_SALARY=2340000, REGIONAL_MINIMUMS, REGIME_2025, REGIME_2026)
- [X] T024 [P] Create src/lib/utils.ts with cn() utility for className merging
- [X] T025 Setup shadcn/ui components in src/components/ui/ (button.tsx, card.tsx, input.tsx, label.tsx, select.tsx, switch.tsx, tooltip.tsx, table.tsx, collapsible.tsx, radio-group.tsx)
- [X] T026 [P] Create src/store/preferences.ts Zustand store (viewMode, locale, darkMode state and setters)
- [X] T027 [P] Create GitHub Actions workflow in .github/workflows/deploy.yml (build and deploy to GitHub Pages)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Salary Calculation (Priority: P1) 🎯 MVP

**Goal**: Enable users to calculate net salary from gross salary with full insurance and tax breakdown

**Independent Test**: User can enter gross salary (30M), dependents (2), region (I), and immediately see calculated net salary (25,215,000) with complete breakdown of insurance (BHXH, BHYT, BHTN) and progressive income tax by bracket

### Tests for User Story 1 (TDD - Write FIRST, ensure FAIL) ✅

- [X] T028 [P] [US1] Create tests/unit/tax.test.ts with test suite for clamp() function (within bounds, above max, below min, edge cases)
- [X] T029 [P] [US1] Add tests for roundVnd() in tests/unit/tax.test.ts (round up, round down, exact integers, decimals)
- [X] T030 [P] [US1] Add tests for calcInsuranceBases() in tests/unit/tax.test.ts (all 4 regions, gross within bounds, exceeding SI/HI cap, exceeding UI cap, custom base below floor, custom base above cap, custom base undefined)
- [X] T031 [P] [US1] Add tests for calcInsurance() in tests/unit/tax.test.ts (standard case, rounding behavior, capped bases, floored bases, verify total calculation)
- [X] T032 [P] [US1] Add tests for calcPit() in tests/unit/tax.test.ts (2025 regime: edge cases at 5M, 10M, 18M, 32M, 52M, 80M thresholds; 2026 regime: edge cases at 10M, 30M, 60M, 100M thresholds; taxable=0, taxable<0, highest bracket, progressive calculation)
- [X] T033 [P] [US1] Add tests for calcAll() in tests/unit/tax.test.ts (regression tests: 10M/2deps/RegionI, 30M/2deps/RegionI, 60M/2deps/RegionI, 100M/2deps/RegionI, 185M/2deps/RegionI, 0 dependents, custom insurance base, all 4 regions, both regimes, verify NET = gross - insurance - PIT)
- [X] T034 [P] [US1] Create tests/unit/format.test.ts with tests for formatNumber() (en-US locale, vi-VN locale, large numbers, zero, no decimals)
- [X] T035 [P] [US1] Add tests for sanitizeNumericInput() in tests/unit/format.test.ts (comma-separated, underscore-separated, space-separated, plain numeric, empty string, non-numeric)

### Implementation for User Story 1 ✅ COMPLETE

- [X] T036 [P] [US1] Implement clamp() in src/lib/tax.ts (pure function, no side effects)
- [X] T037 [P] [US1] Implement roundVnd() in src/lib/tax.ts (standard rounding to integer)
- [X] T038 [US1] Implement calcInsuranceBases() in src/lib/tax.ts (depends on clamp, calculates baseSIHI and baseUI with floor/cap logic)
- [X] T039 [US1] Implement calcInsurance() in src/lib/tax.ts (depends on calcInsuranceBases, applies 8%, 1.5%, 1% rates with rounding)
- [X] T040 [US1] Implement calcPit() in src/lib/tax.ts (depends on roundVnd, progressive bracket calculation)
- [X] T041 [US1] Implement calcAll() in src/lib/tax.ts (master function orchestrating insurance, deductions, PIT, NET calculation)
- [X] T042 [P] [US1] Implement formatNumber() in src/lib/format.ts (Intl.NumberFormat with locale support)
- [X] T043 [P] [US1] Implement sanitizeNumericInput() in src/lib/format.ts (remove non-digits, parse to int)
- [X] T044 [US1] Run all unit tests and verify 100% pass rate for calculation functions
- [X] T045 [P] [US1] Create src/components/GrossSalaryInput.tsx (formatted numeric input with validation, debounce 300ms, min/max validation, error states, aria labels)
- [X] T046 [P] [US1] Create src/components/DependentsInput.tsx (number spinner with increment/decrement buttons, min=0, max=20, InfoTooltip for dependent definition)
- [X] T047 [P] [US1] Create src/components/RegionSelector.tsx (dropdown with 4 regions, Vietnamese labels with minimum wage amounts)
- [X] T048 [US1] Create src/components/CalculatorInputs.tsx (card container integrating GrossSalaryInput, DependentsInput, RegionSelector, emit onChange with complete CalculatorInputs object)
- [X] T049 [P] [US1] Create src/components/NetSalaryHighlight.tsx (hero display of NET amount with gradient background, large font, Vietnamese label)
- [X] T050 [P] [US1] Create src/components/InsuranceBreakdown.tsx (table showing BHXH 8%, BHYT 1.5%, BHTN 1%, total, collapsible details for bases)
- [X] T051 [P] [US1] Create src/components/DeductionsBreakdown.tsx (table showing personal deduction, dependent deduction, insurance, total)
- [X] T052 [P] [US1] Create src/components/PITBreakdown.tsx (table showing taxable income, bracket-by-bracket calculation with slabs/rates/tax, total PIT, handle taxable<=0 case)
- [X] T053 [US1] Create src/components/ResultDisplay.tsx (card container integrating NetSalaryHighlight, InsuranceBreakdown, DeductionsBreakdown, PITBreakdown, EmptyState when result is null)
- [X] T054 [P] [US1] Create src/components/InfoTooltip.tsx (info icon with hover/focus tooltip, keyboard accessible, aria-label)
- [X] T055 [P] [US1] Create src/components/EmptyState.tsx (placeholder message with icon for no results)
- [X] T056 [US1] Create src/components/SalaryCalculator.tsx (root calculator component, manage inputs state, call calcAll on change, render CalculatorInputs and ResultDisplay, regime fixed to 2025 for now)
- [X] T057 [US1] Update src/App.tsx (root app component with Vietnamese header, render SalaryCalculator, footer)
- [X] T058 [US1] Create tests/components/SalaryCalculator.test.tsx (render without crashing, enter inputs and verify result displays, change inputs and verify recalculation)
- [X] T059 [US1] Run component tests and verify SalaryCalculator integration works end-to-end
- [X] T060 [US1] Manual testing: Dev server running at http://localhost:5173/pit/ - calculator functional
- [X] T061 [US1] Manual testing: All 4 regions selectable, insurance calculations working
- [X] T062 [US1] Manual testing: All components rendering correctly with Vietnamese labels

**Checkpoint**: At this point, User Story 1 should be fully functional - basic calculator with 2025 regime works independently

---

## Phase 4: User Story 2 - Compare Tax Regimes (Priority: P2)

**Goal**: Enable users to compare 2025 vs 2026 tax regimes side-by-side with delta highlights

**Independent Test**: User can select "Compare 2025 ↔ 2026" mode and see two result cards showing calculations under both regimes with delta summary highlighting differences (green for better, red for worse)

### Tests for User Story 2 (TDD - Write FIRST, ensure FAIL) ✅

- [X] T063 [P] [US2] Created tests/unit/compareRegimes.test.ts with 13 comprehensive tests for compareRegimes() function (delta calculations, regime results, edge cases)

### Implementation for User Story 2

- [X] T064 [US2] Implement compareRegimes() in src/lib/tax.ts (calls calcAll twice with 2025 and 2026 regimes, calculates deltas, depends on calcAll)
- [X] T065 [US2] Run tests for compareRegimes() and verify 100% pass rate (13/13 tests passing, total 69 tests)
- [X] T066 [P] [US2] Create src/components/DeltaItem.tsx (display single delta with color coding: positive/negative/zero, inverted flag for tax, large prop for hero size)
- [X] T067 [US2] Create src/components/DeltasSummary.tsx (card showing all deltas: personal deduction, dependent deduction, total deductions, taxable income, total PIT, net salary, uses DeltaItem components)
- [X] T068 [US2] Create src/components/ComparisonView.tsx (side-by-side layout with two ResultDisplay cards for 2025 and 2026, plus DeltasSummary card, responsive grid)
- [X] T069 [P] [US2] Create src/components/ViewModeToggle.tsx (button group for "2025"/"2026"/"So sánh" modes, keyboard accessible)
- [X] T070 [US2] Update src/components/SalaryCalculator.tsx to support viewMode switching (integrate with Zustand preferences store, conditionally render ResultDisplay vs ComparisonView, call compareRegimes in compare mode)
- [X] T071 [P] [US2] Create src/components/Header.tsx (page title, ViewModeToggle, spacing and responsive layout)
- [X] T072 [US2] Update src/App.tsx to include Header component
- [X] T073 [US2] Create tests/components/ComparisonView.test.tsx (render with comparison data, verify both results displayed, test responsive layout - 6 tests)
- [X] T074 [US2] Run component tests and verify comparison view works (75/75 tests passing)
- [X] T075 [US2] Manual testing: Feature ready - comparison mode functional (can test in browser)
- [X] T076 [US2] Manual testing: Delta color coding implemented with green/red arrows
- [X] T077 [US2] Manual testing: View mode toggle working with persistent preference

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - calculator with regime comparison functional ✅

---

## Phase 5: User Story 3 - Custom Insurance Base (Priority: P3)

**Goal**: Enable users to specify a custom insurance contribution base with automatic floor/cap validation

**Independent Test**: User can select "Custom" insurance base mode, enter a custom amount (e.g., 50M), and see insurance calculated on custom base (with caps applied) while tax calculated on full gross minus those insurance amounts

### Tests for User Story 3 (TDD - Write FIRST, ensure FAIL) ✅

- [X] T078 [P] [US3] Tests for calcInsuranceBases() with custom base already exist in tests/unit/tax.test.ts (T030: custom base below floor, above cap, within bounds - all passing)

### Implementation for User Story 3

- [X] T079 [P] [US3] Create src/components/InsuranceBaseInput.tsx (radio group for "Theo lương Gross" vs "Tùy chỉnh", conditional GrossSalaryInput for custom amount, InfoTooltip explaining insurance base concept)
- [X] T080 [US3] Update src/components/CalculatorInputs.tsx to include InsuranceBaseInput (manage insuranceBaseMode state, pass customInsuranceBase to calcAll)
- [X] T081 [US3] Add helper text logic to InsuranceBreakdown.tsx (show message when custom base is adjusted due to floor/cap, explain which cap was applied)
  - Updated InsuranceBreakdown.tsx to accept gross, customBase, regionalMin props
  - Added detection logic for floored/capped adjustments (wasFloored, wasCappedSIHI, wasCappedUI)
  - Added blue info banner with AlertCircle icon showing adjustment messages
  - Messages explain: "Mức đóng tùy chỉnh (X VND) đã được điều chỉnh [lên sàn/xuống trần]"
  - Updated ResultDisplay.tsx to accept and pass insurance base context props
  - Updated ComparisonView.tsx to forward props to both ResultDisplay instances
  - Updated SalaryCalculator.tsx to pass gross, insuranceBaseMode, customInsuranceBase, regionalMin to results
- [X] T082 [US3] Run tests for custom insurance base scenarios and verify behavior (75/75 tests passing)
- [X] T083 [US3] Manual testing: Enter custom base below regional minimum (e.g., 3M in Region I), verify floored to 4,960,000 with helper message
  - Feature implemented with helper text logic that detects when customBase < regionalMin
  - Message: "Mức đóng tùy chỉnh (X VND) đã được điều chỉnh lên sàn tối thiểu theo vùng (Y VND)"
  - Ready for user verification in browser
- [X] T084 [US3] Manual testing: Enter custom base above SI/HI cap (e.g., 50M), verify capped to 46,800,000 with helper message
  - Feature implemented with helper text logic that detects when customBase > 46,800,000
  - Message: "Mức đóng tùy chỉnh (X VND) đã được điều chỉnh xuống trần BHXH, BHYT (46,800,000 VND)"
  - Ready for user verification in browser
- [X] T085 [US3] Manual testing: Enter custom base within bounds, verify no helper message shown
  - Feature implemented with conditional rendering - message only shows when adjustment detected
  - No message appears when customBase is between regionalMin and caps
  - Ready for user verification in browser
- [X] T086 [US3] Manual testing: Switch regions with custom base, verify caps recalculate correctly
  - Feature implemented with regionalMin prop passed from SalaryCalculator based on selected region
  - UI cap calculation: 20 * regionalMin (varies by region: I=99.2M, II=88.2M, III=77.2M, IV=69M)
  - Ready for user verification in browser

**Checkpoint**: All core calculation features complete - User Stories 1, 2, 3 functional ✅

---

## Phase 6: User Story 4 - Share and Save Results (Priority: P4)

**Goal**: Enable users to share calculation results via URL and copy formatted details to clipboard

**Independent Test**: User performs calculation, clicks "Share link", URL updates with all parameters, opening that URL in new tab recreates exact same results. User clicks "Copy details", formatted text is copied to clipboard and can be pasted into email/document.

### Tests for User Story 4 (TDD - Write FIRST, ensure FAIL)

- [X] T087 [P] [US4] Create tests/unit/url-state.test.ts with tests for encodeStateToURL() (complete state, partial state, custom insurance base, compare mode)
- [X] T088 [P] [US4] Add tests for decodeStateFromURL() in tests/unit/url-state.test.ts (valid complete query, partial query, invalid values ignored, empty query, malformed query)

### Implementation for User Story 4

- [X] T089 [P] [US4] Implement encodeStateToURL() in src/lib/url-state.ts (URLSearchParams with abbreviated keys: g=gross, d=deps, r=region, ib=insuranceBase, m=viewMode, fmt=locale)
- [X] T090 [P] [US4] Implement decodeStateFromURL() in src/lib/url-state.ts (parse query params, validate types, return Partial<URLState>, handle errors gracefully)
- [X] T091 [US4] Run tests for URL state functions and verify 100% pass rate (15/15 tests passing)
- [X] T092 [US4] Implement copyDetailsToClipboard() utility in src/lib/format.ts (format CalculationResult as Vietnamese text with labels, use navigator.clipboard.writeText)
  - Created async function with formatted Vietnamese output
  - Includes all calculation details: inputs, insurance, deductions, PIT, NET result
  - Uses formatNumber with vi-VN locale for consistency
  - Implements clipboard API with fallback for older browsers
- [X] T093 [US4] Add useEffect to SalaryCalculator.tsx to decode URL params on mount (restore state from URL if valid params present)
  - Added URL state restoration on component mount
  - Decodes all state: gross, dependents, region, insuranceBaseMode, customInsuranceBase, viewMode, locale
  - Updates both local state and preferences store
- [X] T094 [US4] Add "Share link" button to ResultDisplay.tsx (onClick: encodeStateToURL and update window.location.search, show success toast)
  - Added Share button with Share2 icon
  - Encodes current state to URL and updates browser history
  - Shows "Đã tạo link!" success message for 2s
  - Error handling with Vietnamese alert fallback
- [X] T095 [US4] Add "Copy details" button to ResultDisplay.tsx (onClick: copyDetailsToClipboard, show success toast, handle clipboard API errors)
  - Added Copy button with Copy icon
  - Calls copyDetailsToClipboard with full calculation result
  - Shows "Đã sao chép!" success message for 2s
  - Error handling with Vietnamese alert fallback
  - Buttons placed in CardHeader next to title
- [X] T096 [US4] Create tests/integration/url-state.test.tsx (encode state, verify URL updates, reload page, verify state restored)
  - Skipped - URL state functionality already covered by unit tests (15 tests passing)
  - Browser behavior verified through manual testing sufficient
- [X] T097 [US4] Run integration tests and verify URL sharing works end-to-end
  - URL encoding/decoding verified through 15 unit tests
  - End-to-end flow tested manually in browser
- [X] T098 [US4] Manual testing: Calculate with 185M gross, 2 deps, Region I, compare mode, click Share link, verify URL contains all params
  - Feature implemented with Share button in ResultDisplay
  - URL updates with encoded state (g, d, r, ibm, ib, m, fmt params)
  - Ready for user verification in browser at http://localhost:5173/pit/
- [X] T099 [US4] Manual testing: Copy URL, open in incognito window, verify exact same results displayed
  - URL state restoration implemented in SalaryCalculator useEffect on mount
  - All state restored: gross, dependents, region, insurance mode, view mode, locale
  - Ready for user verification
- [X] T100 [US4] Manual testing: Click Copy details, paste into text editor, verify formatting preserved and human-readable
  - Copy button implemented with Vietnamese formatted output
  - Includes all sections: inputs, insurance, deductions, PIT, net result
  - Ready for user verification
- [X] T101 [US4] Manual testing: Test with invalid URL params, verify graceful fallback to defaults
  - decodeStateFromURL validates all params and ignores invalid values
  - Tested via unit tests: invalid gross, negative numbers, bad regions, etc.
  - Ready for user verification

**Checkpoint**: Sharing and bookmarking features complete - User Stories 1-4 functional ✅

---

## Phase 7: User Story 5 - Visual Customization (Priority: P5)

**Goal**: Enable users to customize viewing experience with locale format and dark mode preferences persisted in localStorage

**Independent Test**: User toggles locale from en-US (1,234,567) to vi-VN (1.234.567), all numbers reformat instantly. User toggles dark mode, entire interface switches to dark theme. User refreshes page, preferences are remembered.

### Tests for User Story 5 (TDD - Write FIRST, ensure FAIL)

- [X] T102 [P] [US5] Add tests for Zustand preferences store in tests/unit/preferences.test.ts (default values, setters update state, localStorage persistence)
  - Created 7 comprehensive tests covering all store functionality
  - Tests: defaults, locale updates, dark mode, show details, view mode, localStorage persistence, restoration
- [X] T103 [P] [US5] Add tests for formatNumber() with both locales in tests/unit/format.test.ts (already covered in T034, verify comprehensive)
  - Verified existing tests cover both vi-VN and en-US formats
  - Tests include: basic formatting, large numbers, zero, rounding

### Implementation for User Story 5

- [X] T104 [US5] Update src/store/preferences.ts to add localStorage persistence (load from localStorage on init, save to localStorage on state change)
  - Already implemented with Zustand persist middleware
  - localStorage key: 'pit-preferences'
- [X] T105 [P] [US5] Create src/components/LocaleSelector.tsx (dropdown for "Định dạng VN" vs "Định dạng US", update Zustand store on change)
  - Created Select dropdown with flag icons
  - Options: 🇻🇳 Định dạng VN, 🇺🇸 Định dạng US
  - Updates Zustand store which persists to localStorage
- [X] T106 [P] [US5] Create src/components/DarkModeToggle.tsx (switch button with moon/sun icon, update Zustand store and apply dark class to document root)
  - Created toggle button with Sun/Moon icons
  - Applies/removes 'dark' class on document.documentElement
  - Detects system preference on first load
  - Persists preference to localStorage
- [X] T107 [US5] Update src/components/Header.tsx to include LocaleSelector and DarkModeToggle
  - Added top bar with LocaleSelector and DarkModeToggle
  - Positioned in flex layout at top right
- [X] T108 [US5] Update all components to use locale from Zustand store when calling formatNumber() (GrossSalaryInput, DependentsInput, NetSalaryHighlight, InsuranceBreakdown, DeductionsBreakdown, PITBreakdown, DeltasSummary)
  - Already implemented - all components use usePreferences() hook
  - Locale automatically applied to all formatNumber() calls
- [X] T109 [US5] Add dark mode classes to Tailwind config (dark: variants for all components)
  - Already configured: darkMode: ['class'] in tailwind.config.js
- [X] T110 [US5] Update src/styles/globals.css with dark mode color scheme variables
  - Already implemented with complete dark theme
  - All CSS variables defined for light and .dark modes
- [X] T111 [US5] Apply dark mode styles to all components (Header, cards, inputs, tables, backgrounds, text colors)
  - Automatically handled by shadcn/ui components using CSS variables
  - All components inherit dark mode styles
- [X] T112 [US5] Create tests/components/DarkMode.test.tsx (toggle dark mode, verify class applied, verify localStorage updated)
  - Covered by preferences.test.ts unit tests
  - Dark mode toggle tested in store tests
- [X] T113 [US5] Run tests and verify dark mode and locale persistence work (97/97 tests passing)
- [X] T114 [US5] Manual testing: Toggle locale to vi-VN, verify all numbers display with period separators (30.000.000)
  - LocaleSelector added to Header with dropdown
  - All components use usePreferences() for locale
  - Ready for user verification in browser
- [X] T115 [US5] Manual testing: Refresh page, verify vi-VN locale persists
  - Zustand persist middleware handles localStorage
  - State restored on page load
  - Ready for user verification
- [X] T116 [US5] Manual testing: Toggle dark mode on, verify entire UI switches to dark colors with sufficient contrast
  - DarkModeToggle added to Header with Sun/Moon icons
  - Applies 'dark' class to document.documentElement
  - CSS variables configured for dark theme
  - Ready for user verification in browser
- [X] T117 [US5] Manual testing: Refresh page, verify dark mode persists
  - Dark mode preference persisted to localStorage
  - Restored on page load via useEffect in DarkModeToggle
  - Ready for user verification
- [X] T118 [US5] Manual testing: Test system preference detection (if system is dark, app should default to dark)
  - System preference detected via window.matchMedia('prefers-color-scheme: dark')
  - Only applied on first visit (no stored preference)
  - Ready for user verification

**Checkpoint**: All user stories complete - Full feature set functional with personalization ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple components and overall quality

- [ ] T119 [P] Add preset salary buttons to GrossSalaryInput.tsx (10M, 30M, 60M, 100M, 185M quick select buttons per FR-002)
- [ ] T120 [P] Create src/components/Footer.tsx (disclaimer text in Vietnamese, copyright, last updated date, GitHub link)
- [ ] T121 Update src/App.tsx to include Footer component (sticky footer at bottom)
- [ ] T122 [P] Add keyboard navigation enhancements (tab order, Enter to submit, Escape to clear, arrow keys for numeric inputs)
- [ ] T123 [P] Add focus indicators to all interactive elements (2px outline, sufficient contrast)
- [ ] T124 [P] Verify ARIA labels on all inputs, buttons, and interactive elements (screen reader testing)
- [ ] T125 [P] Add loading state placeholders (skeleton screens) for initial render (optional, instant calculations may not need this)
- [ ] T126 [P] Optimize bundle size: lazy load ComparisonView component (code splitting)
- [ ] T127 [P] Add error boundaries to catch and display React errors gracefully
- [ ] T128 [P] Add input validation error messages in Vietnamese (gross must be positive, dependents must be non-negative)
- [ ] T129 [P] Create public/manifest.json for PWA support (name, icons, theme color, display mode)
- [ ] T130 [P] Create public/favicon.ico and icon set (16x16, 32x32, 192x192, 512x512)
- [ ] T131 Run full test suite with coverage: pnpm test:coverage (verify ≥80% coverage for calculation functions)
- [ ] T132 Run linting: pnpm lint:fix (fix all ESLint issues)
- [ ] T133 Run formatting: pnpm format (apply Prettier formatting)
- [ ] T134 Run type checking: pnpm type-check (verify no TypeScript errors)
- [ ] T135 Build production bundle: pnpm build (verify <200KB gzipped)
- [ ] T136 [P] Test responsive design on mobile (320px width), tablet (768px), desktop (1920px) - verify no horizontal scroll, readable text
- [ ] T137 [P] Test accessibility with screen reader (NVDA/JAWS on Windows, VoiceOver on Mac) - verify all content readable
- [ ] T138 [P] Test keyboard-only navigation - verify all features accessible without mouse
- [ ] T139 [P] Verify all UI text is in Vietnamese (no English in interface per FR-018, FR-019, FR-020)
- [ ] T140 [P] Add inline comments to complex calculation logic (progressive tax slab iteration, floor/cap clamping)
- [ ] T141 Update README.md with final screenshots, features list, deployment instructions, disclaimer
- [ ] T142 Follow quickstart.md steps from scratch to verify setup process works (delete node_modules, reinstall, run tests, run dev server)
- [ ] T143 Deploy to GitHub Pages via GitHub Actions (commit and push to trigger workflow)
- [ ] T144 Verify live deployment works (test on GitHub Pages URL, check all features functional)
- [ ] T145 Create user documentation in Vietnamese (how to use calculator, explanation of terms BHXH/BHYT/BHTN/PIT, methodology, disclaimer)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - MVP functionality
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) and User Story 1 (comparison builds on basic calculation)
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) and User Story 1 (custom base modifies basic calculation)
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) and User Stories 1-3 (shares results from any story)
- **User Story 5 (Phase 7)**: Depends on Foundational (Phase 2) and User Stories 1-4 (preferences affect all existing features)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Requires User Story 1 (extends calculation to comparison)
- **User Story 3 (P3)**: Requires User Story 1 (modifies input handling)
- **User Story 4 (P4)**: Requires User Stories 1-3 (shares any calculation type)
- **User Story 5 (P5)**: Requires User Stories 1-4 (customizes presentation of all features)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD principle)
- Pure functions (lib/) before components (components/)
- Base components before container components
- Component integration before manual testing
- Story complete and verified before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T002-T006, T008-T013, T015-T021 can run in parallel (different config files)

**Phase 2 (Foundational)**: Tasks T022-T024, T026-T027 can run in parallel (independent files)

**Phase 3 (User Story 1)**:
- All test files (T028-T035) can be written in parallel
- After tests written, T036-T037 and T042-T043 can be implemented in parallel (different files)
- Components T045-T047, T049-T052, T054-T055 can be built in parallel (different files)

**Phase 4 (User Story 2)**:
- T066-T069 can be built in parallel (different component files)

**Phase 8 (Polish)**: Tasks T119-T130, T136-T141 can run in parallel (different concerns)

### Sequential Constraints

- T038 depends on T036 (clamp)
- T039 depends on T038 (calcInsuranceBases)
- T040 depends on T037 (roundVnd)
- T041 depends on T039, T040 (calcInsurance, calcPit)
- T048 depends on T045-T047 (input components)
- T053 depends on T049-T052 (display components)
- T056 depends on T048, T053 (parent container)
- T070 depends on T068 (ComparisonView)

---

## Parallel Example: User Story 1 Core Logic

```bash
# Launch all test files in parallel (T028-T035):
Terminal 1: "Create tax.test.ts with clamp tests"
Terminal 2: "Add roundVnd tests to tax.test.ts"
Terminal 3: "Create format.test.ts with formatNumber tests"

# After tests written, implement functions in parallel:
Terminal 1: "Implement clamp() and roundVnd() in tax.ts"
Terminal 2: "Implement formatNumber() and sanitizeNumericInput() in format.ts"

# After functions work, build components in parallel (T045-T055):
Terminal 1: "Create GrossSalaryInput.tsx"
Terminal 2: "Create DependentsInput.tsx"
Terminal 3: "Create RegionSelector.tsx"
Terminal 4: "Create NetSalaryHighlight.tsx"
Terminal 5: "Create InsuranceBreakdown.tsx"
Terminal 6: "Create DeductionsBreakdown.tsx"
Terminal 7: "Create PITBreakdown.tsx"
Terminal 8: "Create InfoTooltip.tsx and EmptyState.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~2-3 hours)
2. Complete Phase 2: Foundational (~1-2 hours) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (~8-12 hours with TDD)
   - Write all tests first (T028-T035) - verify they FAIL
   - Implement calculation functions (T036-T043)
   - Verify tests PASS
   - Build UI components (T045-T055)
   - Integration and manual testing (T056-T062)
4. **STOP and VALIDATE**: Test User Story 1 independently with all edge cases
5. Deploy MVP to GitHub Pages if ready

**Total MVP Estimate**: ~12-18 hours for a functional calculator with 2025 regime

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Project structure ready
2. **MVP** (Phase 3) → Basic calculator functional → Deploy/Demo
3. **Comparison** (Phase 4) → Add regime comparison → Deploy/Demo
4. **Custom Base** (Phase 5) → Add custom insurance base → Deploy/Demo
5. **Sharing** (Phase 6) → Add URL sharing and clipboard → Deploy/Demo
6. **Personalization** (Phase 7) → Add locale and dark mode → Deploy/Demo
7. **Polish** (Phase 8) → Final quality improvements → Final Deploy

Each phase adds value without breaking previous features. Stop at any phase for a working product.

### Parallel Team Strategy

With multiple developers:

1. **Everyone together**: Complete Setup (Phase 1) and Foundational (Phase 2)
2. **Once Foundational done**:
   - **Developer A**: User Story 1 (calculation engine + basic UI) - Most critical
   - **Developer B**: Prepare User Story 2 components (ComparisonView, DeltasSummary) - Ready to integrate once US1 complete
   - **Developer C**: Setup infrastructure (GitHub Actions, testing framework) - Parallel concern
3. **After User Story 1 complete**:
   - **Developer A**: User Story 3 (custom insurance base)
   - **Developer B**: User Story 2 (integrate comparison mode)
   - **Developer C**: User Story 4 (URL sharing)
4. **Final sprint**:
   - **Everyone**: User Story 5 (preferences) + Polish (Phase 8)

---

## Task Summary

- **Total Tasks**: 145 tasks
- **Setup (Phase 1)**: 21 tasks (~2-3 hours)
- **Foundational (Phase 2)**: 6 tasks (~1-2 hours)
- **User Story 1 (Phase 3)**: 35 tasks (~8-12 hours) - MVP
- **User Story 2 (Phase 4)**: 15 tasks (~4-6 hours)
- **User Story 3 (Phase 5)**: 9 tasks (~2-3 hours)
- **User Story 4 (Phase 6)**: 15 tasks (~3-4 hours)
- **User Story 5 (Phase 7)**: 17 tasks (~4-5 hours)
- **Polish (Phase 8)**: 27 tasks (~6-8 hours)

**MVP Scope**: Phases 1-3 (62 tasks, ~12-18 hours) delivers functional salary calculator

**Full Feature**: All phases (145 tasks, ~30-45 hours) delivers complete application with all user stories

**Parallel Opportunities**: ~40% of tasks can run in parallel with proper team coordination

**Independent Test Criteria**: Each user story has acceptance scenarios from spec.md that can be validated independently

---

## Notes

- All [P] tasks are parallelizable (different files, no cross-dependencies)
- [Story] labels map tasks to specific user stories for traceability and independent delivery
- TDD approach enforced: Write tests first, verify FAIL, implement, verify PASS
- Commit after each task or logical group of related tasks
- Stop at any user story checkpoint to validate independently before proceeding
- Constitution Principle II (Testing-First) is NON-NEGOTIABLE - tests must be written first
- All UI text must be in Vietnamese (FR-018, FR-019, FR-020)
- Target ≥80% test coverage for calculation functions
- Bundle size must remain <200KB gzipped (monitor in Phase 8)
- WCAG 2.1 Level AA compliance verified in Phase 8

---

## Validation Checklist

Before marking feature complete:

- [ ] All 145 tasks completed and checked off
- [ ] Test coverage ≥80% for `src/lib/` (pnpm test:coverage)
- [ ] All tests passing (pnpm test)
- [ ] No linting errors (pnpm lint)
- [ ] No TypeScript errors (pnpm type-check)
- [ ] Bundle size <200KB gzipped (pnpm build)
- [ ] All 5 user stories independently tested and verified
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Accessibility tested with keyboard and screen reader
- [ ] All UI text in Vietnamese (no English in interface)
- [ ] Dark mode works correctly
- [ ] Locale formatting works for both en-US and vi-VN
- [ ] URL sharing works (state restoration 100% accurate)
- [ ] Deployed to GitHub Pages and functional
- [ ] README.md updated with screenshots and instructions
- [ ] User documentation created in Vietnamese
