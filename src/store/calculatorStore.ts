import { create } from 'zustand';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

/**
 * Calculator state for lunch allowance feature
 */
interface CalculatorState {
  /**
   * Whether lunch allowance is enabled
   * @default false
   */
  hasLunchAllowance: boolean;

  /**
   * Lunch allowance amount in VND
   * @default 730000
   * @constraints Must be ≥ 0
   */
  lunchAllowance: number;

  /**
   * Toggle lunch allowance on/off
   *
   * @param has - true to enable, false to disable
   *
   * @remarks
   * - Disabling does NOT reset the amount value
   * - Amount is preserved for future re-enabling
   */
  setHasLunchAllowance: (has: boolean) => void;

  /**
   * Update lunch allowance amount
   *
   * @param amount - Lunch allowance amount in VND
   *
   * @remarks
   * - Negative values are clamped to 0
   * - Decimal values are floored to integer
   * - No maximum limit
   * - Does NOT automatically enable lunch allowance
   */
  setLunchAllowance: (amount: number) => void;
}

/**
 * Zustand store for calculator state
 * Manages lunch allowance state with URL persistence support
 */
export const useCalculatorStore = create<CalculatorState>((set) => ({
  // Initial state
  hasLunchAllowance: false,
  lunchAllowance: DEFAULT_LUNCH_ALLOWANCE,

  // Actions
  setHasLunchAllowance: (has) => set({ hasLunchAllowance: has }),

  setLunchAllowance: (amount) =>
    set({ lunchAllowance: Math.max(0, Math.floor(amount)) }),
}));
