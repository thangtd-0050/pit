# Feature Specification: Vietnam Gross-to-Net Salary Calculator

**Feature Branch**: `001-gross-net-calculator`
**Created**: 2025-11-05
**Status**: Draft
**Input**: User description: "Vietnam Gross to Net Salary Calculator - Web App"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Salary Calculation (Priority: P1)

A Vietnamese employee or HR professional wants to quickly understand how much net salary they will receive after insurance and tax deductions for a given gross salary amount.

**Why this priority**: This is the core value proposition of the application. Without this functionality, the application serves no purpose. Users need accurate, instant calculations to make informed salary decisions or negotiations.

**Independent Test**: Can be fully tested by entering a gross salary amount and viewing the calculated net salary with full breakdown of insurance and tax deductions. Delivers immediate value as a functional calculator.

**Acceptance Scenarios**:

1. **Given** I am on the calculator page, **When** I enter a gross salary of 30,000,000 VND with 2 dependents in Region I, **Then** I see the net salary calculated with itemized deductions for insurance (BHXH, BHYT, BHTN) and progressive income tax
2. **Given** I have entered a valid gross salary, **When** I change the number of dependents from 2 to 0, **Then** the net salary immediately recalculates showing increased taxable income and higher tax
3. **Given** I am viewing calculation results, **When** I change the region from I to IV, **Then** insurance calculations update based on the new regional minimum wage
4. **Given** I enter a gross salary using different number formats (185,000,000 or 185000000 or 185_000_000), **When** the input field loses focus, **Then** the system sanitizes and accepts the input correctly

---

### User Story 2 - Compare Tax Regimes (Priority: P2)

A user wants to understand how changes in Vietnam's tax law (from 2025 regime to 2026 regime) will affect their take-home salary, so they can plan their finances accordingly.

**Why this priority**: This is a unique differentiator that provides significant value by showing side-by-side comparison of old vs new tax rules. However, the basic calculator must work first before comparisons make sense.

**Independent Test**: Can be tested independently by selecting "Compare 2025 ↔ 2026" mode and viewing two result cards showing different deductions and tax calculations with delta highlights. Delivers value as a planning tool.

**Acceptance Scenarios**:

1. **Given** I have entered my gross salary and details, **When** I select "Compare 2025 ↔ 2026" mode, **Then** I see two cards showing calculations under both tax regimes with a delta summary card highlighting differences
2. **Given** I am viewing the comparison, **When** the 2026 regime results in lower total tax, **Then** the delta shows positive changes in green (better for me) with the exact difference amount
3. **Given** I am comparing regimes, **When** I expand the details section, **Then** I see the complete step-by-step breakdown for both regimes including different personal deduction amounts (11M vs 15.5M) and different tax brackets
4. **Given** I view the delta summary, **When** insurance amounts are identical between regimes, **Then** the delta for insurance shows 0 with neutral styling

---

### User Story 3 - Custom Insurance Base (Priority: P3)

An employee whose company uses a different insurance contribution base (not equal to gross salary) wants to calculate their net salary using a custom insurance base that still respects legal floors and caps.

**Why this priority**: This handles a real but less common scenario. Many companies use gross salary as the insurance base, making this an advanced feature for specific users.

**Independent Test**: Can be tested independently by selecting "Custom" insurance base mode, entering a custom amount, and verifying that the system applies appropriate floor/cap validations while calculating insurance correctly. Delivers value for accurate calculations in non-standard situations.

**Acceptance Scenarios**:

1. **Given** I am on the calculator page, **When** I select "Custom" insurance base mode, **Then** a new input field appears for me to enter a custom insurance base amount
2. **Given** I have entered a custom insurance base below the regional minimum wage, **When** the calculation runs, **Then** the system automatically applies the floor and shows a helper message explaining the adjustment
3. **Given** I have entered a custom insurance base above the legal cap (20× base salary for SI/HI), **When** the calculation runs, **Then** the system applies the cap and displays which cap was applied
4. **Given** I enter a custom base of 50,000,000 VND in Region I with gross of 100,000,000, **When** I view results, **Then** insurance is calculated on the custom base (capped appropriately) while tax is calculated on the full gross minus those insurance amounts

---

### User Story 4 - Share and Save Results (Priority: P4)

A user wants to share their calculation results with a colleague, manager, or financial advisor, or bookmark specific scenarios for future reference.

**Why this priority**: This enhances usability and collaboration but the calculator must work first. This is a convenience feature that increases user retention.

**Independent Test**: Can be tested independently by performing a calculation, clicking "Share link", verifying the URL contains all input parameters, and confirming that loading that URL recreates the exact same results. Delivers value as a sharing/bookmarking tool.

