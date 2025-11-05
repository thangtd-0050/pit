# Feature Specification: Fix 2026 Tax Regime Rates# Feature Specification: [FEATURE NAME]



**Feature Branch**: `002-fix-2026-tax-rates`

**Created**: 2025-11-05

**Status**: Complete

**Input**: User description: "Sửa mức thuế thu nhập cá nhân năm 2026 từ 5%-10%-15%-20%-35% thành 5%-15%-25%-30%-35% theo đúng quy định pháp luật"**Input**: User description: "$ARGUMENTS"



## User Scenarios & Testing *(mandatory)*## User Scenarios & Testing *(mandatory)*



### User Story 1 - Correct 2026 Tax Calculations (Priority: P1)<!--

  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.

A user calculating their net salary using the 2026 tax regime expects the system to apply the correct progressive tax rates as defined by Vietnamese tax law for 2026 and beyond. Currently, the system applies incorrect rates (5%, 10%, 15%, 20%, 35%), but the law specifies (5%, 15%, 25%, 30%, 35%).  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,

  you should still have a viable MVP (Minimum Viable Product) that delivers value.

**Why this priority**: This is a critical bug that produces incorrect tax calculations for all users using the 2026 regime. The calculator's core value is accuracy - incorrect tax rates make the entire 2026 calculation feature unusable and misleading.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.

**Independent Test**: Can be fully tested by entering any gross salary amount, selecting 2026 regime, and verifying that the tax breakdown shows rates of 5%, 15%, 25%, 30%, 35% applied to the correct income brackets (0-10M, 10-30M, 30-60M, 60-100M, >100M). Delivers value by ensuring accurate tax calculations.  Think of each story as a standalone slice of functionality that can be:

  - Developed independently

**Acceptance Scenarios**:  - Tested independently

  - Deployed independently

1. **Given** I enter a gross salary of 50,000,000 VND with 2 dependents in Region I, **When** I select "2026" regime mode, **Then** the tax breakdown shows:  - Demonstrated to users independently

   - Bậc 1 (0-10M @ 5%): 500,000 VND-->

   - Bậc 2 (10-30M @ 15%): 3,000,000 VND

   - Bậc 3 (30-60M @ 25%): calculated on remaining taxable income @ 25%### User Story 1 - [Brief Title] (Priority: P1)

   - Total tax matches the corrected rate structure

[Describe this user journey in plain language]

2. **Given** I enter a gross salary of 150,000,000 VND with 0 dependents in Region I, **When** I select "2026" regime, **Then** I see all 5 tax brackets applied correctly:

   - Bậc 1: 0-10M @ 5%**Why this priority**: [Explain the value and why it has this priority level]

   - Bậc 2: 10-30M @ 15%

   - Bậc 3: 30-60M @ 25%**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

   - Bậc 4: 60-100M @ 30%

   - Bậc 5: >100M @ 35%**Acceptance Scenarios**:



3. **Given** I am in "Compare 2025 ↔ 2026" mode with gross salary 80,000,000 VND, **When** I view the comparison, **Then** the 2026 column shows different tax amounts than before the fix, reflecting the corrected rates (15%, 25%, 30% instead of 10%, 15%, 20%)1. **Given** [initial state], **When** [action], **Then** [expected outcome]

2. **Given** [initial state], **When** [action], **Then** [expected outcome]

4. **Given** I have a saved/shared URL from before the fix with 2026 regime parameters, **When** I open that URL after the fix is deployed, **Then** the calculation automatically updates to use the corrected tax rates without requiring me to re-enter data

---

---

### User Story 2 - [Brief Title] (Priority: P2)

### User Story 2 - Verify Tax Documentation (Priority: P2)

[Describe this user journey in plain language]

A user wants to understand how their 2026 taxes are calculated and expects the system to clearly show the correct tax rates in any documentation, tooltips, or help text.

**Why this priority**: [Explain the value and why it has this priority level]

**Why this priority**: While fixing the calculation logic is critical (P1), ensuring that all supporting documentation and UI text reflects the correct rates is important for user trust and understanding.

**Independent Test**: [Describe how this can be tested independently]

**Independent Test**: Can be tested by reviewing all places where 2026 tax rates are mentioned (tooltips, help text, README, footer disclaimers) and verifying they all show 5%-15%-25%-30%-35%. Delivers value by providing accurate information to users.

**Acceptance Scenarios**:

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

1. **Given** I hover over the PIT breakdown section in 2026 mode, **When** a tooltip or info icon is available, **Then** it displays the correct 5-bracket structure with accurate rates

