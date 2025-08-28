type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
};

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = 'md',
}) => {
  const roundedClass =
    rounded === 'sm'
      ? 'rounded-sm'
      : rounded === 'md'
        ? 'rounded-md'
        : rounded === 'lg'
          ? 'rounded-lg'
          : rounded === 'xl'
            ? 'rounded-xl'
            : rounded === 'full'
              ? 'rounded-full'
              : 'rounded-none';

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${roundedClass} ${className}`}
      style={{ width, height }}
      aria-hidden
    />
  );
};

export { Skeleton };
