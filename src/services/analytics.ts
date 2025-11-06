/**
 * Google Analytics 4 integration service
 * Provides type-safe tracking methods with privacy protection and error handling
 * @module services/analytics
 */

import type {
  IAnalyticsService,
  PageViewParams,
  AnalyticsEvent,
  CalculationEventParams,
  PresetClickEventParams,
  RegimeSwitchEventParams,
  ShareEventParams,
} from '@/types/analytics';
import {
  isValidEventName,
  isValidPath,
  isSafePresetLabel,
  isValidRegimeSwitch,
} from '@/services/analytics/validation';

/**
 * Analytics Service implementation
 * Singleton service for Google Analytics 4 tracking
 */
class AnalyticsService implements IAnalyticsService {
  /**
   * Check if Google Analytics is available (not blocked by ad blockers)
   *
   * This method helps detect if gtag has been loaded successfully or if
   * it's been blocked by privacy extensions/ad blockers. Always check this
   * before sending tracking events in production.
   *
   * @returns {boolean} true if gtag function is available, false otherwise
   *
   * @example
   * ```ts
   * if (analytics.isAvailable()) {
   *   analytics.trackPageView({ path: '/home' });
   * }
   * ```
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  }

  /**
   * Track a page view or virtual page navigation
   *
   * Use this for Single Page Applications (SPA) to track route changes.
   * The gtag script is configured with send_page_view: false, so we must
   * manually track page views on navigation.
   *
   * **Validation Rules:**
   * - Path must start with "/" (e.g., "/2025", "/compare")
   * - Path max length: 100 characters
   * - Title is optional but recommended for better GA4 reports
   *
   * **Privacy:** No PII is collected. IP addresses are anonymized via gtag config.
   *
   * @param {PageViewParams} params - Page view parameters
   * @param {string} params.path - Virtual page path (must start with "/", max 100 chars)
   * @param {string} [params.title] - Optional page title for GA4 reports
   * @param {string} [params.referrer] - Optional referrer URL
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * // Track initial page load
   * analytics.trackPageView({
   *   path: '/2025',
   *   title: 'Calculator 2025'
   * });
   *
   * // Track view mode change
   * analytics.trackPageView({
   *   path: '/compare',
   *   title: 'Comparison View',
   *   referrer: '/2025'
   * });
   * ```
   */
  trackPageView(params: PageViewParams): void {
    try {
      // Validate path
      if (!isValidPath(params.path)) {
        if (import.meta.env.DEV) {
          console.warn('[Analytics] Invalid path (must start with "/" and max 100 chars)', params.path);
        }
        return;
      }

      if (!this.isAvailable()) {
        if (import.meta.env.DEV) {
          console.warn('[Analytics] gtag not available (blocked or not loaded)');
        }
        return;
      }

      // Call gtag with page_view event
      window.gtag!('event', 'page_view', {
        page_path: params.path,
        page_title: params.title,
        page_referrer: params.referrer,
      });

      if (import.meta.env.DEV) {
        console.log('[Analytics] Page view tracked:', params.path);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Analytics] Error tracking page view:', error);
      }
      // Swallow error in production - never break the app
    }
  }

  /**
   * Track a generic custom event
   *
   * Use this for tracking any custom user interaction or system event.
   * All specialized tracking methods (trackCalculation, trackPresetClick, etc.)
   * use this method internally.
   *
   * **Validation Rules:**
   * - Event name must be lowercase_snake_case (e.g., "button_click", "form_submit")
   * - Event name must start with a letter
   * - Category should describe the event type (e.g., "engagement", "interaction")
   *
   * @param {AnalyticsEvent} event - Event details
   * @param {string} event.name - Event name in lowercase_snake_case format
   * @param {string} [event.category] - Event category (e.g., "engagement", "interaction")
   * @param {string} [event.label] - Event label for additional context
   * @param {number} [event.value] - Numeric value for the event
   * @param {Record<string, any>} [event.customParams] - Additional custom parameters
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * // Track a button click
   * analytics.trackEvent({
   *   name: 'button_click',
   *   category: 'interaction',
   *   label: 'cta_signup',
   *   value: 1
   * });
   *
   * // Track with custom parameters
   * analytics.trackEvent({
   *   name: 'search_performed',
   *   category: 'engagement',
   *   customParams: {
   *     search_term: 'tax calculator',
   *     results_count: 42
   *   }
   * });
   * ```
   */
  trackEvent(event: AnalyticsEvent): void {
    try {
      if (!this.isAvailable()) {
        return;
      }

      // Validate event name format (lowercase_snake_case)
      if (!isValidEventName(event.name)) {
        if (import.meta.env.DEV) {
          console.warn('[Analytics] Invalid event name format:', event.name);
        }
        return;
      }

      window.gtag!('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParams,
      });

      if (import.meta.env.DEV) {
        console.log('[Analytics] Event tracked:', event.name);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Analytics] Error tracking event:', error);
      }
    }
  }

  /**
   * Track a salary calculation event
   *
   * Tracks when a user performs a salary calculation. Useful for understanding
   * which tax regimes are most commonly used and how long calculations take.
   *
   * **Privacy:** No actual salary amounts are tracked, only the regime selection
   * and whether the user provided input.
   *
   * @param {CalculationEventParams} params - Calculation parameters
   * @param {string} params.regime - Tax regime used ("2025", "2026", "compare")
   * @param {boolean} params.hasInput - Whether user entered a custom salary
   * @param {number} [params.calculationTime] - Optional calculation duration in milliseconds
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * const startTime = performance.now();
   * // ... perform calculation ...
   * const duration = performance.now() - startTime;
   *
   * analytics.trackCalculation({
   *   regime: '2025',
   *   hasInput: true,
   *   calculationTime: duration
   * });
   * ```
   */
  trackCalculation(params: CalculationEventParams): void {
    this.trackEvent({
      name: 'calculate_salary',
      category: 'engagement',
      customParams: {
        regime: params.regime,
        has_input: params.hasInput,
        ...(params.calculationTime && { calculation_time: params.calculationTime }),
      },
    });
  }

  /**
   * Track a preset button click
   *
   * Tracks when users select preset salary amounts (e.g., 30M, 50M, 100M).
   * Helps understand common salary ranges users are interested in.
   *
   * **Privacy Protection:** Automatically rejects preset labels with values > 1000M
   * as they might contain PII (personally identifiable information).
   *
   * @param {PresetClickEventParams} params - Preset click parameters
   * @param {string} params.presetLabel - Sanitized preset label (e.g., "preset_30M")
   * @param {number} params.presetIndex - Index of the preset in the list (0-based)
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * // User clicks "30M" preset (index 2 in the list)
   * analytics.trackPresetClick({
   *   presetLabel: 'preset_30M',
   *   presetIndex: 2
   * });
   * ```
   */
  trackPresetClick(params: PresetClickEventParams): void {
    // Privacy: Don't track if label looks like PII (contains large numbers)
    if (!isSafePresetLabel(params.presetLabel)) {
      if (import.meta.env.DEV) {
        console.warn('[Analytics] Blocked potential PII in preset click');
      }
      return;
    }

    this.trackEvent({
      name: 'preset_click',
      category: 'interaction',
      label: params.presetLabel,
      value: params.presetIndex,
    });
  }

  /**
   * Track a regime/view mode switch
   *
   * Tracks when users switch between different tax regimes or view modes
   * (2025, 2026, or comparison view). Useful for understanding user behavior
   * and which regimes users compare.
   *
   * **Validation:** Automatically rejects switches where from === to (no actual change).
   *
   * @param {RegimeSwitchEventParams} params - Regime switch parameters
   * @param {string} params.from - Source regime ("2025", "2026", or "compare")
   * @param {string} params.to - Target regime ("2025", "2026", or "compare")
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * // User switches from 2025 view to 2026 view
   * analytics.trackRegimeSwitch({
   *   from: '2025',
   *   to: '2026'
   * });
   *
   * // User switches to comparison mode
   * analytics.trackRegimeSwitch({
   *   from: '2025',
   *   to: 'compare'
   * });
   * ```
   */
  trackRegimeSwitch(params: RegimeSwitchEventParams): void {
    // Validate from !== to
    if (!isValidRegimeSwitch(params.from, params.to)) {
      if (import.meta.env.DEV) {
        console.warn('[Analytics] Invalid regime switch: from === to');
      }
      return;
    }

    this.trackEvent({
      name: 'regime_switch',
      category: 'interaction',
      customParams: {
        from: params.from,
        to: params.to,
      },
    });
  }

  /**
   * Track a share action
   *
   * Tracks when users share their calculation results via URL or copy to clipboard.
   * Helps measure engagement and viral potential of the calculator.
   *
   * @param {ShareEventParams} params - Share parameters
   * @param {('url' | 'copy')} params.method - Share method used ("url" or "copy")
   * @param {string} [params.regime] - Optional regime context for the share
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * // User clicks "Share URL" button
   * analytics.trackShare({
   *   method: 'url',
   *   regime: '2025'
   * });
   *
   * // User clicks "Copy" button
   * analytics.trackShare({
   *   method: 'copy'
   * });
   * ```
   */
  trackShare(params: ShareEventParams): void {
    this.trackEvent({
      name: 'share',
      category: 'engagement',
      customParams: {
        method: params.method,
        content_type: params.regime || 'general',
      },
    });
  }
}

/**
 * Singleton analytics service instance
 * @example
 * ```ts
 * import { analytics } from '@/services/analytics';
 *
 * analytics.trackPageView({ path: '/2025' });
 * ```
 */
export const analytics = new AnalyticsService();
