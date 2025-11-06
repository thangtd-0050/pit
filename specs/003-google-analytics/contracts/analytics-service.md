# Analytics Service API Contract

**Feature**: 003-google-analytics  
**Date**: 2025-11-06  
**Purpose**: Define the contract for the Analytics Service API

---

## Overview

The Analytics Service provides a TypeScript API for tracking user interactions and page views in Google Analytics 4. This contract defines the public interface, method signatures, expected behaviors, and error handling.

**Contract Type**: Client-side library interface (not HTTP API)

---

## Service Interface

### `IAnalyticsService`

Primary interface for all analytics tracking operations.

```typescript
export interface IAnalyticsService {
  /**
   * Track a page view or virtual page navigation
   * 
   * @param params - Page view parameters
   * @returns void (fire-and-forget)
   * @throws Never throws - errors are logged internally
   * 
   * @example
   * analytics.trackPageView({ path: '/2025', title: 'Calculator 2025' });
   */
  trackPageView(params: PageViewParams): void;

  /**
   * Track a generic custom event
   * 
   * @param event - Event details with name and optional parameters
   * @returns void (fire-and-forget)
   * @throws Never throws - errors are logged internally
   * 
   * @example
   * analytics.trackEvent({
   *   name: 'button_click',
   *   category: 'interaction',
   *   label: 'submit',
   *   value: 1
   * });
   */
  trackEvent(event: AnalyticsEvent): void;

  /**
   * Track a salary calculation event
   * 
   * @param params - Calculation event parameters
   * @returns void (fire-and-forget)
   * @throws Never throws - errors are logged internally
   * 
   * @example
   * analytics.trackCalculation({
   *   regime: '2026',
   *   hasInput: true,
   *   calculationTime: 42
   * });
   */
  trackCalculation(params: CalculationEventParams): void;

  /**
   * Track a preset button click
   * 
   * @param params - Preset click parameters
   * @returns void (fire-and-forget)
   * @throws Never throws - errors are logged internally
   * 
   * @example
   * analytics.trackPresetClick({
   *   presetLabel: 'preset_30M',
   *   presetIndex: 2
   * });
   */
  trackPresetClick(params: PresetClickEventParams): void;

  /**
   * Track a regime/view mode switch
   * 
   * @param params - Regime switch parameters
   * @returns void (fire-and-forget)
   * @throws Never throws - errors are logged internally
   * 
   * @example
   * analytics.trackRegimeSwitch({
   *   from: '2025',
   *   to: 'compare'
   * });
   */
  trackRegimeSwitch(params: RegimeSwitchEventParams): void;

  /**
   * Track a share action (URL or copy)
   * 
   * @param params - Share event parameters
   * @returns void (fire-and-forget)
   * @throws Never throws - errors are logged internally
   * 
   * @example
   * analytics.trackShare({
   *   method: 'url',
   *   regime: '2026'
   * });
   */
  trackShare(params: ShareEventParams): void;

  /**
   * Check if analytics tracking is available (gtag loaded, not blocked)
   * 
   * @returns true if gtag is available, false otherwise
   * @throws Never throws
   * 
   * @example
   * if (analytics.isAvailable()) {
   *   console.log('Analytics enabled');
   * }
   */
  isAvailable(): boolean;
}
```

---

## Parameter Types

### PageViewParams

```typescript
/**
 * Parameters for tracking a page view
 */
export interface PageViewParams {
  /**
   * Virtual page path (e.g., '/2025', '/compare')
   * Must start with '/'
   * Max length: 100 characters
   */
  path: string;

  /**
   * Optional page title for GA dashboard display
   * Max length: 100 characters
   */
  title?: string;

  /**
   * Optional referrer URL
   * Must be valid URL or empty string
   */
  referrer?: string;
}
```

**Example**:
```typescript
{
  path: '/2026',
  title: 'Salary Calculator 2026',
  referrer: '/2025'
}
```

---

### AnalyticsEvent

```typescript
/**
 * Generic analytics event structure
 */
export interface AnalyticsEvent {
  /**
   * Event name in lowercase_snake_case
   * Required, non-empty
   * Pattern: ^[a-z][a-z0-9_]*$
   */
  name: string;

  /**
   * Optional event category for grouping
   */
  category?: 'interaction' | 'engagement' | 'navigation';

  /**
   * Optional human-readable label
   * Max length: 100 characters
   */
  label?: string;

  /**
   * Optional numeric value (must be non-negative)
   */
  value?: number;

  /**
   * Optional custom parameters (max 25 key-value pairs)
   * Keys must not contain PII
   * Values must not be large numbers (>1M) to prevent PII leakage
   */
  customParams?: Record<string, string | number | boolean>;
}
```

