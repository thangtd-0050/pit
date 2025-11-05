import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REGIONAL_MINIMUMS } from '@/config/constants';
import { formatNumber } from '@/lib/format';
import { usePreferences } from '@/store/preferences';
import type { RegionId } from '@/types';

interface RegionSelectorProps {
  value: RegionId;
  onChange: (value: RegionId) => void;
}

const REGION_LABELS: Record<RegionId, string> = {
  I: 'Vùng I - Thành phố lớn',
  II: 'Vùng II - Thành phố tỉnh',
  III: 'Vùng III - Thành phố nhỏ',
  IV: 'Vùng IV - Nông thôn',
};

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
  const { locale } = usePreferences();

  return (
    <div className="space-y-2">
      <Label htmlFor="region">
        Vùng lương tối thiểu <span className="text-destructive">*</span>
      </Label>
      <Select value={value} onValueChange={(val) => onChange(val as RegionId)}>
        <SelectTrigger id="region" aria-label="Chọn vùng lương tối thiểu">
          <SelectValue placeholder="Chọn vùng" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(REGIONAL_MINIMUMS) as RegionId[]).map((regionId) => {
            const minWage = REGIONAL_MINIMUMS[regionId].minWage;
            return (
              <SelectItem key={regionId} value={regionId}>
                <div className="flex flex-col">
                  <span className="font-medium">{REGION_LABELS[regionId]}</span>
                  <span className="text-sm text-muted-foreground">
                    Lương tối thiểu: {formatNumber(minWage, locale)} VND
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
