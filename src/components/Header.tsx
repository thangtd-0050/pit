import { ViewModeToggle } from '@/components/ViewModeToggle';
import { usePreferences } from '@/store/preferences';

/**
 * Page header with title and view mode toggle.
 * Provides context and navigation for the calculator.
 */
export function Header() {
  const { viewMode, setViewMode } = usePreferences();

  return (
    <header className="space-y-6 pb-8 border-b">
      {/* Title and subtitle */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Tính Lương NET từ Gross
        </h1>
        <p className="text-lg text-muted-foreground">
          Công cụ tính lương thực nhận theo quy định Việt Nam
        </p>
      </div>

      {/* View mode toggle */}
      <div className="flex justify-center">
        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </div>
    </header>
  );
}