**Acceptance Scenarios**:

1. **Given** I have completed a calculation with specific inputs (gross=185M, deps=2, region=I, compare mode), **When** I click the "Share link" button, **Then** the browser URL updates to include all parameters as query strings
2. **Given** I have a shared URL with encoded parameters, **When** I open that URL in a new browser tab, **Then** the calculator loads with all the same inputs and displays identical results
3. **Given** I am viewing calculation results, **When** I click "Copy details", **Then** a formatted text version of the calculation (including all breakdown steps) is copied to my clipboard
4. **Given** I have copied calculation details, **When** I paste into a text document or email, **Then** the formatting is preserved and human-readable with clear labels for each component

---

### User Story 5 - Visual Customization (Priority: P5)

A user wants to customize their viewing experience by choosing their preferred number format (Vietnamese vs English style) and enabling dark mode for comfortable viewing in different lighting conditions.

**Why this priority**: This is purely a user experience enhancement that doesn't affect core functionality. It increases user satisfaction but isn't required for the calculator to deliver value.

**Independent Test**: Can be tested independently by toggling between locale formats (en-US vs vi-VN) and dark mode, verifying that preferences persist across page reloads and all numbers display correctly in the chosen format. Delivers value as a personalization feature.

**Acceptance Scenarios**:

1. **Given** I open the calculator for the first time, **When** the page loads, **Then** all interface elements (labels, buttons, explanations, formulas) are displayed in Vietnamese
2. **Given** I am viewing results in default en-US format (1,234,567), **When** I switch to vi-VN format, **Then** all numbers immediately re-render as (1.234.567) with period separators
3. **Given** I have selected vi-VN format, **When** I refresh the page, **Then** the format preference is remembered (stored in localStorage) and automatically applied
4. **Given** I am viewing the calculator in light mode, **When** I toggle dark mode on, **Then** the entire interface switches to a dark color scheme with appropriate contrast for readability
5. **Given** I toggle detailed breakdown visibility off, **When** I view results, **Then** only the summary NET amount and totals are shown without the step-by-step calculations

---

### Edge Cases

- What happens when gross salary is extremely high (e.g., 1,000,000,000 VND)?
  - System should handle large numbers correctly, apply highest tax bracket (35% on amount above threshold), and display formatted results without overflow

- What happens when gross salary is very low (e.g., 3,000,000 VND below regional minimum)?
  - System should still calculate, insurance base will be clamped to regional minimum floor, resulting in insurance potentially higher than expected, may result in negative or zero taxable income

- What happens when user enters 0 dependents?
  - System should calculate correctly with only personal deduction, no dependent deduction

- What happens when custom insurance base equals exactly the cap threshold?
  - System should accept it as-is without adjustment, show no helper message about capping

- What happens when user enters non-numeric characters in salary fields?
  - System should sanitize input on blur, stripping out all non-digits except allowed separators (comma, underscore, space), convert to valid number

- What happens when taxable income becomes negative (gross too low or deductions too high)?
  - System should floor taxable income at 0, resulting in 0 tax, NET = gross - insurance only

- What happens when switching regions causes insurance base to exceed new cap?
  - System should immediately recalculate with new cap, potentially reducing insurance amounts

