import { useEffect, useCallback } from 'react';
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
 * Keyboard accessible with arrow key navigation and shortcuts:
 * - 1: Switch to 2025 mode
 * - 2: Switch to 2026 mode
 * - 3 or C: Switch to comparison mode
 */
export function ViewModeToggle({ value, onChange, className }: ViewModeToggleProps) {
  const modes: Array<{ id: ViewMode; label: string; shortcut: string }> = [
    { id: '2025', label: '2025', shortcut: '1' },
    { id: '2026', label: '2026', shortcut: '2' },
    { id: 'compare', label: 'So sánh', shortcut: '3' },
  ];

  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Number shortcuts: 1, 2, 3
      if (e.key === '1') {
        onChange('2025');
      } else if (e.key === '2') {
        onChange('2026');
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        onChange('compare');
      }
    },
    [onChange]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [handleKeyboard]);

  return (
    <div
      className={cn('inline-flex rounded-lg border p-1 gap-1', className)}
      role="group"
      aria-label="Chọn chế độ hiển thị. Phím tắt: 1 (2025), 2 (2026), 3 (So sánh)"
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
            aria-keyshortcuts={mode.shortcut}
            className={cn('transition-colors', !isActive && 'hover:bg-muted')}
          >
            {mode.label}
          </Button>
        );
      })}
    </div>
  );
}
