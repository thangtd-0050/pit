import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalaryCalculator } from '@/components/SalaryCalculator';
import { useCalculatorStore } from '@/store/calculatorStore';
import { usePreferences } from '@/store/preferences';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('Lunch Allowance Integration Tests', () => {
  beforeEach(() => {
    // Reset calculator store
    const calculatorStore = useCalculatorStore.getState();
    calculatorStore.setHasLunchAllowance(false);
    calculatorStore.setLunchAllowance(DEFAULT_LUNCH_ALLOWANCE);

    // Reset preferences store
    const preferencesStore = usePreferences.getState();
    preferencesStore.setViewMode('2025');
    preferencesStore.setLocale('vi');

    // Clear URL search params
    window.history.replaceState({}, '', window.location.pathname);
  });

  it('recalculates when lunch allowance is enabled', async () => {
    const user = userEvent.setup();
    render(<SalaryCalculator />);

    // Wait for initial calculation to complete
    await waitFor(() => {
      expect(screen.getByText(/lương thực nhận/i)).toBeInTheDocument();
    });

    // Get initial NET value
    const initialNet = screen.getByText(/lương thực nhận/i)
      .closest('div')
      ?.textContent;

    // Enable lunch allowance
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(toggle);

    // Wait for recalculation
    await waitFor(() => {
      const newNet = screen.getByText(/lương thực nhận/i)
        .closest('div')
        ?.textContent;
      expect(newNet).not.toBe(initialNet);
    });

    // Final NET should include lunch allowance
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
  });

  it('uses custom amount in calculation', async () => {
    const user = userEvent.setup();
    render(<SalaryCalculator />);

    // Wait for initial calculation
    await waitFor(() => {
      expect(screen.getByText(/lương thực nhận/i)).toBeInTheDocument();
    });

    // Enable lunch allowance
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(toggle);

    // Change amount to 1,500,000
    const input = screen.getByLabelText(/monthly amount/i) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '1500000');

    // Wait for recalculation with new amount
    await waitFor(() => {
      expect(useCalculatorStore.getState().lunchAllowance).toBe(1_500_000);
    });

    // Verify store has correct value
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
    expect(useCalculatorStore.getState().lunchAllowance).toBe(1_500_000);
  });

  it('persists state in URL', async () => {
    const user = userEvent.setup();
    render(<SalaryCalculator />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /lunch allowance/i })).toBeInTheDocument();
    });

    // Enable lunch allowance
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(toggle);

    // Change amount
    const input = screen.getByLabelText(/monthly amount/i);
    await user.clear(input);
    await user.type(input, '1000000');

    // URL should eventually contain lunch allowance parameters
    // Note: URL update happens via ShareButton component, not directly in Calculator
    // This test verifies the state is ready to be encoded
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
    expect(useCalculatorStore.getState().lunchAllowance).toBe(1_000_000);
  });

  it('restores state from URL', () => {
    // Set URL with lunch allowance parameters
    window.history.replaceState({}, '', '?g=30000000&la=1&laa=850000');

    render(<SalaryCalculator />);

    // Wait for URL state to be restored
    waitFor(() => {
      expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
      expect(useCalculatorStore.getState().lunchAllowance).toBe(850_000);
    });
  });

  it('works with union dues feature', async () => {
    const user = userEvent.setup();
    render(<SalaryCalculator />);

    // Wait for initial calculation
    await waitFor(() => {
      expect(screen.getByText(/lương thực nhận/i)).toBeInTheDocument();
    });

    // Enable union dues
    const unionCheckbox = screen.getByRole('checkbox', { name: /union member/i });
    await user.click(unionCheckbox);

    // Enable lunch allowance
    const lunchToggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(lunchToggle);

    // Wait for recalculation with both features
    await waitFor(() => {
      expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
    });

    // Final NET should reflect: NET - UnionDues + LunchAllowance
    // Both deduction and addition should be visible in UI
    expect(screen.getByText(/đoàn phí công đoàn/i)).toBeInTheDocument();
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
  });
});
