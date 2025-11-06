/**
 * Contract tests for Analytics Service
 * Verifies the IAnalyticsService interface implementation
 */
import { describe, it, expect } from 'vitest';
import { analytics } from '@/services/analytics';

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
    expect(typeof analytics.trackEvent).toBe('function');
    expect(typeof analytics.trackCalculation).toBe('function');
    expect(typeof analytics.trackPresetClick).toBe('function');
    expect(typeof analytics.trackRegimeSwitch).toBe('function');
    expect(typeof analytics.trackShare).toBe('function');
    expect(typeof analytics.isAvailable).toBe('function');
  });

  it('trackPageView should have 1 parameter', () => {
    expect(analytics.trackPageView.length).toBe(1);
  });

  it('trackPageView should return void', () => {
    const result = analytics.trackPageView({ path: '/test' });
    expect(result).toBeUndefined();
  });

  it('isAvailable should return boolean', () => {
    const result = analytics.isAvailable();
    expect(typeof result).toBe('boolean');
  });
});
