# Feature Specification: Update 2026 Regulations

**Feature Branch**: `006-update-2026-regulations`
**Created**: 2025-11-19
**Status**: Draft
**Input**: User description: "Theo quy định mới nhất, chính phủ đã chốt tăng mức lương tối thiểu vùng từ 1/1/2026. Cụ thể, mức mới là Vùng I: 5.310.000; Vùng II: 4.730.000; Vùng III: 4.140.000; Vùng IV: 3.700.000. Điều này sẽ ảnh hưởng đến mức sàn đóng BHXH/BHYT/BHTN (tăng lên). Ngoài ra cũng từ 2026, trần tiền lương đóng BHTN được tính bằng 20 × lương tối thiểu vùng (thay vì mức lương cơ sở). Theo đó mức trần đóng BHTN cũng sẽ thay đổi (tăng lên). Hãy cập nhật những thay đổi này vào công thức tính lương từ năm 2026 giúp tôi. Đồng thời, do những thay đổi từ năm 2026 là khá nhiều, thế nên hãy giúp tôi thêm các chú thích, tooltip, giải thích chi tiết vào trong UI nhé."

## User Scenarios & Testing

### User Story 1 - Calculate Salary with 2026 Regulations (Priority: P1)

As a user, I want the salary calculator to apply the new 2026 regulations (new minimum wages and insurance caps) so that my net salary estimation is accurate for the upcoming year.

**Why this priority**: This is the core functional change required by the new government regulations. Without this, the calculator will be obsolete for 2026 planning.

**Independent Test**: Can be tested by selecting the year 2026 (or effective date) and verifying that the insurance calculations use the new Regional Minimum Wage (RMW) values and the updated Unemployment Insurance (BHTN) ceiling formula.

**Acceptance Scenarios**:

1. **Given** the effective period is set to 2026 (or later), **When** I enter a gross salary, **Then** the system uses the new Regional Minimum Wages (Region I: 5.31M, II: 4.73M, III: 4.14M, IV: 3.7M) to determine the floor for BHXH, BHYT, and BHTN.
2. **Given** the effective period is set to 2026, **When** I enter a high gross salary (exceeding the cap), **Then** the BHTN contribution is capped at 1% of (20 * Regional Minimum Wage), not the Base Salary.
3. **Given** the effective period is set to 2026, **When** I switch between regions, **Then** the BHTN ceiling updates dynamically based on that region's new minimum wage.

---

### User Story 2 - View Explanations for 2026 Changes (Priority: P2)

As a user, I want to see clear explanations and tooltips about the 2026 changes so that I understand why the calculations might differ from previous years.

**Why this priority**: The changes are significant and might confuse users accustomed to the old formulas. Explanations build trust and clarity.

**Independent Test**: Can be tested by hovering over the insurance fields or looking for "New" badges/icons in the UI when 2026 mode is active.

**Acceptance Scenarios**:

1. **Given** I am viewing the calculator in 2026 mode, **When** I hover over the "Unemployment Insurance" (BHTN) field or label, **Then** I see a tooltip explaining that the ceiling is now calculated as 20x Regional Minimum Wage.
2. **Given** I am viewing the calculator in 2026 mode, **When** I hover over the "Social Insurance" (BHXH) or "Health Insurance" (BHYT) fields, **Then** I see a tooltip or note mentioning the updated minimum wage floor if applicable.
3. **Given** I am viewing the calculator, **When** the 2026 regulations are applied, **Then** there is a visual indicator (e.g., an info icon or text) highlighting that "2026 Regulations" are in effect.

### Edge Cases

- What happens when the user enters a salary exactly equal to the new RMW? (Should apply floor logic correctly)
- How does the system handle the transition period if a user selects a date exactly on Jan 1, 2026? (Should use new rules)

## Requirements

### Functional Requirements

- **FR-001**: System MUST support a "2026" calculation mode (or effective date selector) that applies regulations effective from Jan 1, 2026.
- **FR-002**: System MUST use the following Regional Minimum Wage (RMW) values for 2026:
    - Region I: 5,310,000 VND
    - Region II: 4,730,000 VND
    - Region III: 4,140,000 VND
    - Region IV: 3,700,000 VND
- **FR-003**: System MUST calculate the minimum contribution (floor) for BHXH, BHYT, and BHTN based on the applicable Regional Minimum Wage for 2026.
- **FR-004**: System MUST calculate the maximum contribution (ceiling) for Unemployment Insurance (BHTN) as 20 times the Regional Minimum Wage for 2026.
- **FR-005**: System MUST display tooltips or inline explanations for the BHTN ceiling change (20x RMW) and the new RMW values when 2026 regulations are active.
- **FR-006**: System MUST allow users to switch between the current (2024/2025) and new (2026) regulations to compare results (or simply select the year).

### Key Entities

- **TaxConfiguration**: Stores the configuration for a specific period (Year/Effective Date), including RMW values, Base Salary, and formulas for caps/floors.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Calculations for 2026 exactly match the government's specified values for RMW and BHTN ceiling logic.
- **SC-002**: Users can identify the active regulation year (2026 vs previous) within the UI.
- **SC-003**: Tooltips regarding the 2026 changes are accessible and readable on both desktop and mobile views.
