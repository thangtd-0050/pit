import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePreferences } from '@/store/preferences';

/**
 * Locale selector component for switching between Vietnamese and US number formats.
 * Updates preferences store which persists to localStorage.
 */
export function LocaleSelector() {
  const { locale, setLocale } = usePreferences();

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vi-VN">
          <div className="flex items-center gap-2">
            <span>🇻🇳</span>
            <span>Định dạng VN</span>
          </div>
        </SelectItem>
        <SelectItem value="en-US">
          <div className="flex items-center gap-2">
            <span>🇺🇸</span>
            <span>Định dạng US</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
