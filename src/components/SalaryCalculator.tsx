import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { CalculatorInputs } from '@/components/CalculatorInputs';
import { ResultDisplay } from '@/components/ResultDisplay';
import { calcAll, compareRegimes } from '@/lib/tax';
import { REGIME_2025, REGIME_2026 } from '@/config/constants';
import { usePreferences } from '@/store/preferences';
import { useCalculatorStore } from '@/store/calculatorStore';
import { decodeStateFromURL } from '@/lib/url-state';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { RegionId, InsuranceBaseMode, CalculationResult, ComparisonResult } from '@/types';

// Lazy load ComparisonView for code splitting
const ComparisonView = lazy(() => import('@/components/ComparisonView'));

export function SalaryCalculator() {
  // Input state
  const [gross, setGross] = useState(30_000_000);
  const [dependents, setDependents] = useState(2);
  const [region, setRegion] = useState<RegionId>('I');
  const [insuranceBaseMode, setInsuranceBaseMode] = useState<InsuranceBaseMode>('gross');
  const [customInsuranceBase, setCustomInsuranceBase] = useState(30_000_000);
  const [isUnionMember, setIsUnionMember] = useState(false);

  // Lunch allowance state from calculator store
  const { hasLunchAllowance, lunchAllowance } = useCalculatorStore();

  // View mode from preferences store (persisted)
  const { viewMode, setViewMode, setLocale, locale } = usePreferences();

  // Analytics hook
  const { trackPageView, trackCalculation, trackRegimeSwitch } = useAnalytics();

  // Track previous viewMode for regime switch detection
  const prevViewMode = useRef(viewMode);

  // Track initial page load and view mode changes
  useEffect(() => {
    const path = viewMode === 'compare' ? '/compare' : `/${viewMode}`;
    trackPageView({
      path,
      title: `Salary Calculator ${viewMode === 'compare' ? 'Comparison' : viewMode}`,
    });

    // Track regime switch if view mode changed
    if (prevViewMode.current !== viewMode) {
      trackRegimeSwitch({
        from: prevViewMode.current,
        to: viewMode,
      });
      prevViewMode.current = viewMode;
    }
  }, [viewMode, trackPageView, trackRegimeSwitch]);

  // Restore state from URL on mount
  useEffect(() => {
    const urlState = decodeStateFromURL(window.location.search);
    const { setHasLunchAllowance, setLunchAllowance } = useCalculatorStore.getState();

    if (urlState.gross !== undefined) setGross(urlState.gross);
    if (urlState.dependents !== undefined) setDependents(urlState.dependents);
    if (urlState.region !== undefined) setRegion(urlState.region);
    if (urlState.insuranceBaseMode !== undefined) setInsuranceBaseMode(urlState.insuranceBaseMode);
    if (urlState.customInsuranceBase !== undefined)
      setCustomInsuranceBase(urlState.customInsuranceBase);
    if (urlState.viewMode !== undefined) setViewMode(urlState.viewMode);
    if (urlState.locale !== undefined) setLocale(urlState.locale);
    if (urlState.isUnionMember !== undefined) setIsUnionMember(urlState.isUnionMember);
    if (urlState.hasLunchAllowance !== undefined) setHasLunchAllowance(urlState.hasLunchAllowance);
    if (urlState.lunchAllowance !== undefined) setLunchAllowance(urlState.lunchAllowance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Result state
  const [result2025, setResult2025] = useState<CalculationResult | null>(null);
  const [result2026, setResult2026] = useState<CalculationResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  // Calculate whenever inputs change
  useEffect(() => {
    if (gross > 0) {
      const startTime = performance.now();

      // Build inputs object with optional custom insurance base and union member status
      const inputs = {
        gross,
        dependents,
        region,
        ...(insuranceBaseMode === 'custom' && {
          insuranceBase: customInsuranceBase,
        }),
        ...(isUnionMember && {
          isUnionMember: true,
        }),
      };

      // Determine lunch allowance value (only if enabled)
      const lunchAllowanceValue = hasLunchAllowance ? lunchAllowance : undefined;

      // Always calculate all modes for smooth switching
      const calc2025 = calcAll({ ...inputs, regime: REGIME_2025 }, lunchAllowanceValue);
      const calc2026 = calcAll({ ...inputs, regime: REGIME_2026 }, lunchAllowanceValue);
      const comp = compareRegimes(inputs, lunchAllowanceValue);

      setResult2025(calc2025);
      setResult2026(calc2026);
      setComparison(comp);

      // Track calculation with performance timing
      const calculationTime = Math.round(performance.now() - startTime);
      const currentRegime = viewMode === 'compare' ? '2025' : viewMode;

      trackCalculation({
        regime: currentRegime,
        hasInput: gross > 0,
        calculationTime,
      });
    } else {
      setResult2025(null);
      setResult2026(null);
      setComparison(null);
    }
  }, [gross, dependents, region, insuranceBaseMode, customInsuranceBase, isUnionMember, hasLunchAllowance, lunchAllowance, viewMode, trackCalculation]);

  // Determine which result to display based on view mode
  const currentResult = viewMode === '2025' ? result2025 : viewMode === '2026' ? result2026 : null;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <CalculatorInputs
        gross={gross}
        dependents={dependents}
        region={region}
        insuranceBaseMode={insuranceBaseMode}
        customInsuranceBase={customInsuranceBase}
        isUnionMember={isUnionMember}
        onGrossChange={setGross}
        onDependentsChange={setDependents}
        onRegionChange={setRegion}
        onInsuranceBaseModeChange={setInsuranceBaseMode}
        onCustomInsuranceBaseChange={setCustomInsuranceBase}
        onUnionMemberChange={setIsUnionMember}
      />

      {/* Results */}
      {viewMode === 'compare' ? (
        comparison && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                Đang tải...
              </div>
            }
          >
            <ComparisonView
              comparison={comparison}
              insuranceBaseMode={insuranceBaseMode}
              customInsuranceBase={customInsuranceBase}
              locale={locale}
              viewMode={viewMode}
            />
          </Suspense>
        )
      ) : (
        <ResultDisplay
          result={currentResult}
          insuranceBaseMode={insuranceBaseMode}
          customInsuranceBase={customInsuranceBase}
          locale={locale}
          viewMode={viewMode}
        />
      )}
    </div>
  );
}
