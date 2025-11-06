import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sanitizeNumericInput, formatNumber } from '@/lib/format';
import { usePreferences } from '@/store/preferences';

interface GrossSalaryInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function GrossSalaryInput({
  value,
  onChange,
  min = 0,
  max = 1_000_000_000,
}: GrossSalaryInputProps) {
  const { locale } = usePreferences();
  const [displayValue, setDisplayValue] = useState('');
  const [error, setError] = useState('');

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(formatNumber(value, locale));
  }, [value, locale]);

  // Debounced change handler
  useEffect(() => {
    const timer = setTimeout(() => {
      const numericValue = sanitizeNumericInput(displayValue);

      // Validation
      if (numericValue < min) {
        setError(`Lương tối thiểu là ${formatNumber(min, locale)} VND`);
        return;
      }

      if (numericValue > max) {
        setError(`Lương tối đa là ${formatNumber(max, locale)} VND`);
        return;
      }

      setError('');
      if (numericValue !== value) {
        onChange(numericValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [displayValue, min, max, onChange, value, locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  const handleBlur = () => {
    // Reformat on blur
    const numericValue = sanitizeNumericInput(displayValue);
    setDisplayValue(formatNumber(numericValue, locale));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter key: blur to trigger calculation
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      return;
    }

    // Escape key: clear input
    if (e.key === 'Escape') {
      setDisplayValue('0');
      onChange(0);
      setError('');
      return;
    }

    // Arrow keys: increment/decrement by 1M
    const currentValue = sanitizeNumericInput(displayValue);
    const step = 1_000_000;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(currentValue + step, max);
      onChange(newValue);
      setDisplayValue(formatNumber(newValue, locale));
      setError('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(currentValue - step, min);
      onChange(newValue);
      setDisplayValue(formatNumber(newValue, locale));
      setError('');
    }
  };

  const handlePresetClick = (presetValue: number) => {
    onChange(presetValue);
    setDisplayValue(formatNumber(presetValue, locale));
    setError('');
  };

  const presets = [10_000_000, 20_000_000, 30_000_000, 50_000_000, 70_000_000, 100_000_000, 150_000_000, 200_000_000];

  return (
    <div className="space-y-3">
      <Label htmlFor="gross-salary">
        Lương Gross (VND) <span className="text-destructive">*</span>
      </Label>
      <Input
        id="gross-salary"
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={formatNumber(30_000_000, locale)}
        aria-label="Nhập lương gross hàng tháng. Dùng mũi tên lên/xuống để điều chỉnh 1 triệu, Enter để xác nhận, Escape để xóa"
        aria-invalid={!!error}
        aria-describedby={error ? 'gross-salary-error' : undefined}
        className={error ? 'border-destructive' : ''}
      />

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(preset)}
            className="text-xs"
            type="button"
          >
            {formatNumber(preset / 1_000_000, locale)}M
          </Button>
        ))}
      </div>

      {error && (
        <p id="gross-salary-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
