'use client';

import { TextAnimate } from '../magicui/text-animate';
import { Button } from '../ui/button';
import { PATHS } from '@/constants/paths';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const HeroSection = () => {
  // useScrollToSection();
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center space-y-12 text-center"
      id="Home"
    >
      <DotPattern
        width={24}
        height={24}
        className={cn(
          '[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]',
          'absolute inset-0 -z-10',
        )}
      />
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-28 left-1/3 animate-bounce"
          style={{ animationDelay: '0s', animationDuration: '2s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg">
              <span className="text-lg">🔑</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute top-36 right-1/3 animate-bounce"
          style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg">
              <span className="text-lg">📱</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute bottom-40 left-1/4 animate-bounce"
          style={{ animationDelay: '1s', animationDuration: '2.2s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg">
              <span className="text-lg">💼</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute right-1/4 bottom-32 animate-bounce"
          style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg">
              <span className="text-lg">👓</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute top-1/2 left-40 -translate-x-1/2 transform animate-bounce"
          style={{ animationDelay: '0.8s', animationDuration: '2.3s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg">
              <span className="text-lg">🎧</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute right-40 bottom-1/2 -translate-x-1/2 transform animate-bounce"
          style={{ animationDelay: '1.2s', animationDuration: '2.6s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg">
              <span className="text-lg">⌚</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>
      </div>
      <div className="space-y-8 pt-20">
        <h1 className="text-4xl leading-tight font-bold md:text-6xl">
          <TextAnimate animation="fadeIn" by="line">
            Lost Something? Find It Fast.
          </TextAnimate>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-semibold md:text-xl">
          Simple, safe, and stress-free — your belongings back where they belong.
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          className="cursor-pointer rounded-full bg-black px-16 py-8 text-lg font-semibold text-white transition-all duration-300 hover:bg-black/90"
          size="lg"
          asChild
        >
          <Link href={PATHS.report()} className="flex items-center gap-2">
            Report Your Lost Item
            <ArrowUpRight className="size-6 transition-all duration-300" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
