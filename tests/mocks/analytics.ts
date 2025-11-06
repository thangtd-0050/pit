/**
 * Mock analytics utilities for testing
 */
import { vi } from 'vitest';

// Extend Window interface for test environment
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Mock gtag function for testing
 */
export const mockGtag = vi.fn();

/**
 * Mock dataLayer array for testing
 */
export const mockDataLayer: unknown[] = [];

/**
 * Setup analytics mocks in test environment
 */
export function setupAnalyticsMocks() {
  // Reset mocks
  mockGtag.mockClear();
  mockDataLayer.length = 0;

  // Assign to window (type assertion needed for test environment)
  (window as Window).gtag = mockGtag;
  (window as Window).dataLayer = mockDataLayer;
}

/**
 * Cleanup analytics mocks after tests
 */
export function cleanupAnalyticsMocks() {
  mockGtag.mockClear();
  delete (window as Window).gtag;
  delete (window as Window).dataLayer;
}
