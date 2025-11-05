<!--
Sync Impact Report - Version 1.0.0
=====================================
Version Change: Initial → 1.0.0
Rationale: Initial constitution ratification establishing foundational governance principles

Principles Added:
- I. Code Quality Excellence
- II. Testing-First Discipline (NON-NEGOTIABLE)
- III. Modern UI/UX Consistency
- IV. Performance-By-Design
- V. Security & Privacy Foundation
- VI. Maintainability & Technical Debt Management
- VII. Documentation & Knowledge Sharing

Sections Added:
- Core Principles (7 principles)
- Quality Standards
- Development Workflow
- Governance

Templates Status:
✅ plan-template.md - Constitution Check section aligns with principles
✅ spec-template.md - User stories and requirements structure supports testability
✅ tasks-template.md - Phase organization supports test-first and incremental delivery
⚠️  All command files - Verified for generic guidance (no agent-specific references found)

Follow-up TODOs: None
-->

# PIT (Project Implementation Toolkit) Constitution

## Core Principles

### I. Code Quality Excellence

**MUST** maintain high code quality standards across all implementation work:
- Code MUST be self-documenting with clear, intention-revealing names for functions, variables, and classes
- Complex logic MUST be broken into small, single-responsibility functions (max 50 lines per function)
- Code MUST follow language-specific idioms and best practices (linting tools enforced)
- All functions MUST have explicit type annotations (TypeScript, Python, etc.) or static type checking enabled
- Dead code, commented-out code, and unused imports MUST be removed before PR submission
- Code duplication MUST be eliminated through abstraction (DRY principle)
- Magic numbers and strings MUST be replaced with named constants

**Rationale**: High-quality code reduces bugs, improves maintainability, accelerates onboarding, and builds team confidence. Self-documenting code minimizes cognitive load and technical debt accumulation.

### II. Testing-First Discipline (NON-NEGOTIABLE)

**MUST** follow test-driven development (TDD) methodology:
- Tests MUST be written BEFORE implementation begins (Red-Green-Refactor cycle)
- Tests MUST fail initially to verify they properly detect missing functionality
- Every user story MUST have corresponding acceptance tests that prove the story works independently
- Contract tests MUST be written for all API endpoints and library interfaces
- Integration tests MUST cover inter-service communication and data flow
- Unit tests MUST cover all business logic and edge cases
- Test coverage MUST be ≥80% for new code (enforced by CI/CD gates)
- Tests MUST be deterministic, fast (<5s for unit tests), and independently executable

**Rationale**: Test-first development catches bugs early, ensures requirements are met, provides living documentation, enables fearless refactoring, and guarantees each feature delivers value independently.

### III. Modern UI/UX Consistency

**MUST** deliver consistent, intuitive, and accessible user experiences:
- UI components MUST follow established design system patterns and spacing rules
- Interfaces MUST be responsive (mobile-first design) and work across viewport sizes
- Interactive elements MUST provide immediate visual feedback (hover, focus, loading states)
- User flows MUST be optimized for minimal clicks/steps to complete primary actions
- Error messages MUST be helpful and actionable (not technical stack traces)
- Forms MUST include inline validation with clear error indicators
- Accessibility MUST meet WCAG 2.1 Level AA standards (semantic HTML, ARIA labels, keyboard navigation, screen reader support)
- Loading states MUST be shown for operations taking >300ms
- UI MUST maintain consistent theming (colors, typography, shadows) across all views

**Rationale**: Consistent UX builds user trust and reduces training time. Modern UI patterns leverage user familiarity. Accessibility ensures product reaches widest possible audience and is legally compliant.

### IV. Performance-By-Design

**MUST** build performance optimization into architecture from the start:
- Critical rendering path MUST complete in <1.5s (First Contentful Paint)
- API endpoints MUST respond in <200ms (p95 latency)
- Database queries MUST use indexes and avoid N+1 patterns
- Large datasets MUST use pagination, virtualization, or lazy loading
- Static assets MUST be optimized (images compressed/lazy-loaded, code splitting, tree shaking)
- Bundle sizes MUST be monitored (initial JS load <200KB gzipped)
- Memory leaks MUST be prevented (proper cleanup of listeners, timers, subscriptions)
- Performance metrics MUST be tracked in production (RUM/APM tools)
- Expensive computations MUST be memoized, cached, or moved to background workers

**Rationale**: Performance directly impacts user satisfaction, conversion rates, and operational costs. Early optimization prevents costly architectural rewrites. Performance regression detection in CI prevents degradation.

### V. Security & Privacy Foundation

**MUST** integrate security and privacy considerations into every feature:
- User input MUST be validated and sanitized on both client and server sides
- Authentication MUST use industry-standard protocols (OAuth 2.0, OpenID Connect, JWT)
- Passwords MUST be hashed using bcrypt/Argon2 (never stored in plaintext)
- Authorization MUST enforce principle of least privilege (role-based or attribute-based access control)
- Sensitive data (PII, credentials, tokens) MUST be encrypted at rest and in transit (TLS 1.3+)
- API endpoints MUST implement rate limiting and CSRF/XSS protection
- Dependencies MUST be scanned for vulnerabilities (automated security audits)
- Secrets MUST never be committed to source control (use environment variables or secret managers)
- User data MUST be deletable (GDPR/privacy law compliance)
- Security headers MUST be configured (CSP, HSTS, X-Frame-Options)

