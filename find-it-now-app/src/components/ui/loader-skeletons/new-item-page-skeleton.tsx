import { Skeleton } from '@/components/ui/loader-skeletons/skeleton';

type Props = { showFooter?: boolean };

const FormPageSkeleton: React.FC<Props> = ({ showFooter = true }) => {
  return (
    <main className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton width={28} height={28} rounded="lg" />
          <Skeleton width="240px" height="1.75rem" />
        </div>
        {/* Save/Add */}
        {/* <Skeleton width="140px" height="2.5rem" rounded="lg" /> */}
      </div>

      {/* Helper callout */}
      {/* <div className="mb-6 rounded-xl border px-6 py-5">
        <Skeleton width="60%" height="1rem" />
        <Skeleton className="mt-2" width="40%" height="1rem" />
      </div> */}

      {/* Card / form container */}
      <div className="rounded-xl border p-6">
        {/* Images / Dropzone */}
        <div className="mb-8">
          <Skeleton width="120px" height="1rem" /> {/* "Images" label */}
          <div className="mt-2 rounded-xl border-2 border-dashed p-10">
            <div className="mx-auto flex max-w-md flex-col items-center gap-3">
              <Skeleton width={44} height={44} rounded="lg" />
              <Skeleton width="70%" height="1rem" />
              <Skeleton width="40%" height="0.875rem" />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Skeleton width="36px" height="1rem" />
          </div>
        </div>

        {/* Section: Lost Item */}
        <SectionTitle />
        <Field width="80%" />
        <Field />
        <Row two>
          <Field />
          {/* date picker */}
          <div className="w-full">
            <Skeleton width="18%" height="0.9rem" /> {/* label */}
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="flex-1" height="2.75rem" rounded="lg" />
              <Skeleton width={40} height={40} rounded="lg" /> {/* calendar btn */}
            </div>
          </div>
        </Row>

        {/* Section: Item Characteristics */}
        <SectionTitle width="220px" className="mt-10" />
        <Row two>
          {/* Category select */}
          <div className="w-full">
            <Skeleton width="26%" height="0.9rem" />
            <Skeleton className="mt-2" height="2.75rem" rounded="lg" />
          </div>
          {/* Colors multi-select/chips */}
          <div className="w-full">
            <Skeleton width="20%" height="0.9rem" />
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width="70px" height="2rem" rounded="full" />
              ))}
            </div>
          </div>
        </Row>

        {/* Textarea */}
        <div className="mt-6">
          <Skeleton width="18%" height="0.9rem" />
          <Skeleton className="mt-2" height="7.5rem" rounded="lg" />
        </div>

        {/* Footer actions */}
        {showFooter && (
          <div className="mt-8 flex items-center justify-end gap-3">
            <Skeleton width="110px" height="2.5rem" rounded="lg" />
            <Skeleton width="150px" height="2.5rem" rounded="lg" />
          </div>
        )}
      </div>
    </main>
  );
};

export { FormPageSkeleton };

/** --- tiny helpers --- */
const SectionTitle = ({
  width = '180px',
  className = '',
}: {
  width?: string | number;
  className?: string;
}) => (
  <div className={`mb-4 ${className}`}>
    <Skeleton width={width} height="1rem" />
  </div>
);

const Row: React.FC<{ two?: boolean; children: React.ReactNode }> = ({ two, children }) => (
  <div className={`mt-6 grid gap-6 ${two ? 'grid-cols-1 md:grid-cols-2' : ''}`}>{children}</div>
);

const Field = ({ width = '22%' }: { width?: string | number }) => (
  <div className="w-full">
    <Skeleton width={width} height="0.9rem" />
    <Skeleton className="mt-2" height="2.75rem" rounded="lg" />
  </div>
);
