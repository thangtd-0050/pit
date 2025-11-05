import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  'aria-label'?: string;
}

export function InfoTooltip({ content, 'aria-label': ariaLabel }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            <Info className="h-3 w-3" />
            <span className="sr-only">{ariaLabel || 'Thông tin'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
