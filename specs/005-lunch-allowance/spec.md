# Feature Specification: Lunch Allowance (Trợ Cấp Ăn Trưa/Ăn Giữa Ca)

**Feature Branch**: `005-lunch-allowance`  
**Created**: November 7, 2025  
**Status**: Draft  
**Input**: User description: "Bổ sung hỗ trợ tính trợ cấp ăn trưa/ăn giữa ca để phản ánh chính xác hơn phần không chịu thuế TNCN, phần chịu thuế nếu vượt mức trần cấu hình, và tiền thực nhận cuối cùng của người dùng"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable Lunch Allowance in Salary Calculation (Priority: P1) 🎯 MVP

Users can enable lunch allowance as a tax-exempt component of their total compensation. By default, the allowance is set to 730,000 VND (the common tax-exempt threshold in Vietnam), allowing users to simply toggle it on without additional configuration.

**Why this priority**: This is the core functionality that delivers immediate value - users can accurately calculate their net salary by including lunch allowance, which is a common benefit in Vietnam and affects their take-home pay.

**Independent Test**: Can be fully tested by enabling the lunch allowance toggle with the default 730,000 VND value and verifying the calculation shows correct gross salary, tax-exempt portion, and final net pay. Delivers a complete, usable feature that improves salary calculation accuracy.

**Acceptance Scenarios**:

1. **Given** a user is on the salary calculator page, **When** they enable the "Lunch Allowance" toggle, **Then** the system applies a default 730,000 VND allowance and recalculates their net salary
2. **Given** the lunch allowance is enabled with default value, **When** the user views the calculation breakdown, **Then** they see the 730,000 VND listed as a tax-exempt income component
3. **Given** a user has lunch allowance enabled, **When** they share their calculation via URL, **Then** the shared link preserves the lunch allowance toggle state
4. **Given** a user opens a shared calculation with lunch allowance enabled, **When** the page loads, **Then** the lunch allowance toggle is checked and the calculation reflects the allowance

---

### User Story 2 - Customize Lunch Allowance Amount (Priority: P2)

Users can customize the lunch allowance amount to match their actual company benefit, which may differ from the default 730,000 VND tax-exempt threshold.

**Why this priority**: While the default covers most cases, some companies offer different allowance amounts. This provides flexibility for accurate calculations without being critical for the initial MVP.

**Independent Test**: Can be tested independently by enabling lunch allowance and changing the input value to any custom amount (e.g., 500,000 VND or 1,000,000 VND), then verifying the calculation uses the custom amount for tax-exempt portion and taxable portion (if applicable).

**Acceptance Scenarios**:

1. **Given** lunch allowance is enabled, **When** a user enters a custom amount (e.g., 500,000 VND), **Then** the calculation uses that amount instead of the default
2. **Given** a user has entered a custom lunch allowance, **When** they share the calculation, **Then** the shared URL preserves the custom amount
3. **Given** a user enters an amount exceeding the tax-exempt threshold (730,000 VND), **When** the calculation is performed, **Then** only 730,000 VND is treated as tax-exempt and the excess is added to taxable income
4. **Given** a user has entered a custom amount, **When** they disable and re-enable the toggle, **Then** the custom amount is retained (not reset to default)

---

### User Story 3 - Display Lunch Allowance Breakdown in Results (Priority: P3)

Users can see a detailed breakdown showing how lunch allowance affects their total compensation, including tax-exempt portion and any taxable excess.

**Why this priority**: This enhances transparency and helps users understand their salary structure, but the basic calculation works without the detailed breakdown display.

**Independent Test**: Can be tested by enabling lunch allowance with various amounts and verifying the results display shows: (1) total lunch allowance amount, (2) tax-exempt portion (up to 730,000 VND), (3) taxable excess (if any), (4) updated gross taxable income.

**Acceptance Scenarios**:

1. **Given** lunch allowance is 730,000 VND or less, **When** viewing results, **Then** the breakdown shows the full amount as tax-exempt with no taxable excess
2. **Given** lunch allowance exceeds 730,000 VND (e.g., 1,000,000 VND), **When** viewing results, **Then** the breakdown shows 730,000 VND as tax-exempt and 270,000 VND as taxable excess added to gross income
3. **Given** lunch allowance is enabled, **When** viewing the comparison mode between tax regimes, **Then** both regime calculations include the lunch allowance with proper tax treatment
4. **Given** a user has lunch allowance enabled, **When** they view the results, **Then** the final net salary clearly reflects the impact of the tax-exempt allowance

---

---

### Edge Cases

