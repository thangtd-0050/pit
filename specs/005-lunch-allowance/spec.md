# Feature Specification: Lunch Allowance (Trợ Cấp Ăn Trưa/Ăn Giữa Ca)

**Feature Branch**: `005-lunch-allowance`
**Created**: November 7, 2025
**Status**: Draft
**Input**: User description: "Bổ sung hỗ trợ tính trợ cấp ăn trưa/ăn giữa ca để phản ánh chính xác hơn phần không chịu thuế TNCN, phần chịu thuế nếu vượt mức trần cấu hình, và tiền thực nhận cuối cùng của người dùng"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable Tax-Exempt Lunch Allowance in Salary Calculation (Priority: P1) 🎯 MVP

Users can enable tax-exempt lunch allowance as a non-taxable component of their gross income. By default, the allowance is set to 730,000 VND (a common amount for Vietnamese companies). The lunch allowance reduces taxable income, resulting in lower tax and higher net salary.

**Why this priority**: This is the core functionality that delivers immediate value - users can accurately calculate their net salary by including lunch allowance, which is a common tax-exempt benefit in Vietnam and reduces their tax burden.

**Logic**: Lunch allowance is part of gross income but is tax-exempt:
- Gross = 30,000,000 VND
- Lunch allowance (tax-exempt) = 730,000 VND
- Taxable income = Gross - Insurance - Deductions - **Lunch allowance**
- Tax is calculated on the reduced taxable income
- NET = Gross - Insurance - Tax (already reflects tax savings)

**Independent Test**: Enable the lunch allowance toggle with default 730,000 VND and verify: (1) taxable income is reduced by 730,000, (2) tax is lower, (3) NET is higher due to tax savings.

**Acceptance Scenarios**:

1. **Given** a user has gross salary 30M VND, **When** they enable lunch allowance with default 730K, **Then** taxable income is reduced by 730K and tax is recalculated on lower base
2. **Given** lunch allowance is enabled, **When** viewing calculation breakdown, **Then** lunch allowance is shown as reducing taxable income (not added to final NET)
3. **Given** a user has lunch allowance enabled, **When** they share via URL, **Then** the shared link preserves the lunch allowance state
4. **Given** a shared URL with lunch allowance, **When** page loads, **Then** calculation reflects the tax-exempt allowance correctly

---

### User Story 2 - Customize Tax-Exempt Lunch Allowance Amount (Priority: P2)

Users can customize the lunch allowance amount to match their actual company benefit. The entire amount is tax-exempt, reducing taxable income proportionally.

**Why this priority**: Companies offer different allowance amounts. This provides flexibility for accurate tax calculations.

**Independent Test**: Change lunch allowance to custom amount (e.g., 1,500,000 VND), verify taxable income is reduced by that amount and tax is recalculated.

**Acceptance Scenarios**:

1. **Given** lunch allowance enabled, **When** user enters 500,000 VND, **Then** taxable income is reduced by 500,000
2. **Given** custom amount entered, **When** user shares calculation, **Then** URL preserves custom amount
3. **Given** user enters 1,500,000 VND, **When** calculation performed, **Then** entire 1.5M reduces taxable income
4. **Given** custom amount entered, **When** toggle disabled/re-enabled, **Then** custom amount is retained

---

### User Story 3 - Display Tax-Exempt Lunch Allowance in Results (Priority: P3)

Users see clear breakdown showing lunch allowance as tax-exempt income that reduced their tax burden.

**Why this priority**: Enhances transparency but calculation works without detailed display.

**Independent Test**: Enable lunch allowance and verify results show: (1) lunch allowance amount, (2) tax-exempt label, (3) explanation that it reduced taxable income.

**Acceptance Scenarios**:

1. **Given** lunch allowance is 730K, **When** viewing results, **Then** breakdown shows 730K as tax-exempt income
2. **Given** lunch allowance is 1.5M, **When** viewing results, **Then** breakdown shows full 1.5M as tax-exempt
3. **Given** lunch allowance enabled, **When** viewing comparison mode, **Then** both regimes include lunch allowance reducing taxable income
4. **Given** lunch allowance enabled, **When** viewing results, **Then** explanation shows it reduced tax liability (not added to final NET)

---

---

### Edge Cases

