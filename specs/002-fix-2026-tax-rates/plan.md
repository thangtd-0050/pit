# Implementation Plan: Fix 2026 Tax Regime Rates

**Branch**: `002-fix-2026-tax-rates` | **Date**: 2025-11-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fix-2026-tax-rates/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Correct the 2026 tax regime progressive tax rates in the Vietnam Gross-to-Net Salary Calculator from incorrect rates (5%-10%-15%-20%-35%) to legally accurate rates (5%-15%-25%-30%-35%).

**Technical Approach**:
- Update constant values in `src/config/constants.ts` for REGIME_2026 bracket rates
- Update affected unit test assertions in `tests/unit/tax.test.ts`
- Update documentation references in `README.md`
- Verify all calculations automatically use corrected rates through existing calcPit() function
- No architectural changes required - pure data correction

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode enabled)
**Primary Dependencies**: React 18.2, Vite 5.0, Vitest 4.0
**Storage**: N/A (constants file only, no persistence needed)
**Testing**: Vitest + Testing Library (unit tests + component tests)
**Target Platform**: Web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Single-page web application (SPA) - existing project
**Performance Goals**: Instant calculation updates (<100ms), no performance impact from constant change
**Constraints**: Must maintain backwards compatibility with URL state encoding, all 97 existing tests must pass
**Scale/Scope**: Bug fix affecting 1 configuration file + test assertions + documentation (minimal scope)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**✅ Code Quality Excellence**: Simple constant update maintains existing high standards (97 tests, 76% coverage)

**✅ Testing-First Methodology (NON-NEGOTIABLE)**:
- Gate: Update test assertions BEFORE fixing constants (TDD red-green cycle)
- Gate: Verify all 97 tests pass after changes
- Gate: No reduction in coverage percentage

**✅ Gradual Reliability Improvement**: Fix enhances calculation accuracy for 2026 regime

**✅ UI/UX Priority**: No UI changes, maintains existing user experience

**✅ Performance-By-Design**: No performance impact (static constant change)

**✅ Security/Privacy First**: No security implications (client-side calculation only)

**✅ Build Incrementally**: Atomic change - single constant fix, test update, documentation

**No Conflicts Detected**: This bug fix aligns perfectly with all constitution principles.

**Gate Checks Required in Tasks**:
1. Tests updated BEFORE constant fix (TDD enforcement)
2. All 97 tests passing after implementation
3. Coverage remains ≥76%
4. Documentation updated to reflect changes

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
src/
├── config/
│   └── constants.ts         # REGIME_2026 brackets need correction
├── lib/
│   └── tax.ts               # Uses constants for calculations (no change needed)
├── components/
│   └── [various UI]         # No changes needed
└── App.tsx                  # No changes needed

tests/
├── unit/
│   └── tax.test.ts          # Assertions for 2026 need update
└── component/               # No changes needed

README.md                    # Tax bracket table needs update
```

**Structure Decision**: Single-project React SPA structure (Option 1). This bug fix affects only:
- 1 constant file: `src/config/constants.ts` (REGIME_2026.brackets array)
- 1 test file: `tests/unit/tax.test.ts` (2026-specific test assertions)
- 1 documentation file: `README.md` (tax methodology table)

No architectural changes needed. Existing calculation logic in `src/lib/tax.ts` is correct and uses the constants without modification.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**N/A** - No constitution violations detected. This is a straightforward bug fix that aligns with all principles.
