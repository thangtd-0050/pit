import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Minus, Plus } from 'lucide-react';

interface DependentsInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function DependentsInput({ value, onChange, min = 0, max = 20 }: DependentsInputProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="dependents">Số người phụ thuộc</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                <Info className="h-3 w-3" />
                <span className="sr-only">Thông tin người phụ thuộc</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Người phụ thuộc là con dưới 18 tuổi, vợ/chồng không có thu nhập, cha mẹ trên 60
                tuổi không có thu nhập, hoặc người khuyết tật không có khả năng lao động.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Giảm số người phụ thuộc"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id="dependents"
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="text-center"
          aria-label="Số người phụ thuộc"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Tăng số người phụ thuộc"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Từ {min} đến {max} người</p>
    </div>
  );
}
