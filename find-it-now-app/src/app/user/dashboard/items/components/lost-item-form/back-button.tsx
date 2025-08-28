'use client';

import { useBack } from '@/hooks/useBack';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type Props = {
  fallback?: string;
};

export const BackButton = ({ fallback = '/' }: Props) => {
  const goBack = useBack(fallback);

  return (
    <Button variant="ghost" onClick={goBack} className="text-md">
      <ArrowLeft size={20} />
      Back
    </Button>
  );
};
