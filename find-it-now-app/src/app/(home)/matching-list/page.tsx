import { LogoHeader } from '@/components/layout/logo-header';
import { MatchingList } from './components/matching-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matching List',
};

export default async function MatchingListPage({
  searchParams,
}: {
  searchParams: Promise<{ reportId: string; token: string }>;
}) {
  const { token, reportId } = await searchParams;
  return (
    <>
      <LogoHeader />
      <div className="flex min-h-screen w-full flex-col gap-6 p-4 sm:gap-10 sm:p-8 lg:p-20">
        <div className="mx-auto w-full max-w-4xl">
          <MatchingList token={token} reportId={reportId} />
        </div>
      </div>
    </>
  );
}
