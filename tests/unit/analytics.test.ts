/**
 * Unit tests for Analytics Service
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { analytics } from '@/services/analytics';
import { setupAnalyticsMocks, cleanupAnalyticsMocks, mockGtag } from '../mocks/analytics';

describe('Analytics Service', () => {
  beforeEach(() => {
    setupAnalyticsMocks();
  });

  afterEach(() => {
    cleanupAnalyticsMocks();
  });

  describe('trackPageView', () => {
    it('should call gtag with page_view event and correct params', () => {
      analytics.trackPageView({
        path: '/2025',
        title: 'Calculator 2025',
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/2025',
        page_title: 'Calculator 2025',
        page_referrer: undefined,
      });
    });

    it('should handle missing gtag gracefully without throwing', () => {
      delete (window as Window).gtag;

      expect(() => {
        analytics.trackPageView({ path: '/test' });
      }).not.toThrow();

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should validate path starts with slash', () => {
      analytics.trackPageView({ path: 'invalid-path' });

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should validate path max length (100 chars)', () => {
      const longPath = '/' + 'a'.repeat(100);
      analytics.trackPageView({ path: longPath });

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should track page view with valid path under 100 chars', () => {
      const validPath = '/' + 'a'.repeat(99);
      analytics.trackPageView({ path: validPath });

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        page_path: validPath,
      }));
    });
  });

  describe('isAvailable', () => {
    it('should return true when gtag is available', () => {
      expect(analytics.isAvailable()).toBe(true);
    });

    it('should return false when gtag is not available', () => {
      delete (window as Window).gtag;
      expect(analytics.isAvailable()).toBe(false);
    });
  });

  describe('trackEvent', () => {
    it('should call gtag with custom event name and params', () => {
      analytics.trackEvent({
        name: 'button_click',
        category: 'engagement',
        label: 'calculate',
        value: 1,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', {
        event_category: 'engagement',
        event_label: 'calculate',
        value: 1,
      });
    });

    it('should validate event name format (lowercase_snake_case)', () => {
      // Invalid formats
      analytics.trackEvent({ name: 'InvalidName', category: 'engagement' });
      analytics.trackEvent({ name: 'invalid-name', category: 'engagement' });
      analytics.trackEvent({ name: '123invalid', category: 'engagement' });
      analytics.trackEvent({ name: 'invalid name', category: 'engagement' });

      expect(mockGtag).not.toHaveBeenCalled();

      // Valid format
      analytics.trackEvent({ name: 'valid_event_name', category: 'engagement' });
      expect(mockGtag).toHaveBeenCalledWith('event', 'valid_event_name', expect.any(Object));
    });
  });

  describe('trackCalculation', () => {
    it('should send calculate_salary event with regime param', () => {
      analytics.trackCalculation({
        regime: '2025',
        hasInput: true,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculate_salary', expect.objectContaining({
        regime: '2025',
        has_input: true,
      }));
    });

    it('should include calculation time if provided', () => {
      analytics.trackCalculation({
        regime: '2026',
        hasInput: true,
        calculationTime: 123,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculate_salary', expect.objectContaining({
        regime: '2026',
        has_input: true,
        calculation_time: 123,
      }));
    });
  });

  describe('trackPresetClick', () => {
    it('should sanitize preset amount to generic label (preset_30M)', () => {
      analytics.trackPresetClick({
        presetLabel: 'preset_30M',
        presetIndex: 2,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'preset_click', expect.objectContaining({
        event_label: 'preset_30M',
        value: 2,
      }));
    });

    it('should reject PII (large numbers >1B)', () => {
      // This test validates the implementation rejects suspicious preset labels
      // In production, we should never see preset_2000M
      analytics.trackPresetClick({
        presetLabel: 'preset_2000M',  // Invalid: too large
        presetIndex: 99,
      });

      // The service should validate and reject this
      expect(mockGtag).not.toHaveBeenCalled();

      // Valid preset should work
      mockGtag.mockClear();
      analytics.trackPresetClick({
        presetLabel: 'preset_500M',
        presetIndex: 5,
      });
      expect(mockGtag).toHaveBeenCalledWith('event', 'preset_click', expect.objectContaining({
        event_label: 'preset_500M',
        value: 5,
      }));
    });
  });

  describe('trackRegimeSwitch', () => {
    it('should validate from !== to', () => {
      // Invalid: same regime
      analytics.trackRegimeSwitch({ from: '2025', to: '2025' });
      expect(mockGtag).not.toHaveBeenCalled();

      // Valid: different regimes
      analytics.trackRegimeSwitch({ from: '2025', to: '2026' });
      expect(mockGtag).toHaveBeenCalledWith('event', 'regime_switch', expect.objectContaining({
        from: '2025',
        to: '2026',
      }));
    });
  });

  describe('trackShare', () => {
    it('should send share event with method parameter', () => {
      analytics.trackShare({ method: 'url' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', expect.objectContaining({
        method: 'url',
      }));
    });

    it('should support copy method', () => {
      analytics.trackShare({ method: 'copy' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', expect.objectContaining({
        method: 'copy',
      }));
    });
  });

  // T051-T053: Performance tracking tests
  describe('Performance Tracking', () => {
    it('should track calculation duration in trackCalculation', () => {
      const calculationTime = 42.5;
      analytics.trackCalculation({
        regime: '2025',
        hasInput: true,
        calculationTime,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculate_salary', expect.objectContaining({
        calculation_time: calculationTime,
      }));
    });

    it('should handle trackCalculation without calculationTime parameter', () => {
      analytics.trackCalculation({
        regime: '2025',
        hasInput: true,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'calculate_salary', expect.not.objectContaining({
        calculation_time: expect.any(Number),
      }));
    });

    it('should handle missing Performance API gracefully', () => {
      // Mock missing performance API
      const originalPerformance = window.performance;
      // @ts-expect-error - Testing missing API
      delete window.performance;

      // Should not throw
      expect(() => {
        analytics.trackCalculation({
          regime: '2025',
          hasInput: true,
          // calculationTime would be calculated via performance.now() if available
        });
      }).not.toThrow();

      // Restore
      window.performance = originalPerformance;
    });
  });
});
