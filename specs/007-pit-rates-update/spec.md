# Feature Specification: Update 2026 Personal Income Tax Rates

**Feature Branch**: `007-pit-rates-update`
**Created**: December 10, 2025
**Status**: Draft
**Input**: User description: "Cập nhật thuế suất thu nhập cá nhân cho năm 2026 theo luật mới thông qua ngày 10/12/2025: Bậc 10-30 triệu giảm từ 15% xuống 10%, bậc 30-60 triệu giảm từ 25% xuống 20%, các bậc còn lại giữ nguyên"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Updated Tax Calculation with New Rates (Priority: P1)

Users need to see their net income for year 2026 calculated using the newly approved tax rates effective from the law passed on December 10, 2025. When they select 2026 regime and enter their gross salary, the system must apply the correct reduced rates for the 10-30 million and 30-60 million VND brackets.

**Why this priority**: This is the core legal compliance requirement. The calculator must reflect the law as passed by the National Assembly with over 92% approval for the upcoming 2026 tax year.

**Independent Test**: Select 2026 regime, enter a gross salary resulting in taxable income in the 10-30 million VND range and verify the PIT calculation uses 10% rate (not the previously proposed 15%). Enter a salary in the 30-60 million range and verify 20% rate (not the previously proposed 25%).

**Acceptance Scenarios**:

1. **Given** a user selects 2026 regime and has a taxable income of 20 million VND (in the 10-30 million bracket), **When** they calculate their tax, **Then** the system applies a 10% rate to the portion in this bracket (not the previously proposed 15%)
2. **Given** a user selects 2026 regime and has a taxable income of 45 million VND (in the 30-60 million bracket), **When** they calculate their tax, **Then** the system applies a 20% rate to the portion in this bracket (not the previously proposed 25%)
3. **Given** a user selects 2026 regime and has a taxable income spanning multiple brackets including 10-30M and 30-60M, **When** they calculate their total tax, **Then** each bracket portion uses the correct new rate (10% and 20% respectively)

---

### User Story 2 - Compare 2025 vs 2026 Tax Calculations (Priority: P2)

Users want to understand how much they save under the new 2026 tax rates compared to the current 2025 rates, helping them appreciate the tax reduction benefit.

**Why this priority**: This provides transparency and helps users understand the impact of the new law on their take-home pay when the 2026 regime takes effect.

**Independent Test**: Use the comparison view to display side-by-side calculations showing 2025 rates vs 2026 rates (10%, 20% for affected brackets) and the resulting difference in net income.

**Acceptance Scenarios**:

1. **Given** a user is viewing their tax calculation, **When** they enable comparison mode, **Then** the system shows their net income under both the current 2025 regime and new 2026 regime
2. **Given** a user's taxable income falls in the affected brackets (10-30M or 30-60M) in 2026, **When** they view the comparison, **Then** the system highlights the savings amount and percentage difference compared to the originally proposed rates
3. **Given** a user's taxable income is below 10 million or above 60 million only, **When** they view comparison, **Then** the system still shows differences due to higher personal/dependent deductions in 2026 (15.5M vs 11M personal deduction)

---

### User Story 3 - Verify 2025 Regime Calculations Remain Unchanged (Priority: P3)

Users who need to reference current 2025 tax calculations should still be able to access calculations using the current 2025 rate structure without any changes.

**Why this priority**: Maintaining current calculation accuracy is important since 2025 regime is still in effect and should not be modified.

**Independent Test**: Select 2025 regime and verify calculations use the current 2025 rates (7 brackets: 5%, 10%, 15%, 20%, 25%, 30%, 35%).

**Acceptance Scenarios**:

1. **Given** a user selects 2025 as the calculation year, **When** they calculate tax, **Then** the system uses the current 2025 rates (15% for 10-18M, 20% for 18-32M, 25% for 32-52M brackets)
2. **Given** a user selects 2026 as the calculation year, **When** they calculate tax, **Then** the system uses the new 2026 rates (10% for 10-30M, 20% for 30-60M brackets)