**Rationale**: Security breaches damage reputation, incur legal liability, and destroy user trust. Privacy is a fundamental user right and regulatory requirement. Prevention is exponentially cheaper than incident response.

### VI. Maintainability & Technical Debt Management

**MUST** prioritize long-term code health and sustainability:
- Every feature MUST include refactoring tasks to improve code quality
- Technical debt MUST be logged, prioritized, and addressed regularly (20% time allocation)
- Breaking changes MUST follow semantic versioning (MAJOR.MINOR.PATCH)
- Deprecations MUST be communicated with migration guides and timeline
- Configuration MUST be externalized (12-factor app principles)
- Logs MUST be structured and queryable (JSON format with correlation IDs)
- Error handling MUST be consistent and graceful (no silent failures)
- Code reviews MUST check for maintainability issues (complexity, coupling, testability)
- Dependencies MUST be kept up-to-date (automated dependency updates)
- Architecture decisions MUST be documented (ADRs - Architecture Decision Records)

**Rationale**: Technical debt compounds over time, slowing development and increasing defects. Maintainable code extends product lifespan and reduces operational burden. Clear deprecation paths enable smooth evolution.

### VII. Documentation & Knowledge Sharing

**MUST** maintain comprehensive and current documentation:
- Every feature MUST include user-facing documentation (quickstart guides, tutorials)
- APIs MUST have OpenAPI/Swagger specs with request/response examples
- Complex algorithms MUST include inline comments explaining "why" (not "what")
- Setup instructions MUST be tested on clean environments (reproducible builds)
- Architectural decisions MUST be documented (context, options considered, rationale)
- Runbooks MUST exist for operational procedures (deployment, rollback, incident response)
- Knowledge MUST be shared through code reviews, pair programming, and tech talks
- Documentation MUST be version-controlled alongside code
- Breaking changes MUST include migration guides with before/after code examples

**Rationale**: Documentation democratizes knowledge, reduces onboarding time, prevents tribal knowledge silos, and enables autonomous problem-solving. Good documentation is a force multiplier for team productivity.

## Quality Standards

### Code Review Requirements

- All code MUST pass automated quality gates before human review: linting, formatting, type checking, security scanning
- Every PR MUST have at least one approval from a code owner
- Reviews MUST verify adherence to all Core Principles
- Reviewers MUST check for test coverage, performance implications, and security considerations
- Feedback MUST be constructive and reference specific principles when suggesting changes

### Continuous Integration Gates

- All tests MUST pass (unit, integration, contract)
- Code coverage MUST meet threshold (≥80%)
- Linting and formatting MUST be clean
- Dependency vulnerabilities MUST be addressed (critical/high severity)
- Bundle size MUST not exceed limits
- Performance benchmarks MUST not regress >10%

### Production Readiness Checklist

Before deploying to production, features MUST satisfy:
- [ ] All acceptance criteria met and tested
- [ ] Performance targets validated
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Monitoring/alerting configured
- [ ] Rollback plan documented
- [ ] Accessibility compliance verified

## Development Workflow

### Feature Development Lifecycle

1. **Specification** (`/speckit.specify`): Define user stories with acceptance criteria
2. **Planning** (`/speckit.plan`): Technical design with constitution compliance check
3. **Task Breakdown** (`/speckit.tasks`): Organize tasks by user story for independent delivery
4. **Test-First Implementation** (`/speckit.implement`): Write tests → Verify failure → Implement → Verify pass → Refactor
5. **Review & Validation**: Code review, QA testing, constitution compliance verification
6. **Deployment**: Staged rollout with monitoring

### Principle Enforcement

- Constitution compliance MUST be verified during planning phase (Constitution Check in plan.md)
- Task organization MUST enable independent user story delivery (align with Principle II)
- Implementation MUST follow test-first discipline (enforced by templates)
- Each phase gate MUST validate relevant principles before proceeding

## Governance

This constitution supersedes all other development practices and guidelines. When conflicts arise, constitutional principles take precedence.

### Amendment Process

1. Amendments MUST be proposed with clear rationale and impact analysis
2. Proposed changes MUST undergo team review and approval
3. Approved amendments MUST be documented with version increment following semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible governance changes
   - **MINOR**: New principles added or material expansions to existing principles
   - **PATCH**: Clarifications, wording improvements, typo fixes
4. All templates and dependent artifacts MUST be updated to reflect amendments
5. Migration plan MUST be provided for breaking changes

### Compliance & Review

- All PRs MUST verify constitutional compliance
- Quarterly reviews MUST assess adherence and identify systemic violations
- Complexity that violates principles MUST be justified and tracked for future refactoring
- Teams MUST use specification templates (plan-template.md, spec-template.md, tasks-template.md) to enforce constitutional principles
- Runtime development guidance MUST reference this constitution for decision-making

### Version Control

All constitution amendments MUST be tracked with:
- Version number (semantic versioning)
- Ratification date (original adoption)
- Last amended date (most recent change)
- Sync Impact Report (changes, affected files, follow-up tasks)

**Version**: 1.0.0 | **Ratified**: 2025-11-05 | **Last Amended**: 2025-11-05