- What happens when URL contains invalid query parameters?
  - System should gracefully ignore invalid parameters, use default values, and still render functional calculator

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept gross monthly salary input as a positive number with support for various formatting (commas, underscores, spaces) and sanitize to digits on blur
- **FR-002**: System MUST provide quick preset buttons for common salary amounts (10M, 30M, 60M, 100M, 185M VND)
- **FR-003**: System MUST accept number of dependents as a non-negative integer with default value of 2
- **FR-004**: System MUST allow users to select one of four regions (I, II, III, IV) with default Region I
- **FR-005**: System MUST support two insurance base modes: "= Gross (default)" and "Custom" with conditional input field
- **FR-006**: System MUST provide three regime viewing modes: "2025 only", "2026 only", and "Compare 2025 ↔ 2026" (default)
- **FR-007**: System MUST calculate employee portion of insurance (BHXH 8%, BHYT 1.5%, BHTN 1%) based on clamped insurance bases
- **FR-008**: System MUST apply insurance base floors (regional minimum wage) and caps (20× base salary for SI/HI, 20× regional minimum for UI)
- **FR-009**: System MUST calculate personal deduction (11M for 2025, 15.5M for 2026) and dependent deduction (4M for 2025, 6.2M for 2026)
- **FR-010**: System MUST calculate taxable income as gross minus total deductions (personal + dependents + insurance), floored at 0
- **FR-011**: System MUST apply progressive income tax using regime-specific brackets (7 brackets for 2025, 5 brackets for 2026)
- **FR-012**: System MUST calculate NET salary as gross minus total insurance minus total PIT
- **FR-013**: System MUST display full breakdown showing: insurance bases with caps, each insurance component, family deductions, taxable income, tax by bracket, and final NET
- **FR-014**: System MUST show delta comparison when in Compare mode, highlighting differences in deductions, taxable income, total tax, and NET with color coding (green for better outcomes, red for worse)
- **FR-015**: System MUST provide "Copy details" button that copies formatted text explanation of calculation to clipboard
- **FR-016**: System MUST provide "Share link" button that encodes current state (gross, dependents, region, mode, format) into URL query parameters
- **FR-017**: System MUST restore calculator state from URL query parameters when page loads with valid parameters
- **FR-018**: System MUST display all user interface text, labels, buttons, error messages, and explanations in Vietnamese language as the primary target audience is Vietnamese users
- **FR-019**: System MUST use Vietnamese terminology for all calculation components (e.g., "Lương Gross", "Lương Net", "BHXH", "BHYT", "BHTN", "Thuế TNCN", "Giảm trừ gia cảnh", "Thu nhập chịu thuế")
- **FR-020**: System MUST provide detailed calculation explanations (formulas, step-by-step breakdowns, helper text) in Vietnamese
- **FR-021**: System MUST support two number format locales: en-US (1,234,567) and vi-VN (1.234.567) with persistence in localStorage
- **FR-022**: System MUST support dark mode toggle with preference persisted in localStorage
- **FR-023**: System MUST support show/hide detailed breakdown toggle for condensed view
- **FR-024**: System MUST perform all calculations client-side without any server requests
- **FR-025**: System MUST display helper text when custom insurance base is adjusted due to floor/cap constraints
- **FR-026**: System MUST round all monetary intermediate results to integer VND (no decimals)
- **FR-027**: System MUST display all monetary values with thousand separators based on selected locale
- **FR-028**: System MUST recalculate instantly when any input changes (debounced for performance)

### Key Entities

- **Tax Regime**: Represents a set of tax rules for a specific time period (2025 or 2026), containing personal deduction amount, dependent deduction amount, and progressive tax brackets with thresholds and rates

- **Tax Bracket**: A progressive income tax slab with a threshold amount (or infinity for the highest bracket) and an associated tax rate percentage

- **Insurance Bases**: The calculated amounts used for insurance contribution calculations, including separate bases for SI/HI (capped at 20× base salary) and UI (capped at 20× regional minimum wage), both floored at regional minimum wage

- **Region Configuration**: Regional settings containing the minimum wage for each of Vietnam's four regions (I, II, III, IV), used for insurance base floor/cap calculations

- **Calculation Result**: Complete breakdown of a salary calculation including input parameters, insurance components (SI, HI, UI with bases), deductions (personal, dependent, insurance totals), taxable income, PIT breakdown by bracket, and final NET salary

- **User Preferences**: Client-side settings including number format locale, dark mode toggle, and detailed view toggle, persisted in browser localStorage

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a basic salary calculation (enter gross, view net) in under 10 seconds from page load
- **SC-002**: Calculation results update instantly (within 100ms) when any input parameter changes
- **SC-003**: 100% of calculations produce mathematically accurate results matching official Vietnam tax and insurance formulas (verified by unit tests)
- **SC-004**: Users can successfully share calculation results via URL and reproduce identical results when the URL is opened (100% state restoration accuracy)
- **SC-005**: Application loads and functions completely offline after initial page load (zero network requests for calculations)
- **SC-006**: Application bundle size remains under 200KB gzipped for fast initial load
- **SC-007**: All interactive elements are fully accessible via keyboard navigation and screen readers (WCAG 2.1 Level AA compliance)
- **SC-008**: Application displays correctly on mobile devices (320px width) through desktop (1920px+ width) without horizontal scrolling
- **SC-009**: System correctly handles edge cases (gross salary from 0 to 1 billion VND, dependents from 0 to 20, all four regions) without errors
- **SC-010**: 100% of user-facing text (labels, buttons, explanations, formulas, error messages) is displayed in Vietnamese without any English text in the interface
- **SC-011**: Users can understand calculation methodology by viewing step-by-step breakdown with labeled components in Vietnamese

## Assumptions *(optional)*

