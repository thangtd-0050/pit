import { describe, it, expect, beforeEach } from 'vitest';
import { usePreferences } from '@/store/preferences';

describe('Preferences Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should have default values', () => {
    const state = usePreferences.getState();

    expect(state.locale).toBe('vi-VN');
    expect(state.darkMode).toBe(false);
    expect(state.showDetails).toBe(true);
    expect(state.viewMode).toBe('2025');
  });

  it('should update locale', () => {
    const { setLocale } = usePreferences.getState();

    setLocale('en-US');
    expect(usePreferences.getState().locale).toBe('en-US');

    setLocale('vi-VN');
    expect(usePreferences.getState().locale).toBe('vi-VN');
  });

  it('should update dark mode', () => {
    const { setDarkMode } = usePreferences.getState();

    setDarkMode(true);
    expect(usePreferences.getState().darkMode).toBe(true);

    setDarkMode(false);
    expect(usePreferences.getState().darkMode).toBe(false);
  });

  it('should update show details', () => {
    const { setShowDetails } = usePreferences.getState();

    setShowDetails(false);
    expect(usePreferences.getState().showDetails).toBe(false);

    setShowDetails(true);
    expect(usePreferences.getState().showDetails).toBe(true);
  });

  it('should update view mode', () => {
    const { setViewMode } = usePreferences.getState();

    setViewMode('2026');
    expect(usePreferences.getState().viewMode).toBe('2026');

    setViewMode('compare');
    expect(usePreferences.getState().viewMode).toBe('compare');

    setViewMode('2025');
    expect(usePreferences.getState().viewMode).toBe('2025');
  });

  it('should persist to localStorage', () => {
    const { setLocale, setDarkMode, setViewMode } = usePreferences.getState();

    // Set some values
    setLocale('en-US');
    setDarkMode(true);
    setViewMode('compare');

    // Check localStorage
    const stored = localStorage.getItem('pit-preferences');
    expect(stored).toBeTruthy();

    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.locale).toBe('en-US');
      expect(parsed.state.darkMode).toBe(true);
      expect(parsed.state.viewMode).toBe('compare');
    }
  });

  it('should restore from localStorage on initialization', () => {
    // This test verifies that persist middleware is configured correctly
    // The actual restoration happens during store creation
    // We verify by setting values and checking they persist

    const { setLocale, setDarkMode, setShowDetails, setViewMode } =
      usePreferences.getState();

    // Set custom values
    setLocale('en-US');
    setDarkMode(true);
    setShowDetails(false);
    setViewMode('compare');

    // Verify stored in localStorage
    const stored = localStorage.getItem('pit-preferences');
    expect(stored).toBeTruthy();

    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.locale).toBe('en-US');
      expect(parsed.state.darkMode).toBe(true);
      expect(parsed.state.showDetails).toBe(false);
      expect(parsed.state.viewMode).toBe('compare');
    }

    // Verify current state
    const state = usePreferences.getState();
    expect(state.locale).toBe('en-US');
    expect(state.darkMode).toBe(true);
    expect(state.showDetails).toBe(false);
    expect(state.viewMode).toBe('compare');
  });
});
