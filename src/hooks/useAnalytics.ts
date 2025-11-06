/**
 * React hook for analytics tracking
 * Provides memoized tracking methods for use in React components
 * @module hooks/useAnalytics
 */

import { useCallback } from 'react';
import { analytics } from '@/services/analytics';
import type {
  PageViewParams,
  AnalyticsEvent,
  CalculationEventParams,
  PresetClickEventParams,
  RegimeSwitchEventParams,
  ShareEventParams,
} from '@/types/analytics';

/**
 * Hook return type with all tracking methods
 */
interface UseAnalyticsReturn {
  trackPageView: (params: PageViewParams) => void;
  trackEvent: (event: AnalyticsEvent) => void;
  trackCalculation: (params: CalculationEventParams) => void;
  trackPresetClick: (params: PresetClickEventParams) => void;
  trackRegimeSwitch: (params: RegimeSwitchEventParams) => void;
  trackShare: (params: ShareEventParams) => void;
  isAvailable: () => boolean;
}

/**
 * React hook for analytics tracking
 *
 * @returns Object with memoized tracking methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { trackPageView, trackEvent } = useAnalytics();
 *
 *   useEffect(() => {
 *     trackPageView({ path: '/my-page' });
 *   }, [trackPageView]);
 *
 *   return <button onClick={() => trackEvent({ name: 'button_click' })}>
 *     Click me
 *   </button>;
 * }
 * ```
 */
export function useAnalytics(): UseAnalyticsReturn {
  const trackPageView = useCallback((params: PageViewParams) => {
    analytics.trackPageView(params);
  }, []);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  const trackCalculation = useCallback((params: CalculationEventParams) => {
    analytics.trackCalculation(params);
  }, []);

  const trackPresetClick = useCallback((params: PresetClickEventParams) => {
    analytics.trackPresetClick(params);
  }, []);

  const trackRegimeSwitch = useCallback((params: RegimeSwitchEventParams) => {
    analytics.trackRegimeSwitch(params);
  }, []);

  const trackShare = useCallback((params: ShareEventParams) => {
    analytics.trackShare(params);
  }, []);

  const isAvailable = useCallback(() => {
    return analytics.isAvailable();
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackCalculation,
    trackPresetClick,
    trackRegimeSwitch,
    trackShare,
    isAvailable,
  };
}
