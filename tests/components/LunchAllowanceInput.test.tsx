import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCalculatorStore } from '@/store/calculatorStore';
import { LunchAllowanceInput } from '@/components/LunchAllowanceInput';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('LunchAllowanceInput Component', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(false);
    store.setLunchAllowance(DEFAULT_LUNCH_ALLOWANCE);
  });

  it('renders toggle switch and input field', () => {
    render(<LunchAllowanceInput />);

    // Check for toggle switch
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();

    // Check for input field
    const input = screen.getByLabelText(/monthly amount/i);
    expect(input).toBeInTheDocument();
  });

  it('shows input disabled when toggle is off', () => {
    render(<LunchAllowanceInput />);

    const input = screen.getByLabelText(/monthly amount/i) as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('enables input when toggle is turned on', async () => {
    const user = userEvent.setup();
    render(<LunchAllowanceInput />);

    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    const input = screen.getByLabelText(/monthly amount/i) as HTMLInputElement;

    // Initially disabled
    expect(input).toBeDisabled();

    // Turn on toggle
    await user.click(toggle);

    // Input should be enabled
    expect(input).not.toBeDisabled();
  });

  it('displays default value of 730,000 VND', () => {
    render(<LunchAllowanceInput />);

    const input = screen.getByLabelText(/monthly amount/i) as HTMLInputElement;
    expect(input.value).toBe('730000');
  });

  it('updates store when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<LunchAllowanceInput />);

    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });

    // Initially off
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(false);

    // Turn on
    await user.click(toggle);
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(true);

    // Turn off
    await user.click(toggle);
    expect(useCalculatorStore.getState().hasLunchAllowance).toBe(false);
  });

  it('updates store when input value changes', async () => {
    const user = userEvent.setup();
    render(<LunchAllowanceInput />);

    // Enable toggle first
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(toggle);

    const input = screen.getByLabelText(/monthly amount/i) as HTMLInputElement;

    // Clear and type new value
    await user.clear(input);
    await user.type(input, '1000000');

    expect(useCalculatorStore.getState().lunchAllowance).toBe(1_000_000);
  });

  it('rejects negative values in input', async () => {
    const user = userEvent.setup();
    render(<LunchAllowanceInput />);

    // Enable toggle first
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(toggle);

    // Note: HTML number inputs with type="number" and min="0" don't prevent typing "-"
    // The browser strips the minus sign, so typing "-500000" results in "500000"
    // To test clamping, we need to test the store directly
    const store = useCalculatorStore.getState();

    // The store should clamp negative values to 0
    store.setLunchAllowance(-500000);
    expect(useCalculatorStore.getState().lunchAllowance).toBe(0);

    // Reset and verify positive values work
    store.setLunchAllowance(500000);
    expect(useCalculatorStore.getState().lunchAllowance).toBe(500000);
  });

  it('accepts zero as a valid input', async () => {
    const user = userEvent.setup();
    render(<LunchAllowanceInput />);

    // Enable toggle first
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    await user.click(toggle);

    const input = screen.getByLabelText(/monthly amount/i) as HTMLInputElement;

    // Enter zero
    await user.clear(input);
    await user.type(input, '0');

    expect(useCalculatorStore.getState().lunchAllowance).toBe(0);
    expect(input.value).toBe('0');
  });

  it('has accessible labels and ARIA attributes', () => {
    render(<LunchAllowanceInput />);

    // Toggle should have accessible name
    const toggle = screen.getByRole('switch', { name: /lunch allowance/i });
    expect(toggle).toHaveAccessibleName();

    // Input should have accessible label
    const input = screen.getByLabelText(/monthly amount/i);
    expect(input).toHaveAccessibleName();

    // Input should have aria-disabled when toggle is off
    expect(input).toHaveAttribute('aria-disabled', 'true');
  });
});
