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
}

export function DeductionsBreakdown({ deductions }: DeductionsBreakdownProps) {
  const { locale } = usePreferences();

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
          <TableRow className="border-t-2">
            <TableCell className="font-bold">Tổng giảm trừ</TableCell>
            <TableCell className="text-right font-bold text-primary">
              {formatNumber(deductions.total, locale)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
