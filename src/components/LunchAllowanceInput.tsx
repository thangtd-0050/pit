import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useCalculatorStore } from '@/store/calculatorStore';

/**
 * LunchAllowanceInput Component
 *
 * Provides UI for enabling/disabling lunch allowance and setting the monthly amount.
 * The lunch allowance is tax-exempt and added to the final NET salary.
 *
 * Features:
 * - Toggle switch to enable/disable lunch allowance
 * - Input field for monthly amount (VND)
 * - Input validation: non-negative integers only
 * - Disabled state when toggle is off
 * - Accessible labels and ARIA attributes
 *
 * @example
 * ```tsx
 * <LunchAllowanceInput />
 * ```
 */
export function LunchAllowanceInput() {
  const { hasLunchAllowance, lunchAllowance, setHasLunchAllowance, setLunchAllowance } =
    useCalculatorStore();

  /**
   * Handle toggle switch change
   * Enables or disables the lunch allowance feature
   */
  const handleToggleChange = (checked: boolean) => {
    setHasLunchAllowance(checked);
  };

  /**
   * Handle input value change
   * Validates and updates the lunch allowance amount
   * - Rejects negative values (clamped to 0 by store)
   * - Floors decimal values to integers
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string during typing
    if (value === '') {
      setLunchAllowance(0);
      return;
    }

    // Parse as number and update store (store handles validation)
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setLunchAllowance(numValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="lunch-allowance-toggle" className="text-base font-medium">
            Lunch Allowance
          </Label>
          <p className="text-sm text-muted-foreground">
            Tax-exempt lunch allowance (added to NET salary)
          </p>
        </div>
        <Switch
          id="lunch-allowance-toggle"
          checked={hasLunchAllowance}
          onCheckedChange={handleToggleChange}
          aria-label="Enable lunch allowance"
        />
      </div>

      {/* Amount Input Section */}
      <div className="space-y-2">
        <Label
          htmlFor="lunch-allowance-amount"
          className={hasLunchAllowance ? '' : 'text-muted-foreground'}
        >
          Monthly Amount (VND)
        </Label>
        <Input
          id="lunch-allowance-amount"
          type="number"
          min="0"
          step="1"
          value={lunchAllowance}
          onChange={handleAmountChange}
          disabled={!hasLunchAllowance}
          aria-disabled={!hasLunchAllowance}
          aria-label="Lunch allowance monthly amount"
          className="font-mono"
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground">
          {hasLunchAllowance
            ? 'Default: 730,000 VND/month (typical corporate rate)'
            : 'Enable to set monthly lunch allowance'
          }
        </p>
      </div>
    </div>
  );
}
