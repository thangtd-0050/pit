# Data Model: Google Analytics Tracking

**Feature**: 003-google-analytics  
**Date**: 2025-11-06  
**Purpose**: Define data structures for analytics events and tracking state

---

## Overview

This feature is primarily behavioral (tracking user interactions) rather than data-centric. There are no persistent entities stored in a database. The data model describes:
1. Event structures sent to Google Analytics
2. TypeScript interfaces for type safety
3. In-memory tracking state (if any)

---

## Entities

### 1. AnalyticsEvent

**Description**: Represents a generic analytics event sent to GA4

**Attributes**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | `string` | Yes | Non-empty, lowercase_snake_case | Event name (e.g., "preset_click", "calculation") |
| `category` | `string` | No | One of: "interaction", "engagement", "navigation" | Event category for grouping |
| `label` | `string` | No | Max 100 chars, no PII | Human-readable event label |
| `value` | `number` | No | Non-negative integer | Numeric value associated with event |
| `customParams` | `Record<string, string \| number>` | No | No PII, max 25 params | Additional custom parameters |

**Relationships**: None (events are fire-and-forget)

**State Transitions**: N/A (stateless)

**Example**:
```typescript
{
  name: "preset_click",
  category: "interaction",
  label: "preset_30M",
  value: 3,
  customParams: { button_position: 2 }
}
```

---

### 2. PageView

**Description**: Represents a page view or virtual page view event

**Attributes**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `path` | `string` | Yes | Starts with "/", max 100 chars | Virtual page path (e.g., "/2025", "/compare") |
| `title` | `string` | No | Max 100 chars | Page title for display in GA |
| `referrer` | `string` | No | Valid URL or empty | Previous page URL |

**Relationships**: None

**State Transitions**: N/A

**Example**:
```typescript
{
  path: "/2026",
  title: "Salary Calculator 2026",
  referrer: "/2025"
}
```

---

### 3. CalculationEvent

**Description**: Event triggered when user performs a salary calculation

**Attributes**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `regime` | `"2025" \| "2026"` | Yes | Enum validation | Tax regime used |
| `hasInput` | `boolean` | Yes | - | Whether user entered custom salary (vs preset) |
| `calculationTime` | `number` | No | Positive number | Time taken to calculate (ms) |

**Privacy Note**: Actual salary amount is NOT tracked (PII)

**Relationships**: None

**Example**:
```typescript
{
  regime: "2026",
  hasInput: true,
  calculationTime: 42
}
```

---

### 4. PresetClickEvent

**Description**: Event triggered when user clicks a salary preset button

**Attributes**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `presetLabel` | `string` | Yes | Format: "preset_{amount}M" | Preset identifier (e.g., "preset_30M") |
| `presetIndex` | `number` | Yes | 0-7 (8 presets) | Position in preset array |

**Privacy Note**: Uses generic labels (30M), not actual VND amounts

**Relationships**: None

**Example**:
```typescript
{
  presetLabel: "preset_50M",
  presetIndex: 4
}
```

---

### 5. RegimeSwitchEvent

**Description**: Event triggered when user switches between tax regimes or comparison view

**Attributes**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `from` | `"2025" \| "2026" \| "compare"` | Yes | Enum validation | Previous regime/view |
| `to` | `"2025" \| "2026" \| "compare"` | Yes | Enum validation | New regime/view |

**Validation Rule**: `from !== to` (cannot switch to same view)

**Relationships**: None

**Example**:
```typescript
{
  from: "2025",
  to: "compare"
}
```

---

### 6. ShareEvent

**Description**: Event triggered when user shares results or copies details

**Attributes**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `method` | `"url" \| "copy"` | Yes | Enum validation | Share method used |
| `regime` | `string` | No | "2025" \| "2026" \| "compare" | Active regime when shared |

**Relationships**: None

**Example**:
```typescript
{
  method: "copy",
  regime: "2026"
}
```

---

## TypeScript Interfaces

### Core Types

```typescript
/**
 * Base analytics event structure
 */
export interface AnalyticsEvent {
  name: string;
  category?: 'interaction' | 'engagement' | 'navigation';
  label?: string;
  value?: number;
  customParams?: Record<string, string | number | boolean>;
}

/**
 * Page view event parameters
 */
export interface PageViewParams {
  path: string;
  title?: string;
  referrer?: string;
}

/**
 * Calculation event parameters
 */
export interface CalculationEventParams {
  regime: '2025' | '2026';
  hasInput: boolean;
  calculationTime?: number;
}

/**
 * Preset click event parameters
 */
export interface PresetClickEventParams {
  presetLabel: string;
  presetIndex: number;
}

/**
 * Regime switch event parameters
 */
export interface RegimeSwitchEventParams {
  from: ViewMode;
  to: ViewMode;
}

/**
 * Share event parameters
 */
export interface ShareEventParams {
  method: 'url' | 'copy';
  regime?: string;
}

/**
 * View mode type (matches app state)
 */
export type ViewMode = '2025' | '2026' | 'compare';
```

