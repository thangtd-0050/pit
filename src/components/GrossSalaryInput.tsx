import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  return (
    <div className="space-y-2">
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
        placeholder={formatNumber(30_000_000, locale)}
        aria-label="Nhập lương gross hàng tháng"
        aria-invalid={!!error}
        aria-describedby={error ? 'gross-salary-error' : undefined}
        className={error ? 'border-destructive' : ''}
      />
      {error && (
        <p id="gross-salary-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
