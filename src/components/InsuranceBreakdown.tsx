import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { usePreferences } from '@/store/preferences';
import type { Insurance } from '@/types';
import { useState } from 'react';

interface InsuranceBreakdownProps {
  insurance: Insurance;
}

export function InsuranceBreakdown({ insurance }: InsuranceBreakdownProps) {
  const { locale } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bảo hiểm bắt buộc</h3>

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
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div className="rounded-md bg-muted p-4 text-sm">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mức đóng BHXH/BHYT:</span>
                <span className="font-medium">{formatNumber(insurance.bases.baseSIHI, locale)}</span>
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
