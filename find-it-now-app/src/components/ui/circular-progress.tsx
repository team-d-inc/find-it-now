'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
  progressClassName?: string;
  circleClassName?: string;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      size = 120,
      strokeWidth = 8,
      showPercentage = true,
      className,
      progressClassName,
      circleClassName,
      ...props
    },
    ref,
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const [animatedValue, setAnimatedValue] = React.useState(0);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);

      return () => clearTimeout(timer);
    }, [value]);

    const animatedOffset = circumference - (animatedValue / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className={cn('text-muted stroke-current text-gray-700 opacity-20', circleClassName)}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            strokeLinecap="round"
            className={cn(
              'text-primary stroke-current transition-all duration-1000 ease-out',
              progressClassName,
            )}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: animatedOffset,
            }}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-foreground text-sm font-bold">{Math.round(animatedValue)}%</span>
          </div>
        )}
      </div>
    );
  },
);

CircularProgress.displayName = 'CircularProgress';

export { CircularProgress };
