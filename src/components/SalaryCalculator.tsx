import { useState, useEffect } from 'react';
import { CalculatorInputs } from '@/components/CalculatorInputs';
import { ResultDisplay } from '@/components/ResultDisplay';
import { calcAll } from '@/lib/tax';
import { REGIME_2025 } from '@/config/constants';
import type { RegionId, CalculationResult } from '@/types';

export function SalaryCalculator() {
  // Input state
  const [gross, setGross] = useState(30_000_000);
  const [dependents, setDependents] = useState(2);
  const [region, setRegion] = useState<RegionId>('I');

  // Result state
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Calculate whenever inputs change
  useEffect(() => {
    if (gross > 0) {
      const calculatedResult = calcAll({
        gross,
        dependents,
        region,
        regime: REGIME_2025,
      });
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [gross, dependents, region]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CalculatorInputs
        gross={gross}
        dependents={dependents}
        region={region}
        onGrossChange={setGross}
        onDependentsChange={setDependents}
        onRegionChange={setRegion}
      />
      <ResultDisplay result={result} />
    </div>
  );
}