**Example**:
```typescript
{
  name: 'preset_click',
  category: 'interaction',
  label: 'preset_50M',
  value: 4,
  customParams: {
    button_position: 4,
    has_dependents: true
  }
}
```

---

### CalculationEventParams

```typescript
/**
 * Parameters for salary calculation tracking
 */
export interface CalculationEventParams {
  /**
   * Tax regime used for calculation
   */
  regime: '2025' | '2026';

  /**
   * Whether user entered custom salary (true) or used preset (false)
   */
  hasInput: boolean;

  /**
   * Optional calculation time in milliseconds
   * Must be positive number
   */
  calculationTime?: number;
}
```

**Example**:
```typescript
{
  regime: '2026',
  hasInput: true,
  calculationTime: 38
}
```

**Privacy Note**: Actual salary amount is NOT included (PII protection)

---

### PresetClickEventParams

```typescript
/**
 * Parameters for preset button click tracking
 */
export interface PresetClickEventParams {
  /**
   * Preset identifier in format 'preset_{amount}M'
   * e.g., 'preset_30M', 'preset_100M'
   */
  presetLabel: string;

  /**
   * Zero-based index of preset in array (0-7)
   */
  presetIndex: number;
}
```

**Example**:
```typescript
{
  presetLabel: 'preset_30M',
  presetIndex: 2
}
```

**Privacy Note**: Uses generic labels (30M), not actual VND amounts (30,000,000)

---

### RegimeSwitchEventParams

```typescript
/**
 * Parameters for regime/view mode switch tracking
 */
export interface RegimeSwitchEventParams {
  /**
   * Previous view mode
   */
  from: ViewMode;

  /**
   * New view mode
   */
  to: ViewMode;
}

/**
 * Available view modes
 */
export type ViewMode = '2025' | '2026' | 'compare';
```

**Example**:
```typescript
{
  from: '2025',
  to: 'compare'
}
```

**Validation**: `from !== to` (enforced by service)

---

### ShareEventParams

```typescript
/**
 * Parameters for share action tracking
 */
export interface ShareEventParams {
  /**
   * Share method used
   */
  method: 'url' | 'copy';

  /**
   * Optional active regime when shared
   */
  regime?: string;
}
```

**Example**:
```typescript
{
  method: 'copy',
  regime: '2026'
}
```

---

## Behavioral Contracts

### Error Handling

**CONTRACT**: Service methods MUST NEVER throw exceptions that break the application

**Behavior**:
1. If gtag is not loaded (blocked/failed):
   - Methods return immediately without error
   - `isAvailable()` returns `false`
   - Development mode: Log warning to console
   - Production mode: Silent (no console output)

2. If invalid parameters provided:
   - Event is not sent to GA4
   - Development mode: Log validation error
   - Production mode: Silent

3. If gtag call fails (network error, etc.):
   - Error is caught and logged (development only)
   - Application continues normally

**Test Case**:
```typescript
describe('Error handling contract', () => {
  it('should not throw when gtag is undefined', () => {
    window.gtag = undefined;
    expect(() => analytics.trackPageView({ path: '/test' })).not.toThrow();
  });

  it('should not throw on invalid parameters', () => {
    expect(() => analytics.trackEvent({ name: '' })).not.toThrow();
  });
});
```

---

### Privacy Guarantees

**CONTRACT**: Service MUST filter out personally identifiable information (PII)

**Behavior**:
1. **No salary amounts**: Actual VND amounts (e.g., 30,000,000) are converted to generic labels (e.g., "preset_30M")
2. **No user identity**: No user IDs, emails, names, or other identifiers tracked
3. **Parameter sanitization**: Numeric values >1M rejected (potential salary amounts)
4. **PII key filtering**: Parameters with keys matching `salary|income|email|phone|name` are excluded

