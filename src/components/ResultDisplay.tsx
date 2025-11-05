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
import { copyDetailsToClipboard } from '@/lib/format';
import type { CalculationResult, InsuranceBaseMode } from '@/types';

interface ResultDisplayProps {
  result: CalculationResult | null;
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

export function ResultDisplay({
  result,
  gross,
  insuranceBaseMode,
  customInsuranceBase,
  regionalMin,
  locale = 'vi-VN',
  viewMode = '2025',
}: ResultDisplayProps) {
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
        gross,
        dependents: result.inputs.dependents,
        region: result.inputs.region,
        insuranceBaseMode,
        customInsuranceBase,
        viewMode,
        locale,
      };

      const queryString = encodeStateToURL(state);
      const newURL = `${window.location.pathname}?${queryString}`;
      window.history.pushState({}, '', newURL);

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
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLink}
              className="gap-2"
            >
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyDetails}
              className="gap-2"
            >
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
        <NetSalaryHighlight amount={result.net} />

        <div className="space-y-6">
          <InsuranceBreakdown
            insurance={result.insurance}
            gross={gross}
            customBase={
              insuranceBaseMode === 'custom' ? customInsuranceBase : undefined
            }
            regionalMin={regionalMin}
          />
          <DeductionsBreakdown deductions={result.deductions} />
          <PITBreakdown pit={result.pit} />
        </div>
      </CardContent>
    </Card>
  );
}
