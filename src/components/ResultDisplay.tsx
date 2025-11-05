import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NetSalaryHighlight } from '@/components/NetSalaryHighlight';
import { InsuranceBreakdown } from '@/components/InsuranceBreakdown';
import { DeductionsBreakdown } from '@/components/DeductionsBreakdown';
import { PITBreakdown } from '@/components/PITBreakdown';
import { EmptyState } from '@/components/EmptyState';
import type { CalculationResult } from '@/types';

interface ResultDisplayProps {
  result: CalculationResult | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả tính toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <NetSalaryHighlight amount={result.net} />

        <div className="space-y-6">
          <InsuranceBreakdown insurance={result.insurance} />
          <DeductionsBreakdown deductions={result.deductions} />
          <PITBreakdown pit={result.pit} />
        </div>
      </CardContent>
    </Card>
  );
}
