import { describe, beforeEach, expect, it } from 'vitest';
import { useCalculatorStore } from '@/store/calculatorStore';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('Calculator Store - Lunch Allowance', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(false);
    store.setLunchAllowance(DEFAULT_LUNCH_ALLOWANCE);
  });

  it('should initialize with lunch allowance disabled', () => {
    const { hasLunchAllowance } = useCalculatorStore.getState();
    expect(hasLunchAllowance).toBe(false);
  });

  it('should initialize with default lunch allowance amount', () => {
    const { lunchAllowance } = useCalculatorStore.getState();
    expect(lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
  });

  it('should toggle lunch allowance on', () => {
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(true);

    const { hasLunchAllowance } = useCalculatorStore.getState();
    expect(hasLunchAllowance).toBe(true);
  });

  it('should toggle lunch allowance off', () => {
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(true);
    store.setHasLunchAllowance(false);

    const { hasLunchAllowance } = useCalculatorStore.getState();
    expect(hasLunchAllowance).toBe(false);
  });

  it('should update lunch allowance amount', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(1_500_000);

    const { lunchAllowance } = useCalculatorStore.getState();
    expect(lunchAllowance).toBe(1_500_000);
  });

  it('should clamp negative amounts to 0', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(-100);

    const { lunchAllowance } = useCalculatorStore.getState();
    expect(lunchAllowance).toBe(0);
  });

  it('should floor decimal amounts to integer', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(730_000.99);

    const { lunchAllowance } = useCalculatorStore.getState();
    expect(lunchAllowance).toBe(730_000);
  });

  it('should preserve amount when toggled off and on', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(1_500_000);
    store.setHasLunchAllowance(true);
    store.setHasLunchAllowance(false);

    const { lunchAllowance } = useCalculatorStore.getState();
    expect(lunchAllowance).toBe(1_500_000);
  });
});
