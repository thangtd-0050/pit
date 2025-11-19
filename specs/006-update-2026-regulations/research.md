# Research: Update 2026 Regulations

**Feature**: Update 2026 Regulations
**Status**: Completed
**Date**: 2025-11-19

## Decisions

### 1. Configuration Management for Regional Minimum Wages (RMW)
- **Decision**: Introduce versioned constants for Regional Minimum Wages (`REGIONAL_MINIMUMS_2024`, `REGIONAL_MINIMUMS_2026`) in `src/config/constants.ts`.
- **Rationale**: The application currently uses a single `REGIONAL_MINIMUMS` constant. To support switching between 2025 (current) and 2026 regulations, we need distinct sets of values.
- **Implementation**:
  - Rename existing `REGIONAL_MINIMUMS` to `REGIONAL_MINIMUMS_2024` (or keep as default/fallback but explicitly define 2026).
  - Create `REGIONAL_MINIMUMS_2026` with the new values:
    - Region I: 5,310,000
    - Region II: 4,730,000
    - Region III: 4,140,000
    - Region IV: 3,700,000
  - Update `calcAll` to select the appropriate RMW based on the selected `Regime` (2025 vs 2026).

### 2. Unemployment Insurance (BHTN) Ceiling Calculation
- **Decision**: Continue using the formula `20 × Regional Minimum Wage` for the BHTN ceiling.
- **Rationale**: The user specified this formula for 2026. Our analysis of `src/lib/tax.ts` confirms this formula is *already* in use (`capUI = 20 * regionalMin`). The "change" mentioned by the user effectively refers to the *result* increasing due to the higher RMW, not a formula change (unless the user believes it was previously Base Salary, which is incorrect for BHTN, but we will ensure the correct formula is strictly applied).
- **Implementation**: Ensure `calcInsuranceBases` uses the RMW corresponding to the selected regime.

### 3. UI/UX for Explanations
- **Decision**: Add tooltips to the Insurance Breakdown section and a "New Regulations" indicator.
- **Rationale**: The user requested detailed explanations.
- **Implementation**:
  - Update `InsuranceBreakdown.tsx` to include `InfoTooltip` components next to BHXH, BHYT, BHTN labels.
  - Tooltips will explain the Floor (RMW) and Ceiling (20x Base Salary or 20x RMW) logic.
  - When 2026 regime is active, highlight the RMW values as "New".

### 4. Base Salary (Lương cơ sở)
- **Decision**: Keep `BASE_SALARY` at 2,340,000 VND for now.
- **Rationale**: The user did not provide a new Base Salary for 2026. The Base Salary affects the BHXH/BHYT ceiling (`20 * BASE_SALARY`). We will assume it remains unchanged until further notice.

## Alternatives Considered

- **Dynamic Date Selector**: Instead of just "2025" vs "2026" regimes, we could have a full date picker.
  - **Rejected**: The current app uses "Regime" objects (2025 vs 2026). Sticking to this pattern is simpler and fits the existing architecture. The "Regime" selection effectively acts as the "Effective Year" selector.

## Unknowns & Clarifications

- **Resolved**: The specific RMW values are provided.
- **Resolved**: The BHTN ceiling formula is confirmed.
