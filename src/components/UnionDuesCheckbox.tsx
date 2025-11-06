import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { InfoTooltip } from '@/components/InfoTooltip';

interface UnionDuesCheckboxProps {
  /** Whether user is a union member */
  checked: boolean;
  /** Callback when checkbox state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Optional className for container */
  className?: string;
}

/**
 * Checkbox for enabling/disabling union dues calculation.
 * When checked, system calculates union dues at 0.5% of insurance base (max 234K VND).
 */
export function UnionDuesCheckbox({
  checked,
  onCheckedChange,
  className,
}: UnionDuesCheckboxProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <Switch
          id="union-member"
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label="Đoàn viên công đoàn"
        />
        <Label htmlFor="union-member" className="cursor-pointer font-normal">
          Đoàn viên công đoàn
        </Label>
        <InfoTooltip
          content="Đoàn phí công đoàn = 0.5% cơ sở BHXH, tối đa 234.000 VND/tháng (10% lương cơ sở). Đoàn phí được trừ sau khi tính thuế TNCN."
          aria-label="Giải thích về đoàn phí công đoàn"
        />
      </div>
    </div>
  );
}
