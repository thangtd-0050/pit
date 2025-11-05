import { ResultDisplay } from '@/components/ResultDisplay';
import { DeltasSummary } from '@/components/DeltasSummary';
import type { ComparisonResult, InsuranceBaseMode } from '@/types';

interface ComparisonViewProps {
  /** Comparison result with both regime calculations and deltas */
  comparison: ComparisonResult;
  /** Additional context for insurance base adjustments */
  insuranceBaseMode?: InsuranceBaseMode;
  customInsuranceBase?: number;
  regionalMin?: number;
  /** Current locale for copy formatting */
  locale?: 'en-US' | 'vi-VN';
  /** Current view mode */
  viewMode?: '2025' | '2026' | 'compare';
}

/**
 * Side-by-side comparison view showing 2025 and 2026 regime results with delta summary.
 * Responsive grid layout: stacked on mobile, side-by-side on larger screens.
 */
function ComparisonView({
  comparison,
  insuranceBaseMode,
  customInsuranceBase,
  regionalMin,
  locale,
  viewMode,
}: ComparisonViewProps) {
  return (
    <div className="space-y-6">
      {/* Side-by-side regime cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2025 Regime */}
        <div>
          <ResultDisplay
            result={comparison.regime2025}
            insuranceBaseMode={insuranceBaseMode}
            customInsuranceBase={customInsuranceBase}
            regionalMin={regionalMin}
            locale={locale}
            viewMode={viewMode}
          />
        </div>

        {/* 2026 Regime */}
        <div>
          <ResultDisplay
            result={comparison.regime2026}
            insuranceBaseMode={insuranceBaseMode}
            customInsuranceBase={customInsuranceBase}
            regionalMin={regionalMin}
            locale={locale}
            viewMode={viewMode}
          />
        </div>
      </div>

      {/* Delta summary card */}
      <DeltasSummary comparison={comparison} />
    </div>
  );
}

// Named export for tests
export { ComparisonView };

// Default export for lazy loading
export default ComparisonView;
