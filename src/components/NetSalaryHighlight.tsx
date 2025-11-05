import { formatNumber } from '@/lib/format';
import { usePreferences } from '@/store/preferences';
import { cn } from '@/lib/utils';

interface NetSalaryHighlightProps {
  amount: number;
  className?: string;
}

export function NetSalaryHighlight({ amount, className }: NetSalaryHighlightProps) {
  const { locale } = usePreferences();

  return (
    <div
      className={cn(
        'rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 text-center',
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Lương NET (Thực nhận)</p>
        <p className="text-4xl font-bold text-primary md:text-5xl">
          {formatNumber(amount, locale)}
          <span className="ml-2 text-2xl font-normal text-muted-foreground">VND</span>
        </p>
      </div>
    </div>
  );
}
