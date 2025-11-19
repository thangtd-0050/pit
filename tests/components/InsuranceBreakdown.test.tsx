import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InsuranceBreakdown } from '@/components/InsuranceBreakdown';
import type { Insurance } from '@/types';

const mockInsurance: Insurance = {
  bases: {
    baseSIHI: 30_000_000,
    baseUI: 30_000_000,
  },
  si: 2_400_000, // 30M × 8%
  hi: 450_000, // 30M × 1.5%
  ui: 300_000, // 30M × 1%
  total: 3_150_000,
};

describe('InsuranceBreakdown', () => {
  it('should render insurance breakdown with amounts', () => {
    render(<InsuranceBreakdown insurance={mockInsurance} />);

    // Check headers
    expect(screen.getByText('Bảo hiểm bắt buộc')).toBeInTheDocument();

    // Check insurance types
    expect(screen.getByText('BHXH (Bảo hiểm xã hội)')).toBeInTheDocument();
    expect(screen.getByText('BHYT (Bảo hiểm y tế)')).toBeInTheDocument();
    expect(screen.getByText('BHTN (Bảo hiểm thất nghiệp)')).toBeInTheDocument();

    // Check rates
    expect(screen.getByText('8%')).toBeInTheDocument();
    expect(screen.getByText('1.5%')).toBeInTheDocument();
    expect(screen.getByText('1%')).toBeInTheDocument();
  });

  it('should render total insurance amount', () => {
    render(<InsuranceBreakdown insurance={mockInsurance} />);

    expect(screen.getByText('Tổng bảo hiểm')).toBeInTheDocument();
  });

  it('should display insurance bases when expanded', () => {
    render(<InsuranceBreakdown insurance={mockInsurance} region="I" regimeId="2026" />);

    // The base details are in a collapsible section
    const detailsButton = screen.getByText('Chi tiết mức đóng');
    expect(detailsButton).toBeInTheDocument();
  });

  describe('regime badges and tooltips', () => {
    it('should show 2026 badge when regimeId is 2026', () => {
      render(
        <InsuranceBreakdown
          insurance={mockInsurance}
          region="I"
          regimeId="2026"
        />
      );

      expect(screen.getByText('Quy định 2026')).toBeInTheDocument();
    });

    it('should show 2025 badge when regimeId is 2025', () => {
      render(
        <InsuranceBreakdown
          insurance={mockInsurance}
          region="I"
          regimeId="2025"
        />
      );

      expect(screen.getByText('Quy định 2025')).toBeInTheDocument();
    });

    it('should not show badge when regimeId is missing', () => {
      render(
        <InsuranceBreakdown
          insurance={mockInsurance}
          region="I"
        />
      );

      expect(screen.queryByText(/Quy định/)).not.toBeInTheDocument();
    });

    it('should not show badge when region is missing', () => {
      render(
        <InsuranceBreakdown
          insurance={mockInsurance}
          regimeId="2026"
        />
      );

      expect(screen.queryByText('Quy định 2026')).not.toBeInTheDocument();
    });

    it('should render info tooltips for all insurance types when region is provided', () => {
      const { container } = render(
        <InsuranceBreakdown
          insurance={mockInsurance}
          region="I"
          regimeId="2026"
        />
      );

      // Should have 3 info icons (one for each insurance type)
      const infoIcons = container.querySelectorAll('svg[class*="lucide-info"]');
      expect(infoIcons).toHaveLength(3);
    });

    it('should not render info tooltips when regionalMin is missing', () => {
      const { container } = render(
        <InsuranceBreakdown
          insurance={mockInsurance}
          regimeId="2026"
        />
      );

      // Should have no info icons
      const infoIcons = container.querySelectorAll('svg[class*="lucide-info"]');
      expect(infoIcons).toHaveLength(0);
    });
  });

  describe('custom base adjustments', () => {
    it('should show adjustment message when custom base is floored', () => {
      render(
        <InsuranceBreakdown
          insurance={{
            ...mockInsurance,
            bases: {
              baseSIHI: 5_310_000, // Floored to regional min (2026 Region I)
              baseUI: 5_310_000,
            },
          }}
          customBase={3_000_000} // Below regional min
          region="I"
          regimeId="2026"
        />
      );

      // Should show flooring message
      expect(screen.getByText(/sàn tối thiểu theo vùng/i)).toBeInTheDocument();
    });

    it('should show adjustment message when custom base is capped for SI/HI', () => {
      render(
        <InsuranceBreakdown
          insurance={{
            ...mockInsurance,
            bases: {
              baseSIHI: 46_800_000, // Capped
              baseUI: 106_200_000,
            },
          }}
          customBase={200_000_000} // Above cap
          region="I"
          regimeId="2026"
        />
      );

      // Should show capping message
      expect(screen.getByText(/trần BHXH, BHYT/i)).toBeInTheDocument();
    });

    it('should show adjustment message when custom base is capped for UI', () => {
      render(
        <InsuranceBreakdown
          insurance={{
            ...mockInsurance,
            bases: {
              baseSIHI: 46_800_000,
              baseUI: 106_200_000, // Capped (20 × 5,310,000)
            },
          }}
          customBase={200_000_000} // Above UI cap
          region="I"
          regimeId="2026"
        />
      );

      // Should show UI capping message
      expect(screen.getByText(/trần BHTN/i)).toBeInTheDocument();
    });
  });
});
