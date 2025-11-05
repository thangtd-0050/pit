import { ResultDisplay } from '@/components/ResultDisplay';
import { DeltasSummary } from '@/components/DeltasSummary';
import type { ComparisonResult, InsuranceBaseMode } from '@/types';

interface ComparisonViewProps {
  /** Comparison result with both regime calculations and deltas */
  comparison: ComparisonResult;
  /** Additional context for insurance base adjustments */
  gross?: number;
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
export function ComparisonView({
  comparison,
  gross,
  insuranceBaseMode,
  customInsuranceBase,
  regionalMin,
  locale,
  viewMode,
}: ComparisonViewProps) {
  return (
    <div className="space-y-6">
      {/* Regime results side-by-side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2025 Regime Result */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold">Chế độ 2025</h2>
            <span className="text-sm text-muted-foreground">
              Giảm trừ: 11M + 4.4M/người
            </span>
          </div>
          <ResultDisplay
            result={comparison.regime2025}
            gross={gross}
            insuranceBaseMode={insuranceBaseMode}
            customInsuranceBase={customInsuranceBase}
            regionalMin={regionalMin}
            locale={locale}
            viewMode={viewMode}
          />
        </div>

        {/* 2026 Regime Result */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold">Chế độ 2026</h2>
            <span className="text-sm text-muted-foreground">
              Giảm trừ: 15.5M + 6.2M/người
            </span>
          </div>
          <ResultDisplay
            result={comparison.regime2026}
            gross={gross}
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
