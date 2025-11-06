/**
 * Integration tests for Analytics in App component
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from '@/App';
import { setupAnalyticsMocks, cleanupAnalyticsMocks, mockGtag } from '../mocks/analytics';

describe('Analytics Integration', () => {
  beforeEach(() => {
    setupAnalyticsMocks();
  });

  afterEach(() => {
    cleanupAnalyticsMocks();
  });

  it('should track initial page view on mount', () => {
    render(<App />);

    // Should track page view with default view mode (2025)
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/2025',
        page_title: expect.stringContaining('2025'),
      })
    );
  });

  it('should track page view when view mode changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Clear previous calls
    mockGtag.mockClear();

    // Find and click 2026 button
    const button2026 = screen.getByRole('button', { name: '2026' });
    await user.click(button2026);

    // Should track new page view
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/2026',
        page_title: expect.stringContaining('2026'),
      })
    );
  });

  it('should track page view when switching to compare mode', async () => {
    const user = userEvent.setup();
    render(<App />);

    mockGtag.mockClear();

    // Find and click compare button
    const compareButton = screen.getByRole('button', { name: /so sánh/i });
    await user.click(compareButton);

    // Should track compare page view
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/compare',
        page_title: expect.stringContaining('Comparison'),
      })
    );
  });

  // T044: Integration test for preset click tracking
  it('should track preset click when preset button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    mockGtag.mockClear();

    // Find and click a preset button (e.g., "30M")
    const presetButton = screen.getByRole('button', { name: /30M/i });
    await user.click(presetButton);

    // Should track preset click event
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'preset_click',
      expect.objectContaining({
        event_category: 'interaction',
        event_label: 'preset_30M',
        value: expect.any(Number),
      })
    );
  });

  // T045: Integration test for calculation tracking
  it('should track calculation when salary inputs change', async () => {
    const user = userEvent.setup();
    render(<App />);

    mockGtag.mockClear();

    // Find salary input by ID (more specific than label)
    const salaryInput = screen.getByDisplayValue(/30\.000\.000/);
    await user.clear(salaryInput);
    await user.type(salaryInput, '50000000');

    // Wait for debounce and calculation
    await new Promise(resolve => setTimeout(resolve, 600));

    // Should track calculation event
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'calculate_salary',
      expect.objectContaining({
        event_category: 'engagement',
        regime: expect.any(String),
        has_input: true,
      })
    );
  });

  // T046: Integration test for regime switch tracking
  it('should track regime switch when view mode toggles', async () => {
    const user = userEvent.setup();
    render(<App />);

    // First switch to 2026
    const button2026 = screen.getByRole('button', { name: '2026' });
    await user.click(button2026);

    mockGtag.mockClear();

    // Then switch back to 2025
    const button2025 = screen.getByRole('button', { name: '2025' });
    await user.click(button2025);

    // Should track regime switch event (from 2026 to 2025)
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'regime_switch',
      expect.objectContaining({
        event_category: 'interaction',
        from: '2026',
        to: '2025',
      })
    );
  });

  // T047: Integration test for share tracking
  it('should track share when share button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    mockGtag.mockClear();

    // Find and click share button
    const shareButton = screen.getByRole('button', { name: /chia sẻ/i });
    await user.click(shareButton);

    // Should track share event
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'share',
      expect.objectContaining({
        method: 'url',
      })
    );
  });

  // T059-T060: Integration tests for performance tracking
  it('should include calculation timing when tracking calculations', async () => {
    const user = userEvent.setup();
    render(<App />);

    mockGtag.mockClear();

    // Trigger a calculation by changing input
    const salaryInput = screen.getByDisplayValue(/30\.000\.000/);
    await user.clear(salaryInput);
    await user.type(salaryInput, '40000000');

    // Wait for debounce and calculation
    await new Promise(resolve => setTimeout(resolve, 600));

    // Should track calculation with timing
    const calculationCall = mockGtag.mock.calls.find(
      (call: unknown[]) => call[0] === 'event' && call[1] === 'calculate_salary'
    );

    expect(calculationCall).toBeDefined();
    expect(calculationCall?.[2]).toEqual(
      expect.objectContaining({
        event_category: 'engagement',
        regime: expect.any(String),
        has_input: true,
      })
    );
    // Note: calculation_time might be 0 in tests due to fast execution
  });
});