### Service Interface

```typescript
/**
 * Analytics service contract
 */
export interface IAnalyticsService {
  /**
   * Track a page view or virtual page navigation
   */
  trackPageView(params: PageViewParams): void;

  /**
   * Track a generic event with custom parameters
   */
  trackEvent(event: AnalyticsEvent): void;

  /**
   * Track a salary calculation
   */
  trackCalculation(params: CalculationEventParams): void;

  /**
   * Track a preset button click
   */
  trackPresetClick(params: PresetClickEventParams): void;

  /**
   * Track a regime/view mode switch
   */
  trackRegimeSwitch(params: RegimeSwitchEventParams): void;

  /**
   * Track a share action
   */
  trackShare(params: ShareEventParams): void;

  /**
   * Check if analytics is available (not blocked)
   */
  isAvailable(): boolean;
}
```

---

## State Management

### In-Memory State

**No persistent state required.** All tracking is stateless (fire-and-forget).

Optional state for tracking previous view mode (to enable `from` parameter in regime switch):

```typescript
// In useAnalytics hook or analytics service
let previousViewMode: ViewMode | null = null;

export function trackRegimeSwitch(to: ViewMode): void {
  if (previousViewMode && previousViewMode !== to) {
    trackEvent({
      name: 'regime_switch',
      category: 'interaction',
      customParams: {
        from: previousViewMode,
        to: to
      }
    });
  }
  previousViewMode = to;
}
```

---

## Validation Rules

### Event Parameter Validation

```typescript
/**
 * Validate event before sending to GA4
 */
function validateEvent(event: AnalyticsEvent): boolean {
  // Event name required and non-empty
  if (!event.name || event.name.trim().length === 0) {
    return false;
  }

  // Event name must be lowercase_snake_case
  if (!/^[a-z][a-z0-9_]*$/.test(event.name)) {
    return false;
  }

  // Label max length
  if (event.label && event.label.length > 100) {
    return false;
  }

  // Value must be non-negative
  if (event.value !== undefined && event.value < 0) {
    return false;
  }

  // Check for PII in parameters (basic check)
  const paramValues = Object.values(event.customParams || {});
  for (const value of paramValues) {
    // Don't allow numbers that look like full salaries (>1M VND)
    if (typeof value === 'number' && value > 1_000_000) {
      console.warn('[Analytics] Blocked potential PII in event params');
      return false;
    }
  }

  return true;
}
```

### Privacy Filters

```typescript
/**
 * Sanitize preset amount to generic label
 */
function sanitizePresetLabel(amount: number): string {
  const millions = amount / 1_000_000;
  return `preset_${millions}M`;
}

/**
 * Remove PII from event parameters
 */
function sanitizeParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(params)) {
    // Skip keys that might contain PII
    if (key.match(/salary|income|email|phone|name|address/i)) {
      continue;
    }
    
    // Skip large numbers that might be actual salaries
    if (typeof value === 'number' && value > 1_000_000) {
      continue;
    }
    
    sanitized[key] = value;
  }
  
  return sanitized;
}
```

---

## GA4 Event Mapping

### Standard Events

| App Event | GA4 Event Name | Parameters |
|-----------|----------------|------------|
| Page View | `page_view` | `page_path`, `page_title` |
| Calculation | `calculate_salary` | `regime`, `has_input` |
| Preset Click | `preset_click` | `event_label`, `value` |
| Regime Switch | `regime_switch` | `from`, `to` |
| Share | `share` | `method`, `content_type` |

### Custom Dimensions (GA4 configuration)

Optional custom dimensions to configure in GA4 dashboard:
- **Regime**: Tax regime being viewed (2025, 2026, compare)
- **Input Method**: How salary was entered (preset vs custom)
- **Share Method**: How results were shared (url vs copy)

---

## Summary

**Data Model Complexity**: Low (no database, stateless events)

**Key Design Decisions**:
1. **Type Safety**: TypeScript interfaces ensure correct event structure
2. **Privacy First**: Validation filters prevent PII tracking
3. **Stateless**: No persistence required, fire-and-forget architecture
4. **Extensible**: Easy to add new event types via interfaces

**Ready for Contract Definition** ✅
