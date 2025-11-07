import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/lib/format';
import { usePreferences } from '@/store/preferences';
import type { Deductions } from '@/types';

interface DeductionsBreakdownProps {
  deductions: Deductions;
  lunchAllowance?: number; // Tax-exempt lunch allowance
}

export function DeductionsBreakdown({ deductions, lunchAllowance }: DeductionsBreakdownProps) {
  const { locale } = usePreferences();

  // Calculate total deductions including lunch allowance
  const totalWithLunchAllowance = deductions.total + (lunchAllowance ?? 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Các khoản giảm trừ</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Khoản giảm trừ</TableHead>
            <TableHead className="text-right">Số tiền (VND)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Giảm trừ bản thân</TableCell>
            <TableCell className="text-right font-medium">
              {formatNumber(deductions.personal, locale)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Giảm trừ người phụ thuộc</TableCell>
            <TableCell className="text-right font-medium">
              {formatNumber(deductions.dependents, locale)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Bảo hiểm bắt buộc</TableCell>
            <TableCell className="text-right font-medium">
              {formatNumber(deductions.insurance, locale)}
            </TableCell>
          </TableRow>
          {/* Lunch Allowance - Tax-exempt income */}
          {lunchAllowance !== undefined && lunchAllowance > 0 && (
            <TableRow>
              <TableCell className="font-medium">
                Phụ cấp ăn trưa (miễn thuế)
                <span className="ml-1 text-xs text-green-600" title="Thu nhập không chịu thuế TNCN">
                  ✓
                </span>
              </TableCell>
              <TableCell className="text-right font-medium text-green-600">
                {formatNumber(lunchAllowance, locale)}
              </TableCell>
            </TableRow>
          )}
          <TableRow className="border-t-2">
            <TableCell className="font-bold">Tổng giảm trừ</TableCell>
            <TableCell className="text-right font-bold text-primary">
              {formatNumber(totalWithLunchAllowance, locale)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
