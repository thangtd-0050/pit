/**
 * Unit tests for useAnalytics hook
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { setupAnalyticsMocks, cleanupAnalyticsMocks, mockGtag } from '../mocks/analytics';

describe('useAnalytics', () => {
  beforeEach(() => {
    setupAnalyticsMocks();
  });

  afterEach(() => {
    cleanupAnalyticsMocks();
  });

  it('should provide trackPageView method', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.trackPageView).toBeDefined();
    expect(typeof result.current.trackPageView).toBe('function');
  });

  it('should call analytics service when trackPageView is invoked', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.trackPageView({ path: '/test', title: 'Test Page' });

    expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/test',
      page_title: 'Test Page',
      page_referrer: undefined,
    });
  });

  it('should memoize trackPageView method', () => {
    const { result, rerender } = renderHook(() => useAnalytics());

    const firstRender = result.current.trackPageView;
    rerender();
    const secondRender = result.current.trackPageView;

    expect(firstRender).toBe(secondRender);
  });
});
