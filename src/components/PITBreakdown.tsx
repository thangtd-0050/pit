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
import type { PIT } from '@/types';

interface PITBreakdownProps {
  pit: PIT;
}

export function PITBreakdown({ pit }: PITBreakdownProps) {
  const { locale } = usePreferences();

  // Handle case where taxable income is 0 or negative
  if (pit.taxable <= 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Thuế thu nhập cá nhân (TNCN)</h3>
        <div className="rounded-md bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Thu nhập tính thuế: <span className="font-medium">0 VND</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Không phải nộp thuế TNCN</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Thuế thu nhập cá nhân (TNCN)</h3>

      <div className="rounded-md bg-muted p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Thu nhập tính thuế:</span>
          <span className="font-medium">{formatNumber(pit.taxable, locale)} VND</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bậc thuế</TableHead>
            <TableHead className="text-right">Thu nhập (VND)</TableHead>
            <TableHead className="text-right">Thuế (VND)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pit.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.label}</TableCell>
              <TableCell className="text-right">{formatNumber(item.slab, locale)}</TableCell>
              <TableCell className="text-right font-medium">
                {formatNumber(item.tax, locale)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2">
            <TableCell colSpan={2} className="font-bold">
              Tổng thuế TNCN
            </TableCell>
            <TableCell className="text-right font-bold text-primary">
              {formatNumber(pit.total, locale)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
