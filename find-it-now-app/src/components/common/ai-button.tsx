import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

const AIButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      variant={'outline'}
      className={`rounded-2xl border-2 border-gray-400 font-bold text-gray-600 hover:cursor-pointer ${className}`}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-gray-600" />
        <span>{children}</span>
      </div>
    </Button>
  );
};

export { AIButton };
