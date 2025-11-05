import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonView } from '@/components/ComparisonView';
import { compareRegimes } from '@/lib/tax';

describe('ComparisonView', () => {
  it('should render both regime results', () => {
    const comparison = compareRegimes({
      gross: 30_000_000,
      dependents: 2,
      region: 'I',
    });

    render(<ComparisonView comparison={comparison} />);

    // Check for regime labels
    expect(screen.getByText('Chế độ 2025')).toBeInTheDocument();
    expect(screen.getByText('Chế độ 2026')).toBeInTheDocument();

    // Check for comparison heading
    expect(screen.getByText('So sánh 2025 ↔ 2026')).toBeInTheDocument();
  });

  it('should display delta summary', () => {
    const comparison = compareRegimes({
      gross: 60_000_000,
      dependents: 3,
      region: 'II',
    });

    render(<ComparisonView comparison={comparison} />);

    // Delta summary should be present
    expect(screen.getByText('Lương NET')).toBeInTheDocument();
    expect(screen.getAllByText('Giảm trừ bản thân').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Giảm trừ người phụ thuộc').length).toBeGreaterThan(0);
  });

  it('should show both NET salary results', () => {
    const comparison = compareRegimes({
      gross: 100_000_000,
      dependents: 5,
      region: 'I',
    });

    render(<ComparisonView comparison={comparison} />);

    // Both NET salaries should be visible (looking for "Lương NET (Thực nhận)")
    const netLabels = screen.getAllByText(/Lương NET/i);
    expect(netLabels.length).toBeGreaterThanOrEqual(2);
  });

  it('should render with custom insurance base', () => {
    const comparison = compareRegimes({
      gross: 50_000_000,
      dependents: 2,
      region: 'I',
      insuranceBase: 30_000_000,
    });

    render(<ComparisonView comparison={comparison} />);

    // Should render without crashing
    expect(screen.getByText('Chế độ 2025')).toBeInTheDocument();
    expect(screen.getByText('Chế độ 2026')).toBeInTheDocument();
  });

  it('should display deduction amounts for both regimes', () => {
    const comparison = compareRegimes({
      gross: 40_000_000,
      dependents: 1,
      region: 'III',
    });

    render(<ComparisonView comparison={comparison} />);

    // Check for deduction labels (should appear in both result cards)
    expect(screen.getAllByText('Giảm trừ bản thân').length).toBeGreaterThan(0);
    
    // 2025 should show 11M personal deduction (appears multiple times)
    const deductionTexts = screen.getAllByText(/11\.000\.000|11,000,000/);
    expect(deductionTexts.length).toBeGreaterThan(0);
  });

  it('should display insurance breakdowns for both regimes', () => {
    const comparison = compareRegimes({
      gross: 35_000_000,
      dependents: 0,
      region: 'IV',
    });

    render(<ComparisonView comparison={comparison} />);

    // Insurance labels should appear (multiple times for both cards)
    const insuranceLabels = screen.getAllByText(/Bảo hiểm/i);
    expect(insuranceLabels.length).toBeGreaterThan(0);
  });
});
