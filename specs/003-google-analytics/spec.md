# Feature Specification: Add Google Analytics Tracking

**Feature Branch**: `003-google-analytics`  
**Created**: 2025-11-06  
**Status**: Draft  
**Input**: User description: "Thêm Google Analytics vào để thống kê tình hình sử dụng của trang web"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Track Page Views and Basic Usage (Priority: P1)

As the website owner, I want to track how many users visit the site, which pages they view, and basic usage patterns so that I can understand user engagement and make data-driven decisions about the product.

**Why this priority**: Understanding basic traffic patterns is the foundation for all analytics insights. Without page view tracking, we have no visibility into site usage.

**Independent Test**: Can be fully tested by visiting the site, navigating between pages (calculator input, comparison view), and verifying that page views appear in Google Analytics dashboard. Delivers immediate value by showing traffic volume and popular features.

**Acceptance Scenarios**:

1. **Given** a user visits the homepage, **When** the page loads, **Then** a page view event is recorded in Google Analytics with the page title and URL
2. **Given** a user navigates from 2025 view to 2026 view, **When** the view mode changes, **Then** a virtual page view or event is tracked showing the mode switch
3. **Given** a user visits the comparison view, **When** they view results, **Then** the page view is tracked with appropriate page metadata

---

### User Story 2 - Track User Interactions and Events (Priority: P2)

As the website owner, I want to track specific user interactions (salary calculations, preset button clicks, regime switches, sharing actions) so that I can understand which features are most used and optimize the user experience.

**Why this priority**: Event tracking provides deeper insights than page views alone, showing how users actually interact with the calculator features. This helps prioritize future enhancements.

**Independent Test**: Can be tested by performing various actions (clicking preset buttons, changing regions, calculating salary, copying results) and verifying corresponding events appear in Google Analytics with correct parameters.

**Acceptance Scenarios**:

1. **Given** a user clicks a salary preset button (e.g., 30M), **When** the button is clicked, **Then** an event is tracked with category "Interaction", action "Preset Click", and label showing the amount
2. **Given** a user calculates their net salary, **When** they change any input (gross, dependents, region), **Then** a "Calculate" event is tracked
3. **Given** a user shares results via URL or copies details, **When** they use share/copy functionality, **Then** a "Share" event is tracked with the method used
4. **Given** a user switches between 2025, 2026, or Compare modes, **When** the regime changes, **Then** an event tracks the regime selection

---

### User Story 3 - Track Performance and User Experience Metrics (Priority: P3)

As the website owner, I want to track page load times, interaction delays, and user experience metrics so that I can identify and fix performance issues that affect user satisfaction.

**Why this priority**: Performance tracking helps maintain a fast, responsive user experience but is less critical than basic usage tracking. This is an enhancement once core tracking is in place.

**Independent Test**: Can be tested by loading the site on different connections/devices and verifying that page load times, calculation performance, and interaction metrics are captured in Google Analytics.

**Acceptance Scenarios**:

1. **Given** a user loads the calculator page, **When** the page finishes loading, **Then** page load time is tracked as a timing metric
2. **Given** a user performs a salary calculation, **When** the calculation completes, **Then** the calculation time is tracked (should be <100ms)
3. **Given** a user navigates the site, **When** they interact with UI elements, **Then** interaction delays (if any) are tracked for performance monitoring

---

### Edge Cases

- What happens when a user has ad blockers or tracking blockers enabled?
  - System should gracefully handle blocked analytics without breaking functionality
  - No errors shown to user, calculator continues to work normally
  
- What happens when the user is offline or analytics fails to load?
  - System should not wait for analytics to initialize before showing content
  - Calculator functionality must work independently of analytics
  
- What happens to user privacy and data retention?
  - No personally identifiable information (PII) should be tracked (no IP addresses stored, no user identification)
  - Respect user privacy preferences and GDPR requirements
  - Data anonymization should be enabled in Google Analytics settings

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST integrate Google Analytics 4 (GA4) tracking code into the web application
- **FR-002**: System MUST track page views for all main routes (home, calculator views, comparison mode)
- **FR-003**: System MUST track custom events for key user interactions:
  - Salary calculation performed
  - Preset button clicked (with amount)
  - Region selection changed
  - Regime mode switched (2025, 2026, Compare)
  - Share URL clicked
  - Copy details clicked
  - Insurance base mode toggled
- **FR-004**: System MUST track virtual page views when view mode changes (2025, 2026, Compare) without actual navigation
- **FR-005**: System MUST NOT track any personally identifiable information (PII) such as actual salary amounts entered by users
- **FR-006**: System MUST load analytics asynchronously to avoid blocking page rendering
- **FR-007**: System MUST handle analytics failures gracefully without affecting calculator functionality
- **FR-008**: System MUST respect user privacy by:
  - Enabling IP anonymization in GA4
  - Not storing sensitive calculation inputs
  - Only tracking interaction patterns, not specific user data
- **FR-009**: System SHOULD track performance metrics (page load time, calculation time) using GA4 custom metrics

### Key Entities

- **Page View Event**: Represents a user viewing a page or switching view modes, containing page title, URL path, and timestamp
- **Interaction Event**: Represents a user action such as clicking a button, changing a setting, or performing a calculation, containing event category, action type, label, and value (if applicable)
- **Performance Timing**: Represents performance measurements such as page load time, calculation duration, and interaction response time

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Google Analytics dashboard shows page view data within 24 hours of deployment
- **SC-002**: All key user interactions (calculation, preset clicks, regime switches) are tracked as custom events visible in GA4
- **SC-003**: Page load performance does not degrade (remains under 3 seconds) with analytics enabled
- **SC-004**: Analytics tracking works on at least 95% of visitors (accounting for ad blockers)
- **SC-005**: Zero tracking-related JavaScript errors appear in browser console for normal users
- **SC-006**: Website owner can view weekly/monthly traffic reports showing:
  - Total visits and unique users
  - Most popular features (by interaction events)
  - Average session duration
  - Bounce rate and page views per session

## Assumptions

- Google Analytics 4 (GA4) property is already created or will be created by the website owner
- Measurement ID (G-XXXXXXXXXX) will be provided for configuration
- Basic understanding of GA4 dashboard is available to interpret analytics data
- Users accessing the site are primarily Vietnamese users based in Vietnam
- No legal restrictions prevent using Google Analytics in the target market
- Standard web analytics tracking is acceptable within privacy policy terms

## Dependencies

- Google Analytics 4 account and property setup (external)
- Measurement ID configuration value
- No backend required (client-side tracking only)

## Out of Scope

- Setting up Google Analytics account/property (assumed to exist)
- Advanced analytics features like custom dimensions beyond basic events
- Integration with other analytics platforms (Facebook Pixel, etc.)
- A/B testing or experiment tracking
- E-commerce tracking (not applicable to this calculator)
- User authentication or session replay features
- Heatmap or scroll tracking tools
- Cookie consent banner (assumes basic analytics consent)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Ad blockers prevent tracking | Medium - Loss of some analytics data | High (30-40% of users) | Accept data loss, focus on trends from available data. Calculator functionality unaffected. |
| Analytics script load failures | Low - No user impact, only data loss | Low | Implement error handling, async loading, graceful degradation |
| Privacy concerns from users | Medium - Reputation impact | Low | Use IP anonymization, don't track PII, be transparent in privacy policy |
| Page performance degradation | High - User experience impact | Low | Load analytics asynchronously, test performance before/after |