**Test Case**:
```typescript
describe('Privacy contract', () => {
  it('should sanitize salary amounts in preset clicks', () => {
    analytics.trackPresetClick({
      presetLabel: 'preset_30M',
      presetIndex: 2
    });
    
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'preset_click',
      expect.not.objectContaining({
        salary: expect.any(Number)
      })
    );
  });

  it('should reject events with large numeric values', () => {
    analytics.trackEvent({
      name: 'test',
      customParams: { suspicious: 50_000_000 }
    });
    
    // Event should not be sent
    expect(mockGtag).not.toHaveBeenCalled();
  });
});
```

---

### Performance Contracts

**CONTRACT**: Tracking calls MUST be non-blocking and complete in <10ms

**Behavior**:
1. **Fire-and-forget**: Methods return immediately without awaiting GA4 response
2. **Async gtag**: gtag.js itself handles async transmission
3. **No DOM manipulation**: No UI changes triggered by tracking
4. **Minimal computation**: Event parameter construction <1ms

**Test Case**:
```typescript
describe('Performance contract', () => {
  it('should complete tracking in <10ms', () => {
    const start = performance.now();
    analytics.trackCalculation({ regime: '2026', hasInput: true });
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(10);
  });

  it('should not block on gtag calls', async () => {
    const promise = new Promise<void>((resolve) => {
      analytics.trackPageView({ path: '/test' });
      resolve(); // Should resolve immediately
    });
    
    await expect(promise).resolves.toBeUndefined();
  });
});
```

---

## Usage Examples

### Basic Page View Tracking

```typescript
import { analytics } from '@/services/analytics';

// Track initial page load
analytics.trackPageView({
  path: '/2025',
  title: 'Salary Calculator 2025'
});
```

### Event Tracking in Components

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function GrossSalaryInput() {
  const { trackPresetClick } = useAnalytics();

  const handlePresetClick = (amount: number, index: number) => {
    const millions = amount / 1_000_000;
    trackPresetClick({
      presetLabel: `preset_${millions}M`,
      presetIndex: index
    });
    
    setSalary(amount);
  };

  return (
    <button onClick={() => handlePresetClick(30_000_000, 2)}>
      30 triệu
    </button>
  );
}
```

### Conditional Tracking

```typescript
if (analytics.isAvailable()) {
  analytics.trackShare({
    method: 'url',
    regime: currentRegime
  });
} else {
  console.log('Analytics blocked - continuing without tracking');
}
```

---

## Testing Contract

### Unit Test Requirements

All service methods MUST have unit tests verifying:
1. **Happy path**: Correct gtag calls with valid parameters
2. **Error handling**: No exceptions on invalid input or missing gtag
3. **Privacy filtering**: PII is excluded from events
4. **Performance**: Methods complete in <10ms

### Integration Test Requirements

Components using analytics MUST have integration tests verifying:
1. **Tracking calls**: Correct methods called on user interactions
2. **Parameter passing**: Event parameters match user actions
3. **No UI impact**: Tracking failures don't break UI

### Contract Test Requirements

Service MUST have contract tests verifying:
1. **Interface compliance**: All methods exist with correct signatures
2. **Return types**: Methods return void (fire-and-forget)
3. **Type safety**: TypeScript types prevent invalid usage

**Example Contract Test**:
```typescript
describe('IAnalyticsService contract', () => {
  it('should implement all required methods', () => {
    expect(analytics).toHaveProperty('trackPageView');
    expect(analytics).toHaveProperty('trackEvent');
    expect(analytics).toHaveProperty('trackCalculation');
    expect(analytics).toHaveProperty('trackPresetClick');
    expect(analytics).toHaveProperty('trackRegimeSwitch');
    expect(analytics).toHaveProperty('trackShare');
    expect(analytics).toHaveProperty('isAvailable');
  });

  it('should have correct method signatures', () => {
    expect(typeof analytics.trackPageView).toBe('function');
    expect(analytics.trackPageView.length).toBe(1); // 1 parameter
    
    const result = analytics.trackPageView({ path: '/test' });
    expect(result).toBeUndefined(); // void return
  });
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-06 | Initial contract definition |

---

## Summary

**Contract Complexity**: Low (simple service interface, no async operations)

**Key Guarantees**:
1. ✅ **Never throws**: Errors handled internally, app never breaks
2. ✅ **Privacy-first**: PII automatically filtered
3. ✅ **Non-blocking**: Fire-and-forget, <10ms overhead
4. ✅ **Type-safe**: TypeScript interfaces prevent misuse

**Ready for Implementation** ✅
