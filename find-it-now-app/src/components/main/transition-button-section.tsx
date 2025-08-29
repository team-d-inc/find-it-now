'use client';

import Link from 'next/link';
import { PATHS } from '@/constants/paths';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';

export const TransitionButtonSection = () => {
  return (
    <div className="bg-gray-50 px-6 py-12 md:p-16 lg:p-20" id="Report">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-10">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold md:text-4xl lg:text-5xl">Ready to find your lost items?</h2>
              <p className="max-w-2xl text-base text-gray-600 md:text-lg lg:text-xl">
                Be part of a community that makes finding lost items simple and stress-free.
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center md:w-auto md:justify-end">
            <InteractiveHoverButton className="border-none bg-black text-white">
              <Link href={PATHS.report()} className="flex items-center gap-2">
                Get Started
              </Link>
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
    </div>
  );
};
