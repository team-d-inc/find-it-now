import { Spinner } from './shadcn-io/spinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  title: string;
  description: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
}

function AnimatedDots() {
  return (
    <span className="inline-flex items-center">
      <span className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}>.</span>
      <span className="animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}>.</span>
      <span className="animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}>.</span>
    </span>
  );
}

export function LoadingState({
  title,
  description,
  size = 'md',
  className = '',
  variant = 'default',
}: LoadingStateProps) {
  const spinnerSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const spinnerColor = size === 'sm' ? 'text-gray-400' : 'text-primary';

  const variants = {
    default: (
      <div className={cn("flex min-h-[calc(100vh-150px)] flex-col items-center justify-center", className)}>
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-xl" />
          <div className="relative">
            <Spinner variant="ring" className={cn(spinnerSizes[size], spinnerColor)} />
          </div>
        </div>
        <div className="mt-8 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-2xl font-semibold text-gray-900">
              {title}
              <AnimatedDots />
            </h3>
          </div>
          <p className="text-base text-gray-600 max-w-md">{description}</p>
        </div>
      </div>
    ),
    minimal: (
      <div className={cn("flex items-center justify-center space-x-3 py-8", className)}>
        <Spinner variant="ring" className={cn(spinnerSizes[size], spinnerColor)} />
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900">
            {title.replace('...', '')}
            <AnimatedDots />
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    ),
    card: (
      <div className={cn("rounded-lg border bg-white p-8 shadow-sm", className)}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-lg" />
            <div className="relative">
              <Spinner variant="ring" className={cn(spinnerSizes[size], spinnerColor)} />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {title.replace('...', '')}
              <AnimatedDots />
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    ),
  };

  return variants[variant];
}
