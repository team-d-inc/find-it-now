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
          '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]',
          'absolute inset-0 -z-10',
        )}
      />
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-32 left-[10%] animate-bounce md:top-28 md:left-1/3"
          style={{ animationDelay: '0s', animationDuration: '2s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg md:h-12 md:w-12">
              <span className="text-base md:text-lg">🔑</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute top-32 right-[10%] animate-bounce md:top-36 md:right-1/3"
          style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg md:h-12 md:w-12">
              <span className="text-base md:text-lg">📱</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute bottom-20 left-[10%] animate-bounce md:bottom-40 md:left-1/4"
          style={{ animationDelay: '1s', animationDuration: '2.2s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg md:h-12 md:w-12">
              <span className="text-base md:text-lg">💼</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute right-[10%] bottom-20 animate-bounce md:right-1/4 md:bottom-32"
          style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg md:h-12 md:w-12">
              <span className="text-base md:text-lg">👓</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute top-1/3 left-[5%] transform animate-bounce md:top-1/2 md:left-40 md:-translate-x-1/2"
          style={{ animationDelay: '0.8s', animationDuration: '2.3s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg md:h-12 md:w-12">
              <span className="text-base md:text-lg">🎧</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>

        <div
          className="absolute right-[5%] bottom-1/3 transform animate-bounce md:bottom-1/2 md:right-40 md:-translate-x-1/2"
          style={{ animationDelay: '1.2s', animationDuration: '2.6s' }}
        >
          <div className="relative">
            <div className="border-primary flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white drop-shadow-lg md:h-12 md:w-12">
              <span className="text-base md:text-lg">⌚</span>
            </div>
            <div
              className="bg-primary mx-auto mt-1 h-4 w-2 drop-shadow-lg"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
        </div>
      </div>
      <div className="space-y-6 px-4 pt-20 md:space-y-8 md:px-0">
        <h1 className="text-3xl leading-tight font-bold md:text-4xl lg:text-6xl">
          <TextAnimate animation="fadeIn" by="line">
            Lost Something? Find It Fast.
          </TextAnimate>
        </h1>
        <p className="mx-auto max-w-2xl text-base font-semibold md:text-lg lg:text-xl">
          Simple, safe, and stress-free — your belongings back where they belong.
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          className="cursor-pointer rounded-full bg-black px-8 py-6 text-base font-semibold text-white transition-all duration-300 hover:bg-black/90 md:px-12 md:py-7 lg:px-16 lg:py-8 lg:text-lg"
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
