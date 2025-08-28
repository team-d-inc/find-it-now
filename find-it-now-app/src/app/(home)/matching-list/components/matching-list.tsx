'use client';

import { MatchingCard } from './matching-card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Package, TriangleAlert } from 'lucide-react';
import { createPickupRequest } from '../action';
import { toast } from 'sonner';
import useSWR from 'swr';
import { ReportStatus } from '@/generated/prisma';
import { LoadingState } from '@/components/ui/loading-state';
import { MatchingResult } from '@/types/type';

type Props = {
  token: string;
  reportId: string;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export function MatchingList({ token, reportId }: Props) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data, error, isLoading } = useSWR(`/api/match/${reportId}?token=${token}`, fetcher);
  const items: MatchingResult[] = data?.items || [];
  const organization = data?.report?.organization;

  const handleItemSelect = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItemId(itemId);
    } else {
      setSelectedItemId(null);
    }
  };

  const handleSubmit = async () => {
    setIsPending(true);

    if (!selectedItemId) {
      toast.error('Please select an item to submit a pickup request.');
      return;
    }

    const result = await createPickupRequest({
      lostItemId: selectedItemId,
      report: data?.report,
      token,
    });

    if (result.success) {
      setSelectedItemId(null);
      setIsSubmitted(true);
    } else {
      toast.error('Sorry, something went wrong. Please try again.');
    }
    setIsPending(false);
  };

  const selectedItem = items.find((item) => item.id === selectedItemId);

  if (data?.report?.status === ReportStatus.REQUESTED || isSubmitted) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center space-y-4 sm:space-y-6">
        <div className="p-4 text-center sm:p-6">
          <div className="bg-primary/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full sm:mb-4 sm:h-16 sm:w-16">
            <Check className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold sm:text-2xl">Submitted!</h2>
          <p className="mb-4 text-sm text-gray-500 sm:text-base">
            Please check your email for a confirmation message.
            <br />
            Make sure to check your spam folder if you don&apos;t see the email in your inbox.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="p-4 text-center">
          <TriangleAlert className="mx-auto mb-3 h-12 w-12 text-red-400 sm:mb-4 sm:h-16 sm:w-16" />
          <h3 className="mb-2 text-base font-semibold text-red-800 sm:text-lg">
            Error Loading Data
          </h3>
          <p className="text-sm text-red-600 sm:text-base">
            Failed to load data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!data || isLoading) {
    return <LoadingState title="Loading data" description="Please wait a moment" size="xl" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-6 rounded bg-gray-100 p-4 sm:mb-8 sm:p-6 lg:mb-15">
        <h2 className="text-primary mb-3 text-base font-bold sm:mb-5 sm:text-lg">How to proceed</h2>
        <ol className="list-decimal space-y-1 pl-4 text-sm text-gray-600 sm:pl-5 sm:text-base">
          <li>If a matching item is found, you can submit a pickup request.</li>
          <li>The staff will review your request and approve or decline based on verification.</li>
          <li>
            Once approved, you can visit the organization to collect your item within the designated
            pickup period.
          </li>
        </ol>
      </div>
      {selectedItem && (
        <div className="bg-primary/10 border-primary/20 rounded border-2 p-3 sm:p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
            <div className="flex items-center gap-2">
              <Check className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-primary text-sm font-medium sm:text-base">
                Selected: <span className="font-semibold">{selectedItem.title}</span>
              </span>
            </div>
            <Button onClick={handleSubmit} disabled={isPending} className="min-w-[100px] text-sm">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                  <span>Submit</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:gap-6">
        <p className="text-center text-xs text-gray-500 sm:text-left sm:text-sm">
          {items.length} items found from <span className="font-bold">{organization?.name}</span>
        </p>
        {items.length === 0 ? (
          <div className="rounded border border-dashed border-gray-300 py-8 text-center sm:py-12">
            <Package className="mx-auto mb-3 h-12 w-12 text-gray-400 sm:mb-4 sm:h-16 sm:w-16" />
            <p className="text-base text-gray-500 sm:text-lg">
              Sorry, no matching found items were found.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <MatchingCard
              key={item.id}
              item={item}
              token={token}
              isSelected={selectedItemId === item.id}
              onSelect={(isSelected) => handleItemSelect(item.id, isSelected)}
            />
          ))
        )}
      </div>
    </div>
  );
}
