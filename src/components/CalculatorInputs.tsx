import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GrossSalaryInput } from '@/components/GrossSalaryInput';
import { DependentsInput } from '@/components/DependentsInput';
import { RegionSelector } from '@/components/RegionSelector';
import type { RegionId } from '@/types';

interface CalculatorInputsProps {
  gross: number;
  dependents: number;
  region: RegionId;
  onGrossChange: (value: number) => void;
  onDependentsChange: (value: number) => void;
  onRegionChange: (value: RegionId) => void;
}

export function CalculatorInputs({
  gross,
  dependents,
  region,
  onGrossChange,
  onDependentsChange,
  onRegionChange,
}: CalculatorInputsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin đầu vào</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <GrossSalaryInput value={gross} onChange={onGrossChange} />
        <DependentsInput value={dependents} onChange={onDependentsChange} />
        <RegionSelector value={region} onChange={onRegionChange} />
      </CardContent>
    </Card>
  );
}
