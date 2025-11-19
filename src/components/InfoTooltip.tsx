import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

interface InfoTooltipProps {
  content: string | ReactNode;
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
          {typeof content === 'string' ? (
            <p className="text-sm">{content}</p>
          ) : (
            <div className="text-sm">{content}</div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
