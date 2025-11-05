import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeltaItem } from '@/components/DeltaItem';
import type { ComparisonResult } from '@/types';

interface DeltasSummaryProps {
  /** Comparison result containing deltas */
  comparison: ComparisonResult;
  /** Optional className for container */
  className?: string;
}

/**
 * Display summary card showing all deltas between 2025 and 2026 regimes.
 * Highlights differences in deductions, taxable income, PIT, and net salary.
 */
export function DeltasSummary({ comparison, className }: DeltasSummaryProps) {
  const { deltas } = comparison;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">So sánh 2025 ↔ 2026</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hero NET salary delta */}
        <DeltaItem
          label="Lương NET"
          delta={deltas.netSalary}
          large
          className="pb-4 border-b"
        />

        {/* Deduction deltas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Các khoản giảm trừ
          </h3>
          <DeltaItem
            label="Giảm trừ bản thân"
            delta={deltas.personalDeduction}
          />
          <DeltaItem
            label="Giảm trừ người phụ thuộc"
            delta={deltas.dependentDeduction}
          />
          <DeltaItem
            label="Tổng giảm trừ"
            delta={deltas.totalDeductions}
            className="pt-2 border-t"
          />
        </div>

        {/* Insurance delta (should always be 0) */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Bảo hiểm
          </h3>
          <DeltaItem label="Bảo hiểm bắt buộc" delta={deltas.insurance} />
        </div>

        {/* Tax deltas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Thuế TNCN
          </h3>
          <DeltaItem
            label="Thu nhập tính thuế"
            delta={deltas.taxableIncome}
            inverted
          />
          <DeltaItem label="Thuế TNCN" delta={deltas.pit} inverted />
        </div>
      </CardContent>
    </Card>
  );
}
