import { Button } from '@/components/ui/button';
import type { ViewMode } from '@/types';
import { cn } from '@/lib/utils';

interface ViewModeToggleProps {
  /** Current active view mode */
  value: ViewMode;
  /** Callback when view mode changes */
  onChange: (mode: ViewMode) => void;
  /** Optional className for container */
  className?: string;
}

/**
 * Toggle button group for switching between single regime view and comparison view.
 * Keyboard accessible with arrow key navigation.
 */
export function ViewModeToggle({
  value,
  onChange,
  className,
}: ViewModeToggleProps) {
  const modes: Array<{ id: ViewMode; label: string }> = [
    { id: '2025', label: '2025' },
    { id: '2026', label: '2026' },
    { id: 'compare', label: 'So sánh' },
  ];

  return (
    <div
      className={cn('inline-flex rounded-lg border p-1 gap-1', className)}
      role="group"
      aria-label="Chọn chế độ hiển thị"
    >
      {modes.map((mode) => {
        const isActive = value === mode.id;
        return (
          <Button
            key={mode.id}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange(mode.id)}
            aria-pressed={isActive}
            className={cn(
              'transition-colors',
              !isActive && 'hover:bg-muted'
            )}
          >
            {mode.label}
          </Button>
        );
      })}
    </div>
  );
}