---

2. **Given** I read the README or documentation, **When** I find the section explaining 2026 tax brackets, **Then** the table shows:

   - 0-10M: 5%### User Story 3 - [Brief Title] (Priority: P3)

   - 10-30M: 15%

   - 30-60M: 25%[Describe this user journey in plain language]

   - 60-100M: 30%

   - >100M: 35%**Why this priority**: [Explain the value and why it has this priority level]



3. **Given** I view the footer disclaimer or "About" section, **When** it mentions 2026 tax regime, **Then** it references the correct rate structure**Independent Test**: [Describe how this can be tested independently]



---**Acceptance Scenarios**:



### Edge Cases1. **Given** [initial state], **When** [action], **Then** [expected outcome]



- What happens when a user has a calculation result saved/bookmarked from before the fix?---

  - System should automatically recalculate with corrected rates; URL parameters restore inputs but calculation uses current constants

[Add more user stories as needed, each with an assigned priority]

- What happens if taxable income falls exactly on a bracket boundary (e.g., exactly 10,000,000)?

  - System should correctly handle boundary (first VND of each bracket taxed at new rate, not previous rate)### Edge Cases



- What happens when comparing 2025 vs 2026 with the corrected rates?<!--

  - Delta calculations should show accurate differences; 2026 may now show higher taxes in middle brackets (15% vs 10%, 25% vs 15%) despite higher deductions  ACTION REQUIRED: The content in this section represents placeholders.

  Fill them out with the right edge cases.

- What happens to existing unit tests that assert specific tax amounts?-->

  - Test assertions must be updated to expect new calculated values based on corrected rates

- What happens when [boundary condition]?

## Requirements *(mandatory)*- How does system handle [error scenario]?



### Functional Requirements## Requirements *(mandatory)*



- **FR-001**: System MUST update REGIME_2026 tax bracket rates to: 0.05, 0.15, 0.25, 0.30, 0.35 (currently incorrect: 0.05, 0.10, 0.15, 0.20, 0.35)<!--

  ACTION REQUIRED: The content in this section represents placeholders.

- **FR-002**: System MUST maintain the 5-bracket structure for 2026 with thresholds: 10M, 30M, 60M, 100M, infinity (these are correct, only rates are wrong)  Fill them out with the right functional requirements.

-->

- **FR-003**: System MUST recalculate all 2026 regime results using the corrected tax rates immediately upon fix deployment

### Functional Requirements

- **FR-004**: System MUST update any unit tests that assert specific 2026 tax amounts to expect values calculated with corrected rates

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]

- **FR-005**: System MUST ensure the tax calculation function (calcPit) correctly applies the updated rates from the constants file without requiring code changes- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]

- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]

- **FR-006**: System MUST display the corrected rates (5%, 15%, 25%, 30%, 35%) in the PIT breakdown labels when showing 2026 regime results- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]

- **FR-005**: System MUST [behavior, e.g., "log all security events"]

- **FR-007**: System MUST produce accurate delta comparisons between 2025 and 2026 regimes using the corrected 2026 rates

*Example of marking unclear requirements:*

- **FR-008**: All documentation (README.md, code comments, help text, tooltips) that references 2026 tax rates MUST be updated to show 5%-15%-25%-30%-35%

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]

### Key Entities- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]



- **Tax Regime (REGIME_2026)**: Configuration object containing 2026 tax rules with 5 progressive brackets. Each bracket has a threshold (income ceiling in VND) and a rate (percentage as decimal). Currently has incorrect rates that must be corrected.### Key Entities *(include if feature involves data)*



- **Tax Bracket**: Individual slab within the 2026 progressive tax structure. Contains:- **[Entity 1]**: [What it represents, key attributes without implementation]

  - Threshold: Upper bound of income for this bracket (10M, 30M, 60M, 100M, or infinity)- **[Entity 2]**: [What it represents, relationships to other entities]

  - Rate: Tax percentage applied to income within this bracket (must be corrected to 0.05, 0.15, 0.25, 0.30, 0.35)

## Success Criteria *(mandatory)*

## Success Criteria *(mandatory)*

<!--

### Measurable Outcomes  ACTION REQUIRED: Define measurable success criteria.

  These must be technology-agnostic and measurable.

- **SC-001**: 100% of 2026 tax calculations use the corrected rates (5%, 15%, 25%, 30%, 35%) with zero instances of old rates (10%, 15%, 20%)-->



