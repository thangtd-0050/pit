# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript 5.3.3 (strict mode enabled)
**Primary Dependencies**: React 18.2, Vite 5.0, Zustand 4.4, Tailwind CSS 3.4, shadcn/ui
**Storage**: Client-side only (URL state for persistence, no backend)
**Testing**: Vitest, React Testing Library
**Target Platform**: Web (Modern Browsers)
**Project Type**: Web application (Single Page App)
**Performance Goals**: Standard web performance (Lighthouse > 90)
**Constraints**: Client-side calculation, no server dependency
**Scale/Scope**: Single feature update within existing app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality Excellence**: Will follow standard conventions and linting.
- [x] **II. Testing-First Discipline**: Will write tests for new calculations before implementation.
- [x] **III. Modern UI/UX Consistency**: Will use existing UI components and patterns.
- [x] **IV. Performance-By-Design**: Client-side calculation is lightweight.
- [x] **V. Security & Privacy Foundation**: N/A (no PII).
- [x] **VI. Maintainability & Technical Debt Management**: Refactoring constants for better maintainability.
- [x] **VII. Documentation & Knowledge Sharing**: Updating docs and adding tooltips.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
