import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GrossSalaryInput } from '@/components/GrossSalaryInput';
import { DependentsInput } from '@/components/DependentsInput';
import { RegionSelector } from '@/components/RegionSelector';
import { InsuranceBaseInput } from '@/components/InsuranceBaseInput';
import type { RegionId, InsuranceBaseMode } from '@/types';

interface CalculatorInputsProps {
  gross: number;
  dependents: number;
  region: RegionId;
  insuranceBaseMode: InsuranceBaseMode;
  customInsuranceBase: number;
  onGrossChange: (value: number) => void;
  onDependentsChange: (value: number) => void;
  onRegionChange: (value: RegionId) => void;
  onInsuranceBaseModeChange: (mode: InsuranceBaseMode) => void;
  onCustomInsuranceBaseChange: (amount: number) => void;
}

export function CalculatorInputs({
  gross,
  dependents,
  region,
  insuranceBaseMode,
  customInsuranceBase,
  onGrossChange,
  onDependentsChange,
  onRegionChange,
  onInsuranceBaseModeChange,
  onCustomInsuranceBaseChange,
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
        <InsuranceBaseInput
          mode={insuranceBaseMode}
          customAmount={customInsuranceBase}
          onModeChange={onInsuranceBaseModeChange}
          onCustomAmountChange={onCustomInsuranceBaseChange}
        />
      </CardContent>
    </Card>
  );
}
