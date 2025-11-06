# Research Notes: Google Analytics 4 Integration

**Feature**: 003-google-analytics
**Date**: 2025-11-06
**Purpose**: Resolve technical unknowns and establish best practices for GA4 integration

---

## Research Tasks

### 1. GA4 Integration Methods for React SPAs

**Decision**: Use Google's official gtag.js library with direct script injection in index.html

**Rationale**:
- **Official support**: gtag.js is Google's recommended approach for GA4
- **Native performance**: Direct script loading is faster than npm packages
- **Auto-updates**: Google updates the library automatically (via CDN)
- **SPA compatibility**: gtag.js handles client-side routing with manual page view tracking
- **Lightweight**: ~15KB gzipped, minimal bundle impact

**Alternatives considered**:
1. ❌ **react-ga4** (npm package)
   - Pros: React-friendly API, TypeScript support
   - Cons: Additional dependency (maintained by community, not Google), adds to bundle size, may lag behind GA4 features
   - Rejected: Adds maintenance burden, wrapper overhead for functionality we can implement directly

2. ❌ **Google Tag Manager (GTM)**
   - Pros: No-code event tracking via GTM UI, supports multiple analytics platforms
   - Cons: Overkill for single analytics use case, adds complexity, requires GTM account setup
   - Rejected: Unnecessary complexity for simple GA4-only tracking

3. ✅ **gtag.js via CDN** (chosen)
   - Pros: Official, auto-updating, minimal overhead, direct API access
   - Cons: Requires manual event tracking code (acceptable trade-off)

**Implementation approach**:
```html
<!-- In public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9YLLHMNV3W"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-9YLLHMNV3W', {
    anonymize_ip: true,
    send_page_view: false  // Manual control for SPA
  });
</script>
```

---

### 2. Privacy-First Tracking Patterns

**Decision**: Enable IP anonymization, exclude PII from all events, use generic event parameters

**Rationale**:
- **GDPR/privacy compliance**: IP anonymization prevents identification of users
- **User trust**: Transparent privacy practices build confidence
- **No legal risk**: Generic tracking (button clicks, mode switches) has no PII concerns
- **Future-proof**: Privacy-first design prepares for stricter regulations

**Best practices**:
1. **IP Anonymization**: Set `anonymize_ip: true` in gtag config
2. **No salary tracking**: Use categorical labels (e.g., "preset_10M") instead of actual amounts
3. **No user identification**: Don't set user IDs or custom dimensions with PII
4. **Event parameter filtering**: Validate events don't contain sensitive data before sending

**GA4 Configuration**:
```typescript
gtag('config', 'G-9YLLHMNV3W', {
  anonymize_ip: true,           // Anonymize user IP addresses
  allow_google_signals: false,  // Disable personalized advertising features
  send_page_view: false         // Manual page view control
});
```

**Event structure example** (privacy-safe):
```typescript
gtag('event', 'preset_click', {
  event_category: 'interaction',
  event_label: 'preset_30M',  // Generic label, not actual salary
  value: 3                    // Index, not amount
});
```

---

### 3. SPA Page View Tracking Strategy

**Decision**: Disable automatic page views, implement manual tracking on view mode changes

**Rationale**:
- **SPA behavior**: React doesn't trigger traditional page loads on navigation
- **Accurate tracking**: Manual tracking ensures view mode changes (2025, 2026, Compare) are recorded
- **Control**: Explicit tracking prevents duplicate/incorrect page views
- **Virtual pages**: GA4 supports virtual page views with custom page paths

**Implementation strategy**:
1. Set `send_page_view: false` in gtag config (disable auto-tracking)
2. Track initial page load in React useEffect (App.tsx)
3. Track view mode changes via custom hook (useAnalytics)
4. Use descriptive virtual paths: `/2025`, `/2026`, `/compare`

**Code pattern**:
```typescript
// Initial page load
useEffect(() => {
  trackPageView('/2025');  // Default view
}, []);

// View mode changes
const handleViewChange = (mode: '2025' | '2026' | 'compare') => {
  trackPageView(`/${mode}`);
  setViewMode(mode);
};
```

---

### 4. Event Tracking Architecture

**Decision**: Create abstraction layer (analytics service) with typed event interfaces

**Rationale**:
- **Type safety**: TypeScript interfaces prevent tracking errors
- **Maintainability**: Single source of truth for all tracking calls
- **Testability**: Service can be mocked in tests
- **Future flexibility**: Easy to swap analytics providers (GA4 → Plausible/Matomo)
- **DRY principle**: Avoid repeating gtag calls throughout components

**Architecture**:
```
Component → useAnalytics hook → AnalyticsService → gtag.js → GA4
```

**Service API**:
```typescript
interface AnalyticsService {
  trackPageView(path: string): void;
  trackEvent(name: string, params?: EventParams): void;
  trackCalculation(regime: '2025' | '2026'): void;
  trackPresetClick(amount: number): void;
  trackRegimeSwitch(from: string, to: string): void;
  trackShare(method: 'url' | 'copy'): void;
}
```

**Benefits**:
- Components call semantic methods (`trackCalculation()`) not generic gtag
- Easy to add/modify tracking without touching components
- Service handles privacy filtering internally

---

### 5. Testing Strategy for Analytics

**Decision**: Multi-layer testing with mocked gtag, no real GA4 calls in CI

**Rationale**:
- **CI/CD compatibility**: Cannot verify GA dashboard in automated tests
- **Deterministic tests**: Mocking ensures consistent test results
- **Fast execution**: No network calls to GA servers
- **Verifiable contracts**: Assert tracking calls made with correct parameters

