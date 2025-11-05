import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GrossSalaryInput } from '@/components/GrossSalaryInput';
import { InfoTooltip } from '@/components/InfoTooltip';
import type { InsuranceBaseMode } from '@/types';

interface InsuranceBaseInputProps {
  /** Current insurance base mode */
  mode: InsuranceBaseMode;
  /** Custom insurance base amount (VND) */
  customAmount: number;
  /** Callback when mode changes */
  onModeChange: (mode: InsuranceBaseMode) => void;
  /** Callback when custom amount changes */
  onCustomAmountChange: (amount: number) => void;
  /** Optional className for container */
  className?: string;
}

/**
 * Input for selecting insurance contribution base calculation method.
 * - "gross": Use gross salary as insurance base (default)
 * - "custom": User provides custom insurance base with floor/cap validation
 */
export function InsuranceBaseInput({
  mode,
  customAmount,
  onModeChange,
  onCustomAmountChange,
  className,
}: InsuranceBaseInputProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Label className="text-sm font-medium">Cơ sở đóng bảo hiểm</Label>
        <InfoTooltip
          content="Cơ sở đóng BHXH, BHYT, BHTN. Mặc định là lương Gross, có thể tùy chỉnh nếu công ty đóng trên mức khác. Hệ thống tự động áp dụng trần/sàn theo quy định."
          aria-label="Giải thích về cơ sở đóng bảo hiểm"
        />
      </div>

      <RadioGroup
        value={mode}
        onValueChange={(value) => onModeChange(value as InsuranceBaseMode)}
        className="space-y-3"
      >
        {/* Use gross salary */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="gross" id="insurance-base-gross" />
          <Label htmlFor="insurance-base-gross" className="font-normal cursor-pointer">
            Theo lương Gross (mặc định)
          </Label>
        </div>

        {/* Custom amount */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="insurance-base-custom" />
            <Label htmlFor="insurance-base-custom" className="font-normal cursor-pointer">
              Tùy chỉnh
            </Label>
          </div>

          {/* Custom amount input (only shown when custom mode is selected) */}
          {mode === 'custom' && (
            <div className="ml-6 mt-2">
              <GrossSalaryInput
                value={customAmount}
                onChange={onCustomAmountChange}
                min={0}
                max={1_000_000_000}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Hệ thống sẽ tự động áp dụng trần/sàn theo quy định
              </p>
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
}
