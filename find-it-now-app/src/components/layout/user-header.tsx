'use client';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { ArrowLeft } from 'lucide-react';

export const UserHeader = ({
  heading,
  navigateBackButton,
}: {
  heading: string;
  navigateBackButton?: boolean;
}) => {
  const handleBackButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.history.back();
  };

  return (
    <div className="flex items-center gap-2 p-5">
      {navigateBackButton ? (
        <Button
          data-sidebar="trigger"
          data-slot="sidebar-trigger"
          variant="ghost"
          size="icon"
          className={cn('size-7')}
          onClick={handleBackButtonClick}
        >
          <ArrowLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      ) : (
        <SidebarTrigger />
      )}
      <h1 className="text-2xl font-bold">{heading}</h1>
    </div>
  );
};
