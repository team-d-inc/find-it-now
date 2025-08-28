import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const RefreshButton = ({
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
}: RefreshButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="system"
      disabled={disabled || isLoading}
      className={cn(className, 'py-5')}
    >
      <RefreshCcw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
      Refresh
    </Button>
  );
};
