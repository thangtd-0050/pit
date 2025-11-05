import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { usePreferences } from '@/store/preferences';
import { cn } from '@/lib/utils';

interface DeltaItemProps {
  /** Label text in Vietnamese */
  label: string;
  /** Delta value (2026 - 2025) */
  delta: number;
  /** If true, negative delta is good (e.g., for tax - less tax is better) */
  inverted?: boolean;
  /** If true, use larger font size for hero display */
  large?: boolean;
  /** Optional className for container */
  className?: string;
}

/**
 * Display a single delta value with color coding and arrow indicator.
 * - Positive delta (2026 > 2025): Green if good, red if bad
 * - Negative delta (2026 < 2025): Red if good, green if bad
 * - Zero delta: Gray with minus sign
 * 
 * For taxes and deductions:
 * - Use inverted=true for tax amounts (lower tax is better)
 * - Use inverted=false for deductions (higher deductions are better)
 */
export function DeltaItem({
  label,
  delta,
  inverted = false,
  large = false,
  className,
}: DeltaItemProps) {
  const { locale } = usePreferences();

  // Determine if this delta is positive for the user
  const isPositive = inverted ? delta < 0 : delta > 0;
  const isNegative = inverted ? delta > 0 : delta < 0;
  const isZero = delta === 0;

  // Color classes
  const colorClass = cn({
    'text-green-600 dark:text-green-400': isPositive,
    'text-red-600 dark:text-red-400': isNegative,
    'text-muted-foreground': isZero,
  });

  // Icon component
  const Icon = isZero ? Minus : isPositive ? ArrowUp : ArrowDown;

  // Font size classes
  const sizeClass = large
    ? 'text-3xl md:text-4xl font-bold'
    : 'text-lg font-semibold';

  // Format the absolute value
  const formattedValue = formatNumber(Math.abs(delta), locale);

  // Add +/- prefix
  const prefix = isZero ? '' : delta > 0 ? '+' : '−'; // Using minus sign (U+2212)

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <span
        className={cn(
          'text-sm font-medium text-muted-foreground',
          large && 'text-base'
        )}
      >
        {label}
      </span>
      <div className={cn('flex items-center gap-2', colorClass)}>
        <Icon className={cn('h-4 w-4', large && 'h-6 w-6')} aria-hidden="true" />
        <span className={sizeClass}>
          {prefix}
          {formattedValue} VND
        </span>
      </div>
    </div>
  );
}
