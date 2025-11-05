import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { usePreferences } from '@/store/preferences';
import type { Insurance } from '@/types';
import { useState } from 'react';

interface InsuranceBreakdownProps {
  insurance: Insurance;
  /** Custom insurance base entered by user (if any) */
  customBase?: number;
  /** Regional minimum wage for floor comparison */
  regionalMin?: number;
}

export function InsuranceBreakdown({
  insurance,
  customBase,
  regionalMin,
}: InsuranceBreakdownProps) {
  const { locale } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);

  // Detect if custom base was adjusted
  const usingCustomBase = customBase !== undefined && customBase > 0;
  const baseSIHI = insurance.bases.baseSIHI;
  const baseUI = insurance.bases.baseUI;

  // Check if floored (custom base below minimum)
  const wasFloored =
    usingCustomBase && regionalMin && customBase < regionalMin && baseSIHI === regionalMin;

  // Check if capped for SI/HI (above 46,800,000)
  const wasCappedSIHI = usingCustomBase && customBase > 46_800_000 && baseSIHI === 46_800_000;

  // Check if capped for UI (above 20x regional minimum)
  const capUI = regionalMin ? 20 * regionalMin : 0;
  const wasCappedUI = usingCustomBase && customBase > capUI && baseUI === capUI;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bảo hiểm bắt buộc</h3>

      {/* Helper messages when custom base was adjusted */}
      {(wasFloored || wasCappedSIHI || wasCappedUI) && (
        <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div className="space-y-1">
            {wasFloored && (
              <p>
                Mức đóng tùy chỉnh ({formatNumber(customBase!, locale)} VND) đã được điều chỉnh lên{' '}
                <strong>sàn tối thiểu theo vùng</strong> ({formatNumber(regionalMin!, locale)} VND).
              </p>
            )}
            {wasCappedSIHI && (
              <p>
                Mức đóng tùy chỉnh ({formatNumber(customBase!, locale)} VND) đã được điều chỉnh
                xuống <strong>trần BHXH, BHYT</strong> ({formatNumber(46_800_000, locale)} VND).
              </p>
            )}
            {wasCappedUI && (
              <p>
                Mức đóng tùy chỉnh ({formatNumber(customBase!, locale)} VND) đã được điều chỉnh
                xuống <strong>trần BHTN</strong> ({formatNumber(capUI, locale)} VND = 20 lần mức tối
                thiểu vùng).
              </p>
            )}
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại bảo hiểm</TableHead>
            <TableHead className="text-right">Tỷ lệ</TableHead>
            <TableHead className="text-right">Số tiền (VND)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">BHXH (Bảo hiểm xã hội)</TableCell>
            <TableCell className="text-right">8%</TableCell>
            <TableCell className="text-right font-medium">
              {formatNumber(insurance.si, locale)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">BHYT (Bảo hiểm y tế)</TableCell>
            <TableCell className="text-right">1.5%</TableCell>
            <TableCell className="text-right font-medium">
              {formatNumber(insurance.hi, locale)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">BHTN (Bảo hiểm thất nghiệp)</TableCell>
            <TableCell className="text-right">1%</TableCell>
            <TableCell className="text-right font-medium">
              {formatNumber(insurance.ui, locale)}
            </TableCell>
          </TableRow>
          <TableRow className="border-t-2">
            <TableCell colSpan={2} className="font-bold">
              Tổng bảo hiểm
            </TableCell>
            <TableCell className="text-right font-bold text-primary">
              {formatNumber(insurance.total, locale)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="text-sm">Chi tiết mức đóng</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div className="rounded-md bg-muted p-4 text-sm">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mức đóng BHXH/BHYT:</span>
                <span className="font-medium">
                  {formatNumber(insurance.bases.baseSIHI, locale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mức đóng BHTN:</span>
                <span className="font-medium">{formatNumber(insurance.bases.baseUI, locale)}</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