**Test layers**:

1. **Contract tests**: Verify service API signature
```typescript
describe('AnalyticsService contract', () => {
  it('should expose trackPageView method', () => {
    expect(analytics).toHaveProperty('trackPageView');
    expect(typeof analytics.trackPageView).toBe('function');
  });
});
```

2. **Unit tests**: Test event parameter construction
```typescript
describe('trackPresetClick', () => {
  it('should send preset event with sanitized label', () => {
    analytics.trackPresetClick(30_000_000);
    expect(mockGtag).toHaveBeenCalledWith('event', 'preset_click', {
      event_category: 'interaction',
      event_label: 'preset_30M',
      value: 3
    });
  });
});
```

3. **Integration tests**: Verify component tracking
```typescript
describe('GrossSalaryInput integration', () => {
  it('should track preset click when button pressed', async () => {
    render(<GrossSalaryInput />);
    await userEvent.click(screen.getByText('30 triệu'));
    expect(mockAnalytics.trackPresetClick).toHaveBeenCalledWith(30_000_000);
  });
});
```

4. **Manual verification**: Test in production/staging
   - Check GA4 Realtime view for events
   - Verify event parameters in DebugView
   - Confirm page views and user flow

**Mocking approach**:
```typescript
// tests/mocks/analytics.ts
export const mockGtag = vi.fn();
window.gtag = mockGtag;

// Or mock entire service
vi.mock('@/services/analytics', () => ({
  analytics: {
    trackPageView: vi.fn(),
    trackEvent: vi.fn(),
    // ... other methods
  }
}));
```

---

### 6. Error Handling & Graceful Degradation

**Decision**: Fail silently with optional logging, never throw errors that break the app

**Rationale**:
- **User experience first**: Analytics failures shouldn't impact calculator functionality
- **Ad blocker reality**: 30-40% of users block tracking - this is normal, not an error
- **Production stability**: Tracking is nice-to-have, not critical path
- **Debug support**: Log errors in development for troubleshooting

**Error handling patterns**:

1. **Safe gtag calls**:
```typescript
export function trackEvent(name: string, params?: EventParams): void {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    } else if (import.meta.env.DEV) {
      console.warn('[Analytics] gtag not available:', name, params);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Analytics] Tracking error:', error);
    }
    // Swallow error in production - don't break app
  }
}
```

2. **Script load failure**:
```html
<script async src="..." onerror="console.warn('GA4 script blocked')"></script>
```

3. **Type guards**:
```typescript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Always check existence before calling
if (window.gtag) {
  window.gtag('event', ...);
}
```

---

### 7. Performance Optimization

**Decision**: Async script loading, lazy initialization, fire-and-forget tracking

**Rationale**:
- **Non-blocking**: Analytics must not delay app rendering
- **Perceived performance**: Users shouldn't notice tracking overhead
- **Bandwidth optimization**: Gtag.js loads after critical resources
- **No race conditions**: App works whether gtag loads or not

**Optimization techniques**:

1. **Async/defer script loading**:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9YLLHMNV3W"></script>
```

2. **Lazy initialization** (wait for app to render):
```typescript
useEffect(() => {
  // Track after React finishes initial render
  setTimeout(() => {
    trackPageView('/2025');
  }, 0);
}, []);
```

3. **Fire-and-forget** (no awaiting):
```typescript
// Don't await tracking calls
trackEvent('calculation'); // Returns void, doesn't block
```

4. **Environment-based loading** (optional):
```typescript
// Only load in production
{import.meta.env.PROD && (
  <script async src="..." />
)}
```

**Performance budget**:
- Gtag.js script: ~15KB gzipped (loaded async)
- Inline config: <1KB
- Tracking overhead per event: <10ms (fire-and-forget)
- Total impact on FCP: 0ms (async, after render)

---

## Configuration Summary

**Environment Variables** (add to `.env` or build config):
```bash
VITE_GA_MEASUREMENT_ID=G-9YLLHMNV3W
```

**GA4 Property Settings** (configure in GA dashboard):
- ✅ IP anonymization: Enabled
- ✅ Google signals: Disabled (no personalized ads)
- ✅ Data retention: 14 months (default)
- ✅ Enhanced measurement: Enabled (scroll, outbound clicks, site search)

**Tracked Events**:
| Event Name | Category | Parameters | Trigger |
|------------|----------|------------|---------|
| `page_view` | - | `page_path`, `page_title` | Initial load, view mode change |
| `preset_click` | `interaction` | `event_label`, `value` | Preset button clicked |
| `calculation` | `engagement` | `regime` | Salary calculated |
| `regime_switch` | `interaction` | `from`, `to` | Switch 2025/2026/Compare |
| `share` | `engagement` | `method` | Share URL or copy results |
| `region_change` | `interaction` | `region` | Region selection changed |

---

## Resolved Clarifications

All technical unknowns from Technical Context have been resolved:
- ✅ **Integration method**: gtag.js via CDN (official, performant)
- ✅ **Privacy approach**: IP anonymization + no PII tracking
- ✅ **SPA strategy**: Manual page view tracking on mode changes
- ✅ **Testing**: Multi-layer with mocked gtag
- ✅ **Error handling**: Graceful degradation, silent failures
- ✅ **Performance**: Async loading, fire-and-forget calls

**Ready for Phase 1 (Design & Contracts)** ✅
