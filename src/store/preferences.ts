import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PreferencesState } from '@/types';

/**
 * Global preferences store using Zustand.
 * Persisted to localStorage for persistence across sessions.
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      // Default state
      locale: 'vi-VN',
      darkMode: false,
      showDetails: true,
      viewMode: '2025',

      // Actions
      setLocale: (locale) => set({ locale }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setShowDetails: (showDetails) => set({ showDetails }),
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: 'pit-preferences', // localStorage key
    }
  )
);
