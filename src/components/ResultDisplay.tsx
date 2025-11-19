import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetSalaryHighlight } from '@/components/NetSalaryHighlight';
import { InsuranceBreakdown } from '@/components/InsuranceBreakdown';
import { DeductionsBreakdown } from '@/components/DeductionsBreakdown';
import { PITBreakdown } from '@/components/PITBreakdown';
import { EmptyState } from '@/components/EmptyState';
import { Share2, Copy, Check } from 'lucide-react';
import { encodeStateToURL } from '@/lib/url-state';
import { copyDetailsToClipboard, formatNumber } from '@/lib/format';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { CalculationResult, InsuranceBaseMode } from '@/types';

interface ResultDisplayProps {
  result: CalculationResult | null;
  /** Additional context for insurance base adjustments */
  insuranceBaseMode?: InsuranceBaseMode;
  customInsuranceBase?: number;
  /** Current locale for copy formatting */
  locale?: 'en-US' | 'vi-VN';
  /** Current view mode */
  viewMode?: '2025' | '2026' | 'compare';
}

export function ResultDisplay({
  result,
  insuranceBaseMode,
  customInsuranceBase,
  locale = 'vi-VN',
  viewMode = '2025',
}: ResultDisplayProps) {
  const { trackShare } = useAnalytics();
  const [shareSuccess, setShareSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!result) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  const handleShareLink = () => {
    try {
      const state = {
        gross: result.inputs.gross,
        dependents: result.inputs.dependents,
        region: result.inputs.region,
        insuranceBaseMode,
        customInsuranceBase,
        viewMode,
        locale,
        ...(result.inputs.isUnionMember && { isUnionMember: true }),
      };

      const queryString = encodeStateToURL(state);
      const newURL = `${window.location.pathname}?${queryString}`;
      window.history.pushState({}, '', newURL);

      // Track share action
      trackShare({ method: 'url' });

      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to share link:', error);
      alert('Không thể tạo link chia sẻ');
    }
  };

  const handleCopyDetails = async () => {
    try {
      await copyDetailsToClipboard(result, {
        gross: result.inputs.gross,
        dependents: result.inputs.dependents,
        region: result.inputs.region,
        regime: result.inputs.regime,
      });

      // Track copy action
      trackShare({ method: 'copy' });

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Không thể sao chép. Vui lòng thử lại.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Kết quả tính toán</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShareLink} className="gap-2">
              {shareSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Đã tạo link!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyDetails} className="gap-2">
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Đã sao chép!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Sao chép
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Display final NET if union member, otherwise regular NET */}
        <NetSalaryHighlight
          amount={result.finalNet}
        />

        <div className="space-y-6">
          <InsuranceBreakdown
            insurance={result.insurance}
            customBase={insuranceBaseMode === 'custom' ? customInsuranceBase : undefined}
            region={result.inputs.region}
            regimeId={result.inputs.regime.id}
          />
          <DeductionsBreakdown
            deductions={result.deductions}
            lunchAllowance={result.lunchAllowance}
          />
          <PITBreakdown pit={result.pit} />

          {/* Union Dues Breakdown - only show if user is union member */}
          {result.unionDues && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Đoàn phí công đoàn</h3>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Đoàn phí công đoàn
                    {result.unionDues.cappedAtMax && (
                      <span className="ml-1 text-xs text-amber-600" title="Đã áp mức tối đa 10% lương cơ sở">
                        (Đã đạt mức trần)
                      </span>
                    )}
                  </span>
                  <span className="font-medium text-red-600">
                    -{formatNumber(result.unionDues.amount, locale)} VND
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Final NET - only show when union dues is present */}
          {result.unionDues && (
            <div className="space-y-3">
              <div className="space-y-2 rounded-lg border-2 border-green-600 bg-green-50 p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Lương thực nhận cuối cùng</span>
                  <span className="text-lg text-green-600">
                    {formatNumber(result.finalNet, locale)} VND
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