- Primary target audience is Vietnamese-speaking users (employees, HR professionals in Vietnam)
- All interface content, labels, explanations, and help text will be displayed in Vietnamese language
- Users understand basic Vietnamese labor law concepts (BHXH, BHYT, BHTN, PIT, Giảm trừ gia cảnh)
- The calculator focuses only on employee portion of insurance contributions; employer portions are out of scope
- Legal constants (base salary 2,340,000 VND, regional minimum wages, tax brackets) are accurate as of 2025 and will be updated when laws change
- Calculations are performed on a monthly basis; annual calculations are out of scope for initial version
- All monetary amounts are in Vietnamese Dong (VND); no currency conversion needed
- Rounding uses standard Math.round() to nearest integer VND at each calculation step
- Browser localStorage is available for persisting user preferences
- Modern browsers with ES6+ JavaScript support are the target environment
- No user authentication or server-side data persistence is required
- Application will be deployed as a static site on GitHub Pages
- English language support is out of scope for initial version (may be added later via internationalization)

## Out of Scope *(optional)*

- English language interface or multi-language support (Vietnamese only for initial version)
- Employer portion of insurance calculations
- Yearly salary calculations (only monthly supported)
- Historical tax regime comparisons (before 2025)
- Social insurance benefit calculations (pension, maternity, etc.)
- Tax filing or submission functionality
- Multi-currency support
- User accounts or saved calculation history on server
- Email or print formatting of results
- Mobile native applications (iOS/Android)
- Integration with HR or payroll systems
- Real-time legal updates or notifications when laws change
- Tax optimization recommendations or financial advice
- Gross-to-net reverse calculation (net-to-gross solver)

## Dependencies & Constraints *(optional)*

### External Dependencies

- Modern web browser with JavaScript enabled (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection required only for initial page load (optional PWA for offline use)
- GitHub Pages for hosting static content

### Technical Constraints

- All calculations must be performed client-side (no backend API)
- Bundle size must remain under 200KB gzipped to ensure fast load times
- Application must work without cookies or server-side sessions
- URL query string length limited to ~2000 characters for sharing (browser limitation)
- localStorage size limited to ~5-10MB for preference storage

### Legal & Compliance Constraints

- Tax and insurance calculations must accurately reflect Vietnamese Labor Law and Personal Income Tax Law as of 2025/2026
- Legal constants (base salary, regional minimums, tax brackets, rates) must be easily updatable in a single configuration file
- Calculation methodology must be transparent and verifiable by users

### Business Constraints

- Application must be free to use with no monetization requirements
- No user data collection or analytics tracking by default (privacy-first approach)
- Open source under MIT license allowing free use and modification
- Disclaimers must clearly state the calculator is for reference purposes only and users should consult official sources or tax professionals

## Risks & Mitigations *(optional)*

### Risk 1: Legal Constants Change Mid-Year
**Impact**: High - Incorrect calculations could mislead users about their actual net salary
**Probability**: Medium - Vietnam tax laws can change with new government decrees
**Mitigation**:
- Centralize all legal constants in a single constants.ts file with clear documentation
- Include "Last Updated" date in footer showing when constants were last reviewed
- Add prominent disclaimer that calculator is for reference only
- Monitor official government sources for legal changes

### Risk 2: Browser Compatibility Issues
**Impact**: Medium - Users on older browsers may experience broken functionality
**Probability**: Low - Modern browser adoption is high
**Mitigation**:
- Use Vite with appropriate polyfills for ES6+ features
- Test on minimum supported browser versions (listed in constraints)
- Include browser compatibility notice if outdated browser detected
- Use progressive enhancement approach for advanced features

### Risk 3: Calculation Precision Errors
**Impact**: High - Incorrect tax/insurance calculations damage credibility
**Probability**: Low - With proper testing
**Mitigation**:
- Comprehensive unit test suite covering edge cases and all tax brackets
- Regression tests with known correct values for common scenarios
- Round at each calculation step to integer VND to avoid floating point errors
- Peer review of calculation logic against official formulas
- Test against real payslips from Vietnamese companies

### Risk 4: URL State Too Large for Sharing
**Impact**: Low - Share functionality may fail for complex scenarios
**Probability**: Very Low - Current state is minimal (5 parameters)
**Mitigation**:
- Use abbreviated parameter names in query string (g= for gross, d= for deps)
- Limit state to essential parameters only
- Fallback to default values if URL parsing fails
- Consider base64 encoding if needed

### Risk 5: Mobile Performance Issues
**Impact**: Medium - Poor mobile experience reduces accessibility
**Probability**: Low - With proper optimization
**Mitigation**:
- Code splitting to reduce initial bundle size
- Lazy loading of non-critical components
- Debounce input handlers to avoid excessive recalculations
- Test on low-end mobile devices
- Monitor bundle size with build-time checks
