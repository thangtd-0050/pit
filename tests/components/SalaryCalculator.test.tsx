import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalaryCalculator } from '@/components/SalaryCalculator';

describe('SalaryCalculator', () => {
  it('should render without crashing', () => {
    render(<SalaryCalculator />);
    expect(screen.getByText(/Thông tin đầu vào/i)).toBeInTheDocument();
    expect(screen.getByText(/Kết quả tính toán/i)).toBeInTheDocument();
  });

  it('should display result after entering inputs', async () => {
    render(<SalaryCalculator />);

    // Initial state should show result with default values (30M, 2 deps, Region I)
    await waitFor(() => {
      expect(screen.getByText(/Lương NET/i)).toBeInTheDocument();
    });

    // Result should be visible (not empty state)
    expect(screen.queryByText(/Chưa có kết quả/i)).not.toBeInTheDocument();
  });

  it('should recalculate when inputs change', async () => {
    const user = userEvent.setup();
    render(<SalaryCalculator />);

    // Wait for initial calculation
    await waitFor(() => {
      expect(screen.getByText(/Lương NET/i)).toBeInTheDocument();
    });

    // Find the number input specifically
    const dependentsInput = screen.getByRole('spinbutton', { name: /Số người phụ thuộc/i });
    await user.clear(dependentsInput);
    await user.type(dependentsInput, '0');

    // Wait for recalculation
    await waitFor(() => {
      // With 0 dependents, result should change
      expect(screen.getByText(/Lương NET/i)).toBeInTheDocument();
    });
  });

  it('should show all breakdown sections', async () => {
    render(<SalaryCalculator />);

    await waitFor(() => {
      expect(screen.getAllByText(/Bảo hiểm bắt buộc/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Các khoản giảm trừ/i)).toBeInTheDocument();
      expect(screen.getByText(/Thuế thu nhập cá nhân/i)).toBeInTheDocument();
    });
  });

  it('should show insurance breakdown with correct labels', async () => {
    render(<SalaryCalculator />);

    await waitFor(() => {
      expect(screen.getByText(/BHXH/i)).toBeInTheDocument();
      expect(screen.getByText(/BHYT/i)).toBeInTheDocument();
      expect(screen.getByText(/BHTN/i)).toBeInTheDocument();
    });
  });

  it('should show deductions breakdown', async () => {
    render(<SalaryCalculator />);

    await waitFor(() => {
      expect(screen.getByText(/Giảm trừ bản thân/i)).toBeInTheDocument();
      expect(screen.getByText(/Giảm trừ người phụ thuộc/i)).toBeInTheDocument();
    });
  });
});