---

### Edge Cases

- What happens when taxable income is exactly at bracket boundaries (10M, 30M, 60M)?
- How does the system handle calculations during the transition period if someone needs both 2024 and 2025 rates?
- What if a user has year-to-date income that spans both rate regimes (part of year under old rates, part under new)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST apply 10% tax rate to taxable income in the 10-30 million VND bracket for 2026 regime (reduced from originally proposed 15%)
- **FR-002**: System MUST apply 20% tax rate to taxable income in the 30-60 million VND bracket for 2026 regime (reduced from originally proposed 25%)
- **FR-003**: System MUST maintain all other 2026 tax bracket rates unchanged (5% for 0-10M, 30% for 60-100M, 35% for >100M)
- **FR-004**: System MUST apply these new rates when user selects 2026 regime (effective date: law approved December 10, 2025)
- **FR-005**: System MUST retain the current 2025 regime calculations unchanged (7 brackets with rates: 5%, 10%, 15%, 20%, 25%, 30%, 35%)
- **FR-006**: System MUST display a notice or indicator showing the 2026 regime reflects the newly approved law (92% approval, December 10, 2025)
- **FR-007**: System MUST calculate progressive taxation correctly for both regimes, applying each bracket's rate only to the income portion within that bracket
- **FR-008**: System MUST show the tax breakdown by bracket when detailed view is enabled for both 2025 and 2026 regimes

### Key Entities

- **Tax Bracket**: Represents a range of taxable income with an associated tax rate
  - Lower bound (e.g., 10 million VND)
  - Upper bound (e.g., 30 million VND)
  - Tax rate percentage (e.g., 10%)
  - Effective date (December 10, 2025 for new rates)
- **Tax Calculation**: Represents the computation result for a given income
  - Gross income
  - Deductions (personal, dependents, insurance)
  - Taxable income
  - Tax amount per bracket
  - Total PIT amount
  - Net income
  - Effective date of rates used

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All tax calculations for 2026 regime correctly apply 10% rate to the 10-30M VND bracket (not the originally proposed 15%)
- **SC-002**: All tax calculations for 2026 regime correctly apply 20% rate to the 30-60M VND bracket (not the originally proposed 25%)
- **SC-003**: Users with taxable income in affected brackets see reduced tax liability in 2026 compared to originally proposed rates (measurable difference in output)
- **SC-004**: System accurately calculates progressive taxation for both 2025 and 2026 regimes with combined income spanning multiple brackets, with each bracket using its correct rate
- **SC-005**: Current 2025 regime calculations remain unchanged and accurate (15% for 10-18M, 20% for 18-32M, 25% for 32-52M brackets)
- **SC-006**: Comparison view correctly shows differences between 2025 and 2026 regimes, including both rate changes and deduction increases
- **SC-006**: 100% of test cases comparing old vs new rate structures show expected differences for affected income ranges

## Out of Scope *(optional)*

- Changes to deduction amounts or eligibility
- Changes to insurance contribution rates
- Changes to tax brackets boundaries (only rates changed, not income ranges)
- Retroactive application to income earned before December 10, 2025
- Changes to other taxes (VAT, corporate tax, etc.)

## Assumptions *(optional)*

- The new rates take effect immediately upon law passage (December 10, 2025)
- No transition period or phase-in of the new rates
- The law applies to monthly taxable income calculations in the standard progressive manner
- Previous rate structure (15% and 25%) was in effect before December 10, 2025
- Other aspects of PIT calculation (deductions, insurance, family circumstances) remain unchanged
- The application calculates monthly PIT, not annual filing

## Dependencies *(optional)*

- Official publication of the amended Personal Income Tax Law
- Confirmation of effective date for the new rates
- No further amendments or corrections to the approved rates

## Future Considerations *(optional)*

- Potential for additional rate adjustments in future legislative sessions
- Integration with official tax filing systems when they adopt the new rates
- Historical data export for tax period spanning rate change (part year old, part year new)
- Multi-year comparison view showing rate evolution over time
