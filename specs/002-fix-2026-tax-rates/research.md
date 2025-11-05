# Research: 2026 Tax Rate Correction

## Overview

This research verifies the correct Vietnamese personal income tax rates for 2026 as required by FR-001 and FR-002 in the specification.

## Findings

### Correct 2026 Tax Brackets

According to the specification and Vietnamese tax law updates:

| Taxable Income Range | Correct Rate | Current (Incorrect) Rate |
|---------------------|--------------|--------------------------|
| ≤10,000,000 VND | 5% | 5% ✓ |
| 10,000,001-30,000,000 VND | **15%** | 10% ✗ |
| 30,000,001-60,000,000 VND | **25%** | 15% ✗ |
| 60,000,001-100,000,000 VND | **30%** | 20% ✗ |
| >100,000,000 VND | 35% | 35% ✓ |

### Required Changes

**File**: `src/config/constants.ts` (lines 80-84)

**Current (Incorrect)**:
```typescript
brackets: [
  { threshold: 10_000_000, rate: 0.05 },
  { threshold: 30_000_000, rate: 0.10 },  // WRONG
  { threshold: 60_000_000, rate: 0.15 },  // WRONG
  { threshold: 100_000_000, rate: 0.20 }, // WRONG
  { threshold: 'inf', rate: 0.35 },
]
```

**Corrected**:
```typescript
brackets: [
  { threshold: 10_000_000, rate: 0.05 },
  { threshold: 30_000_000, rate: 0.15 },  // FIXED: 10% → 15%
  { threshold: 60_000_000, rate: 0.25 },  // FIXED: 15% → 25%
  { threshold: 100_000_000, rate: 0.30 }, // FIXED: 20% → 30%
  { threshold: 'inf', rate: 0.35 },
]
```

## Impact Analysis

### Calculation Accuracy
- **Affected Users**: All users selecting 2026 regime
- **Income Range Impact**: 10M-100M VND monthly (middle-income brackets)
- **Error Magnitude**: Current implementation under-calculates tax for these brackets

### Test Coverage
- **File**: `tests/unit/tax.test.ts`
- **Affected Tests**: All 2026 regime test cases with expected assertions
- **Action Required**: Update expected values to match corrected rates

### Documentation
- **File**: `README.md`
- **Section**: Tax methodology table showing bracket rates
- **Action Required**: Update 2026 column to show correct rates

## Verification Checklist

- [x] Identified correct 2026 tax bracket rates
- [x] Located source code requiring changes (constants.ts)
- [x] Identified test files needing assertion updates
- [x] Identified documentation requiring updates
- [x] Confirmed no additional files affected
- [x] Verified no API or backend changes needed (client-side only)

## References

- Feature specification: `specs/002-fix-2026-tax-rates/spec.md`
- User story US-001: Fix 2026 tax calculation
- Functional requirements: FR-001 through FR-008
