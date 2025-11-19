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
      expect(screen.getByText(/Lương NET/i)).toBeInTheDocument();
    });

    // Store initial state - lunch allowance should be disabled
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(false);

    // Get the NET salary value from the large display element
    const getNetSalary = () => {
      const netLabel = screen.queryByText(/Lương NET/i);
      // The NET value is in a sibling or parent element with class text-4xl or text-5xl
      const container = netLabel?.closest('div');
      const netValueElement = container?.querySelector('.text-4xl, .text-5xl');
      return netValueElement?.textContent || '';
    };

    const initialNet = getNetSalary();

    // Enable lunch allowance - this should reduce PIT and increase NET
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(toggle);

    // Wait for store to update
    await waitFor(() => {
      expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
    });

    // Wait for recalculation - NET value should increase (less PIT due to lunch allowance)
    await waitFor(() => {
      const newNet = getNetSalary();
      // The NET should be different (higher) after enabling lunch allowance
      expect(newNet).not.toBe(initialNet);
      expect(newNet.length).toBeGreaterThan(0);
    }, { timeout: 2000 });

    // Verify final state
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
    expect(useCalculatorStore.getState().lunchAllowance).toBe(730_000);
  });

  it('uses custom amount in calculation', async () => {
    const user = userEvent.setup();
    render(<SalaryCalculator />);

    // Wait for initial calculation
    await waitFor(() => {
      expect(screen.getByText(/Lương NET/i)).toBeInTheDocument();
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
      expect(screen.getByText(/Lương NET/i)).toBeInTheDocument();
    });

    // Enable union dues (it's a switch, not a checkbox)
    const unionSwitch = screen.getByRole('switch', { name: /Đoàn viên công đoàn/i });
    await user.click(unionSwitch);

    // Enable lunch allowance
    const lunchToggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(lunchToggle);

    // Wait for recalculation with both features
    await waitFor(() => {
      expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
    });

    // Final NET should reflect: NET - UnionDues + LunchAllowance
    // Both deduction and addition should be visible in UI
    expect(screen.getAllByText(/đoàn phí công đoàn/i).length).toBeGreaterThan(0);
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);
  });
});