- **SC-002**: All existing unit tests for 2026 calculations pass with updated assertions (or new tests added if coverage gaps exist)### Measurable Outcomes



- **SC-003**: Manual verification confirms that a sample calculation (e.g., 50M gross, 2 deps, Region I, 2026 mode) produces the mathematically correct tax amount using new rates- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]

- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]

- **SC-004**: Comparison mode delta calculations show accurate differences between 2025 and 2026 regimes with corrected 2026 rates- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]

- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

- **SC-005**: 100% of references to 2026 tax rates in documentation, README, code comments, and UI text display the corrected rate structure (verified by text search for "2026" or "brackets")

- **SC-006**: Users opening previously shared URLs with 2026 parameters see updated calculations reflecting corrected rates without errors or stale cached values

## Assumptions *(optional)*

- The 2026 tax bracket thresholds (10M, 30M, 60M, 100M, infinity) are correct; only the rates are incorrect
- The personal deduction (15,500,000 VND) and dependent deduction (6,200,000 VND) for 2026 are correct
- The corrected rates (5%, 15%, 25%, 30%, 35%) are the legally accurate rates for Vietnam's 2026+ tax regime
- All calculations use the constants defined in `src/config/constants.ts`, so updating that file will propagate the fix throughout the application
- The calcPit() function correctly iterates through brackets and applies rates from the regime object without hardcoded values
- Users expect immediate calculation updates and understand that previously saved/shared calculations may show different results after the fix

## Out of Scope *(optional)*

- Changes to 2025 regime (those rates are correct and should not be modified)
- Changes to bracket thresholds (only rates are being corrected)
- Changes to deduction amounts (15.5M personal, 6.2M dependent are correct)
- Notification system to alert users that calculations may differ from previous versions
- Historical versioning or rollback capability for tax constants
- Support for pre-2025 or post-2026 tax regimes

## Dependencies & Constraints *(optional)*

### External Dependencies

- None - this is a pure constants update

### Technical Constraints

- Change must be made in single constants file: `src/config/constants.ts`
- All unit tests must pass after update (tests need assertion updates)
- No database or backend updates required (client-side only)
- Must maintain backwards compatibility with URL state encoding/decoding

### Legal & Compliance Constraints

- Corrected rates must accurately reflect Vietnamese Personal Income Tax Law for 2026 and beyond
- A disclaimer should note that tax laws can change and users should verify with official sources (already exists)
- Constants file should include a comment documenting the source/authority for the 2026 rates

### Business Constraints

- Fix must be deployed as soon as possible to prevent continued misinformation
- No data migration required (all calculations are performed on-demand)
- No user notification needed beyond standard release notes/changelog

## Risks & Mitigations *(optional)*

### Risk 1: Incorrect Rate Values After Fix
**Impact**: High - If we apply the wrong "corrected" rates, we perpetuate misinformation
**Probability**: Low - Rates are clearly specified by user who found the bug
**Mitigation**:
- Verify corrected rates (5%, 15%, 25%, 30%, 35%) against official Vietnam tax law documentation
- Cross-reference with government decree or official tax authority publications
- Include source citation in constants.ts comment
- Manual testing with known-correct payslip examples

### Risk 2: Breaking Unit Tests
**Impact**: Medium - CI/CD may block deployment if tests fail
**Probability**: High - Tests likely assert specific tax amounts that will change
**Mitigation**:
- Update test assertions proactively as part of the fix
- Ensure tests use dynamic calculation rather than hardcoded expected values where possible
- Add new test cases specifically for 2026 rate verification
- Run full test suite before committing

### Risk 3: User Confusion About Changed Results
**Impact**: Low - Users may notice different calculations for same inputs
**Probability**: Medium - Users with saved URLs will see different results
**Mitigation**:
- Add note in README changelog documenting the bug fix
- Include "Last Updated" date in footer (already exists)
- Prominent disclaimer that calculator is for reference only
- Consider adding a small banner/alert for first week after deployment explaining the fix

### Risk 4: Comparison Mode Shows Unexpected Deltas
**Impact**: Low - Middle-income users may see 2026 as less favorable than expected
**Probability**: High - Corrected rates (15%, 25%) are higher than incorrect rates (10%, 15%) for middle brackets
**Mitigation**:
- Ensure delta calculations are mathematically correct
- Verify that comparison tooltips explain both deductions (favorable) and rates (less favorable) changes
- Document that 2026 regime has both benefits (higher deductions) and trade-offs (some higher rates)
