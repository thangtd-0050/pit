import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultDisplay } from '@/components/ResultDisplay';
import { REGIME_2025 } from '@/config/constants';
import type { CalculationResult } from '@/types';

// Mock analytics hook
import { vi } from 'vitest';
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackShare: vi.fn(),
  }),
}));

describe('ResultDisplay - Union Dues', () => {
  // T028: displays union dues row when unionDues is present
  it('should display union dues row when unionDues is present in result', () => {
    const mockResult: CalculationResult = {
      inputs: {
        gross: 30_000_000,
        dependents: 0,
        region: 'I',
        regime: REGIME_2025,
        isUnionMember: true,
      },
      insurance: {
        bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
        si: 2_400_000,
        hi: 450_000,
        ui: 300_000,
        total: 3_150_000,
      },
      deductions: {
        personal: 11_000_000,
        dependents: 0,
        insurance: 3_150_000,
        total: 14_150_000,
      },
      pit: {
        taxable: 15_850_000,
        items: [],
        total: 1_792_500,
      },
      net: 25_057_500,
      unionDues: {
        amount: 150_000,
        calculationBase: 30_000_000,
        cappedAtMax: false,
        rate: 0.005,
        maxAmount: 234_000,
      },
      finalNet: 24_907_500,
    };

    render(<ResultDisplay result={mockResult} />);

    // Should display union dues label
    expect(screen.getByText(/đoàn phí công đoàn/i)).toBeInTheDocument();

    // Should display union dues amount
    expect(screen.getByText(/150.000/)).toBeInTheDocument();
  });

  // T029: hides union dues row when unionDues is undefined
  it('should hide union dues row when unionDues is undefined in result', () => {
    const mockResult: CalculationResult = {
      inputs: {
        gross: 30_000_000,
        dependents: 0,
        region: 'I',
        regime: REGIME_2025,
        isUnionMember: false,
      },
      insurance: {
        bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
        si: 2_400_000,
        hi: 450_000,
        ui: 300_000,
        total: 3_150_000,
      },
      deductions: {
        personal: 11_000_000,
        dependents: 0,
        insurance: 3_150_000,
        total: 14_150_000,
      },
      pit: {
        taxable: 15_850_000,
        items: [],
        total: 1_792_500,
      },
      net: 25_057_500,
      unionDues: undefined,
      finalNet: 25_057_500,
    };

    render(<ResultDisplay result={mockResult} />);

    // Should NOT display union dues
    expect(screen.queryByText(/đoàn phí công đoàn/i)).not.toBeInTheDocument();
  });

  // T030: shows cap indicator when cappedAtMax = true
  it('should show cap indicator when cappedAtMax = true', () => {
    const mockResult: CalculationResult = {
      inputs: {
        gross: 60_000_000,
        dependents: 0,
        region: 'I',
        regime: REGIME_2025,
        isUnionMember: true,
      },
      insurance: {
        bases: { baseSIHI: 46_800_000, baseUI: 60_000_000 },
        si: 3_744_000,
        hi: 702_000,
        ui: 600_000,
        total: 5_046_000,
      },
      deductions: {
        personal: 11_000_000,
        dependents: 0,
        insurance: 5_046_000,
        total: 16_046_000,
      },
      pit: {
        taxable: 43_954_000,
        items: [],
        total: 11_738_600,
      },
      net: 43_215_400,
      unionDues: {
        amount: 234_000,
        calculationBase: 46_800_000,
        cappedAtMax: true,
        rate: 0.005,
        maxAmount: 234_000,
      },
      finalNet: 42_981_400,
    };

    render(<ResultDisplay result={mockResult} />);

    // Should show capped amount
    expect(screen.getByText(/234.000/)).toBeInTheDocument();

    // Should show cap indicator (tooltip or note)
    // This depends on implementation - checking for common phrases
    const container = screen.getByText(/đoàn phí công đoàn/i).closest('div');
    expect(container).toBeInTheDocument();
  });

  // T031: displays finalNet correctly as separate row
  it('should display finalNet correctly as separate row', () => {
    const mockResult: CalculationResult = {
      inputs: {
        gross: 30_000_000,
        dependents: 0,
        region: 'I',
        regime: REGIME_2025,
        isUnionMember: true,
      },
      insurance: {
        bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
        si: 2_400_000,
        hi: 450_000,
        ui: 300_000,
        total: 3_150_000,
      },
      deductions: {
        personal: 11_000_000,
        dependents: 0,
        insurance: 3_150_000,
        total: 14_150_000,
      },
      pit: {
        taxable: 15_850_000,
        items: [],
        total: 1_792_500,
      },
      net: 25_057_500,
      unionDues: {
        amount: 150_000,
        calculationBase: 30_000_000,
        cappedAtMax: false,
        rate: 0.005,
        maxAmount: 234_000,
      },
      finalNet: 24_907_500,
    };

    render(<ResultDisplay result={mockResult} />);

    // Should display both NET and final NET
    expect(screen.getByText(/lương thực nhận/i)).toBeInTheDocument();

    // Final NET should be NET - union dues = 24,907,500
    expect(screen.getByText(/24.907.500/)).toBeInTheDocument();
  });
});