- **Zero or negative values**: What happens when a user enters 0 or a negative value for lunch allowance? System should either prevent invalid input or treat zero as disabled.
- **Very large values**: How does the system handle lunch allowance values in the billions (e.g., 1,000,000,000 VND)? Should calculate correctly with tax treatment, but may want to add a warning for unrealistic values.
- **Decimal values**: Can users enter decimal amounts (e.g., 729,999.50 VND)? System should handle decimals or round appropriately.
- **State persistence**: What happens if a user enables lunch allowance, closes the browser, and returns? The state should persist based on URL parameters (same as other calculator inputs).
- **Interaction with other allowances**: If future features add other tax-exempt allowances, how do they combine? (This spec assumes lunch allowance is the first such feature, but architecture should allow for future expansion.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a toggle control to enable/disable lunch allowance in the salary calculation
- **FR-002**: System MUST apply a default lunch allowance value of 730,000 VND when the toggle is enabled
- **FR-003**: System MUST allow users to customize the lunch allowance amount via an editable input field
- **FR-004**: System MUST treat lunch allowance up to 730,000 VND as tax-exempt income (not subject to personal income tax)
- **FR-005**: System MUST treat any lunch allowance amount exceeding 730,000 VND as taxable income added to gross salary
- **FR-006**: System MUST persist lunch allowance state (enabled/disabled and custom amount) in the URL for sharing and bookmarking
- **FR-007**: System MUST restore lunch allowance state from URL parameters when loading a shared calculation
- **FR-008**: System MUST recalculate net salary immediately when lunch allowance is enabled, disabled, or the amount is changed
- **FR-009**: System MUST display lunch allowance in the calculation breakdown, showing tax-exempt portion and taxable excess separately
- **FR-010**: System MUST include lunch allowance in comparison mode calculations for all tax regimes
- **FR-011**: System MUST validate lunch allowance input to accept only non-negative numeric values
- **FR-012**: System MUST maintain the custom lunch allowance amount when the toggle is disabled and re-enabled within the same session

### Key Entities

- **Lunch Allowance**: A monetary benefit provided by employers for meals during work hours
  - Attributes: amount (VND), tax-exempt threshold (730,000 VND), enabled status
  - Tax treatment: Amount ≤ 730,000 VND is tax-exempt; excess is taxable
  - Relationship: Affects gross taxable income and final net salary calculations

- **Salary Calculation Result**: Extended to include lunch allowance components
  - New attributes: lunchAllowance (total amount), taxExemptAllowance (≤ 730,000 VND), taxableAllowance (excess over 730,000 VND)
  - Updated calculation flow: Gross Salary = Base Salary + Taxable Allowance, Net Salary = after all deductions from Gross + Tax-Exempt Allowance

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enable lunch allowance and see updated net salary calculation in under 5 seconds (instant recalculation)
- **SC-002**: 95% of users who enable lunch allowance use the default 730,000 VND value without modification (validates default choice)
- **SC-003**: Users can successfully share calculations with lunch allowance enabled, and recipients see identical results when opening the shared link
- **SC-004**: System correctly handles lunch allowance amounts from 0 to 10,000,000 VND with proper tax treatment (730,000 VND threshold)
- **SC-005**: Calculation results clearly distinguish between tax-exempt lunch allowance (up to 730,000 VND) and any taxable excess
- **SC-006**: Users report improved accuracy in net salary calculations when comparing with actual payslips that include lunch allowance (qualitative measure from user feedback)

## Assumptions

1. **Tax-exempt threshold**: The 730,000 VND threshold is based on current Vietnamese tax regulations (Circular 111/2013/TT-BTC). This is a reasonable default that applies to most employees. If regulations change, this should be configurable.

2. **Default value choice**: 730,000 VND is chosen as the default because it matches the maximum tax-exempt amount, making it the most common value used by companies.

3. **Single allowance type**: This spec assumes lunch allowance is a distinct benefit. If companies combine multiple meal allowances (breakfast, lunch, dinner), users would enter the total combined amount.

4. **Monthly calculation**: The allowance is treated as a monthly benefit consistent with the calculator's monthly salary focus. Daily or per-meal breakdowns are out of scope.

5. **No pro-rating**: The calculator does not pro-rate lunch allowance for partial months (e.g., new employees starting mid-month). Users would manually adjust the amount if needed.

6. **Interaction with existing logic**: The lunch allowance feature integrates with the existing calculator without modifying core tax calculation formulas - it simply adjusts the gross income inputs before tax calculation.

## Dependencies

- Existing salary calculator codebase (features 001-004 complete)
- Current calculator state management (Zustand store)
- URL state persistence mechanism (existing url-state.ts module)
- UI component library (shadcn/ui with Switch and Input components)

## Out of Scope

- Other types of allowances (transportation, housing, phone, etc.) - these would be separate features
- Company-specific allowance policies or approval workflows
- Integration with payroll systems or HR platforms
- Historical tracking of allowance changes over time
- Multi-currency support (calculator is VND-only)
- Automatic updates to tax-exempt thresholds based on regulation changes (would require backend service)
