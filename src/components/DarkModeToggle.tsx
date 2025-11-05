import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePreferences } from '@/store/preferences';

/**
 * Dark mode toggle button with moon/sun icon.
 * Updates preferences store and applies dark class to document root.
 */
export function DarkModeToggle() {
  const { darkMode, setDarkMode } = usePreferences();

  // Apply dark class to document root when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && !darkMode) {
      // Only set dark mode if user hasn't explicitly chosen light mode
      const stored = localStorage.getItem('pit-preferences');
      if (!stored) {
        setDarkMode(true);
      }
    }
  }, [darkMode, setDarkMode]);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
      title={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