- **Zero or negative values**: What happens when a user enters 0 or a negative value for lunch allowance? System should either prevent invalid input or treat zero as disabled.
- **Very large values**: How does the system handle lunch allowance values in the billions (e.g., 1,000,000,000 VND)? Should accept and treat as fully tax-exempt (valid for high-level positions at foreign companies), but may want to add a warning for unrealistic values.
- **Decimal values**: Can users enter decimal amounts (e.g., 729,999.50 VND)? System should handle decimals or round appropriately.
- **State persistence**: What happens if a user enables lunch allowance, closes the browser, and returns? The state should persist based on URL parameters (same as other calculator inputs).
- **Interaction with other allowances**: If future features add other tax-exempt allowances, how do they combine? (This spec assumes lunch allowance is the first such feature, but architecture should allow for future expansion.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a toggle control to enable/disable tax-exempt lunch allowance in the salary calculation
- **FR-002**: System MUST apply a default lunch allowance value of 730,000 VND when the toggle is enabled
- **FR-003**: System MUST allow users to customize the lunch allowance amount via an editable input field labeled "Trợ cấp ăn trưa không chịu thuế" (Tax-Exempt Lunch Allowance)
- **FR-004**: System MUST treat the entire lunch allowance amount as tax-exempt income, regardless of value (no threshold limit)
- **FR-005**: System MUST add the full tax-exempt lunch allowance to the final net salary (not to gross taxable income)
- **FR-006**: System MUST persist lunch allowance state (enabled/disabled and custom amount) in the URL for sharing and bookmarking
- **FR-007**: System MUST restore lunch allowance state from URL parameters when loading a shared calculation
- **FR-008**: System MUST recalculate net salary immediately when lunch allowance is enabled, disabled, or the amount is changed
- **FR-009**: System MUST display lunch allowance in the calculation breakdown, clearly showing it as fully tax-exempt income
- **FR-010**: System MUST include lunch allowance in comparison mode calculations for all tax regimes as tax-exempt income
- **FR-011**: System MUST validate lunch allowance input to accept only non-negative numeric values
- **FR-012**: System MUST maintain the custom lunch allowance amount when the toggle is disabled and re-enabled within the same session

### Key Entities

- **Tax-Exempt Lunch Allowance**: A monetary benefit provided by employers for meals during work hours, fully exempt from personal income tax
  - Attributes: amount (VND), enabled status
  - Tax treatment: Entire amount is tax-exempt (no threshold or cap)
  - Relationship: Added directly to final net salary after all tax calculations, does not affect gross taxable income

- **Salary Calculation Result**: Extended to include tax-exempt lunch allowance component
  - New attribute: taxExemptLunchAllowance (full amount entered by user)
  - Updated calculation flow: Final Net Salary = (Gross Salary - Insurance - Tax - Union Dues) + Tax-Exempt Lunch Allowance
  - Note: Lunch allowance does NOT increase gross taxable income

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enable lunch allowance and see updated net salary calculation in under 5 seconds (instant recalculation)
- **SC-002**: 95% of users who enable lunch allowance use the default 730,000 VND value without modification (validates default choice)
- **SC-003**: Users can successfully share calculations with lunch allowance enabled, and recipients see identical results when opening the shared link
- **SC-004**: System correctly handles lunch allowance amounts from 0 to 10,000,000 VND, treating all amounts as fully tax-exempt
- **SC-005**: Calculation results clearly show lunch allowance as tax-exempt income added to final net salary (not affecting gross taxable income)
- **SC-006**: Users report improved accuracy in net salary calculations when comparing with actual payslips that include lunch allowance (qualitative measure from user feedback)

## Assumptions

1. **Tax-exempt status**: Based on current Vietnamese tax regulations for foreign companies and modern tax practices, lunch allowance is treated as fully tax-exempt income regardless of amount. The 730,000 VND is a common default value, NOT a tax threshold.

2. **Default value choice**: 730,000 VND is chosen as the default because it's a common amount offered by Vietnamese companies, making it convenient for most users (not because it's a regulatory limit).

3. **Single allowance type**: This spec assumes lunch allowance is a distinct benefit. If companies combine multiple meal allowances (breakfast, lunch, dinner), users would enter the total combined amount.

4. **Monthly calculation**: The allowance is treated as a monthly benefit consistent with the calculator's monthly salary focus. Daily or per-meal breakdowns are out of scope.

5. **No pro-rating**: The calculator does not pro-rate lunch allowance for partial months (e.g., new employees starting mid-month). Users would manually adjust the amount if needed.

6. **Interaction with existing logic**: The lunch allowance feature integrates with the existing calculator by adding to the final net salary AFTER all tax calculations, without modifying core tax calculation formulas or gross income.

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
