/**
 * Analytics tracking types and interfaces for Google Analytics 4 integration
 * @module analytics
 */

/**
 * View modes available in the application
 */
export type ViewMode = '2025' | '2026' | 'compare';

/**
 * Base analytics event structure
 */
export interface AnalyticsEvent {
  /** Event name in lowercase_snake_case (e.g., 'preset_click', 'calculation') */
  name: string;
  /** Optional event category for grouping */
  category?: 'interaction' | 'engagement' | 'navigation';
  /** Optional human-readable label (max 100 chars, no PII) */
  label?: string;
  /** Optional numeric value (must be non-negative) */
  value?: number;
  /** Optional custom parameters (max 25 key-value pairs, no PII) */
  customParams?: Record<string, string | number | boolean>;
}

/**
 * Page view event parameters
 */
export interface PageViewParams {
  /** Virtual page path (e.g., '/2025', '/compare'). Must start with '/', max 100 chars */
  path: string;
  /** Optional page title for GA dashboard display (max 100 chars) */
  title?: string;
  /** Optional referrer URL */
  referrer?: string;
}

/**
 * Calculation event parameters
 */
export interface CalculationEventParams {
  /** Tax regime used for calculation */
  regime: '2025' | '2026';
  /** Whether user entered custom salary (true) or used preset (false) */
  hasInput: boolean;
  /** Optional calculation time in milliseconds (must be positive) */
  calculationTime?: number;
}

/**
 * Preset click event parameters
 */
export interface PresetClickEventParams {
  /** Preset identifier in format 'preset_{amount}M' (e.g., 'preset_30M') */
  presetLabel: string;
  /** Zero-based index of preset in array (0-7) */
  presetIndex: number;
}

/**
 * Regime switch event parameters
 */
export interface RegimeSwitchEventParams {
  /** Previous view mode */
  from: ViewMode;
  /** New view mode */
  to: ViewMode;
}

/**
 * Share event parameters
 */
export interface ShareEventParams {
  /** Share method used */
  method: 'url' | 'copy';
  /** Optional active regime when shared */
  regime?: string;
}

/**
 * Analytics service contract
 */
export interface IAnalyticsService {
  /**
   * Track a page view or virtual page navigation
   * @param params - Page view parameters
   */
  trackPageView(params: PageViewParams): void;

  /**
   * Track a generic custom event
   * @param event - Event details with name and optional parameters
   */
  trackEvent(event: AnalyticsEvent): void;

  /**
   * Track a salary calculation event
   * @param params - Calculation event parameters
   */
  trackCalculation(params: CalculationEventParams): void;

  /**
   * Track a preset button click
   * @param params - Preset click parameters
   */
  trackPresetClick(params: PresetClickEventParams): void;

  /**
   * Track a regime/view mode switch
   * @param params - Regime switch parameters
   */
  trackRegimeSwitch(params: RegimeSwitchEventParams): void;

  /**
   * Track a share action (URL or copy)
   * @param params - Share event parameters
   */
  trackShare(params: ShareEventParams): void;

  /**
   * Check if analytics tracking is available (gtag loaded, not blocked)
   * @returns true if gtag is available, false otherwise
   */
  isAvailable(): boolean;
}

/**
 * Global Window interface extensions for Google Analytics
 */
declare global {
  interface Window {
    /** Google Analytics gtag function */
    gtag?: (...args: unknown[]) => void;
    /** Google Analytics data layer */
    dataLayer?: unknown[];
  }
}

// Export empty object to make this a module
export {};
