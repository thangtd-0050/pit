import { useState, useEffect } from 'react';
import { CalculatorInputs } from '@/components/CalculatorInputs';
import { ResultDisplay } from '@/components/ResultDisplay';
import { ComparisonView } from '@/components/ComparisonView';
import { calcAll, compareRegimes } from '@/lib/tax';
import {
  REGIME_2025,
  REGIME_2026,
  REGIONAL_MINIMUMS,
} from '@/config/constants';
import { usePreferences } from '@/store/preferences';
import type {
  RegionId,
  InsuranceBaseMode,
  CalculationResult,
  ComparisonResult,
} from '@/types';

export function SalaryCalculator() {
  // Input state
  const [gross, setGross] = useState(30_000_000);
  const [dependents, setDependents] = useState(2);
  const [region, setRegion] = useState<RegionId>('I');
  const [insuranceBaseMode, setInsuranceBaseMode] =
    useState<InsuranceBaseMode>('gross');
  const [customInsuranceBase, setCustomInsuranceBase] = useState(30_000_000);

  // View mode from preferences store (persisted)
  const { viewMode } = usePreferences();

  // Result state
  const [result2025, setResult2025] = useState<CalculationResult | null>(null);
  const [result2026, setResult2026] = useState<CalculationResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  // Calculate whenever inputs change
  useEffect(() => {
    if (gross > 0) {
      // Build inputs object with optional custom insurance base
      const inputs = {
        gross,
        dependents,
        region,
        ...(insuranceBaseMode === 'custom' && {
          insuranceBase: customInsuranceBase,
        }),
      };

      // Always calculate all modes for smooth switching
      const calc2025 = calcAll({ ...inputs, regime: REGIME_2025 });
      const calc2026 = calcAll({ ...inputs, regime: REGIME_2026 });
      const comp = compareRegimes(inputs);

      setResult2025(calc2025);
      setResult2026(calc2026);
      setComparison(comp);
    } else {
      setResult2025(null);
      setResult2026(null);
      setComparison(null);
    }
  }, [gross, dependents, region, insuranceBaseMode, customInsuranceBase]);

  // Determine which result to display based on view mode
  const currentResult =
    viewMode === '2025' ? result2025 : viewMode === '2026' ? result2026 : null;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <CalculatorInputs
        gross={gross}
        dependents={dependents}
        region={region}
        insuranceBaseMode={insuranceBaseMode}
        customInsuranceBase={customInsuranceBase}
        onGrossChange={setGross}
        onDependentsChange={setDependents}
        onRegionChange={setRegion}
        onInsuranceBaseModeChange={setInsuranceBaseMode}
        onCustomInsuranceBaseChange={setCustomInsuranceBase}
      />

      {/* Results */}
      {viewMode === 'compare' ? (
        comparison && (
          <ComparisonView
            comparison={comparison}
            gross={gross}
            insuranceBaseMode={insuranceBaseMode}
            customInsuranceBase={customInsuranceBase}
            regionalMin={REGIONAL_MINIMUMS[region].minWage}
          />
        )
      ) : (
        <ResultDisplay
          result={currentResult}
          gross={gross}
          insuranceBaseMode={insuranceBaseMode}
          customInsuranceBase={customInsuranceBase}
          regionalMin={REGIONAL_MINIMUMS[region].minWage}
        />
      )}
    </div>
  );
}
