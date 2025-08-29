'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import * as motion from 'motion/react-client';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import Image from 'next/image';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [isServiceHome, setIsServiceHome] = useState(false);
  const pathName = usePathname();

  const handleMenuScroll = (id: string) => {
    const element = document.getElementById(id);
    if (id === 'Register') {
      document.getElementById('Home')?.scrollIntoView({ behavior: 'smooth' });
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationItems = [
    { id: 'Home', label: 'Home', href: '#' },
    { id: 'Features', label: 'Features', href: '#' },
    { id: 'HowItWorks', label: 'How It Works', href: '#' },
    { id: 'Register', label: 'Register', href: '#' },
    { id: 'Report', label: 'Report', href: '#' },
  ];

  const filteredItems = isServiceHome
    ? navigationItems.filter((item) =>
        ['Home', 'Features', 'HowItWorks', 'Register'].includes(item.id),
      )
    : navigationItems.filter((item) =>
        ['Home', 'Features', 'HowItWorks', 'Report'].includes(item.id),
      );

  useEffect(() => {
    if (pathName.startsWith('/service')) {
      setIsServiceHome(true);
    } else {
      setIsServiceHome(false);
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);

    const sections = filteredItems.map((item) => document.getElementById(item.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const menuItem = filteredItems.find((item) => item.id === id);
            if (menuItem) setActiveItem(menuItem.label);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.5 },
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [pathName, filteredItems]);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300 ease-in-out',
        isServiceHome ? 'bg-black/20' : 'bg-white/20',
        isScrolled
          ? 'mx-4 mt-6 rounded border bg-white/75 backdrop-blur-lg md:mx-16'
          : 'mx-0 mt-0 rounded-none',
        isScrolled ? 'bg-transparent' : 'bg-transparent md:bg-transparent',
        isMobileMenuOpen && 'bg-white/75 backdrop-blur-lg md:bg-transparent',
        isServiceHome && isScrolled && 'bg-black/50',
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-7xl transition-all duration-500 ease-out',
          isScrolled ? 'px-6 py-3' : 'px-8 py-6',
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
              <h1
                className={cn(
                  'text-lg font-bold sm:text-xl lg:text-2xl',
                  isServiceHome ? 'text-white' : '',
                )}
              >
                FindItNow
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-4 md:flex md:items-end">
            {filteredItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuScroll(item.id);
                  setActiveItem(item.label);
                }}
                className={cn(
                  'relative flex transform flex-col items-center rounded-full px-4 py-2 text-sm transition-all duration-300',
                  activeItem === item.label
                    ? 'text-primary font-semibold'
                    : isScrolled
                      ? 'hover:text-primary text-gray-700'
                      : 'hover:text-primary text-gray-800',
                  isServiceHome ? 'text-white' : '',
                )}
              >
                {activeItem === item.label && <motion.div layoutId="activeCircle" style={circle} />}

                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isServiceHome && (
              <>
                <Button variant={'link'} asChild>
                  <Link href="/login" className="mr-0 text-white">
                    Log in
                  </Link>
                </Button>
                <Separator orientation="vertical" className="!h-3 w-1" />
              </>
            )}
            <Button variant="secondary" className="hidden rounded-full md:block" asChild>
              <a href="mailto:support@finditnow.com" className="mr-0">
                <span>Contact Us</span>
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              size={'icon'}
              className={cn(
                'rounded-full transition-all duration-300 hover:scale-110 md:hidden',
                isScrolled
                  ? 'hover:bg-primary/20 text-white hover:text-gray-600'
                  : 'hover:bg-primary/20 text-white hover:text-gray-600',
              )}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            className={cn(
              'mt-4 border-t pt-4 transition-all duration-300 md:hidden',
              isScrolled ? 'border-gray-200' : 'border-white/20',
              !isServiceHome
                ? ''
                : isScrolled
                  ? 'text-white'
                  : 'rounded-md bg-black/75 p-4 text-white',
            )}
          >
            <div className="flex flex-col space-y-3">
              {filteredItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuScroll(item.label);
                    setActiveItem(item.label);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    'transform rounded-lg px-2 py-2 transition-all duration-300 hover:scale-103',
                    isServiceHome ? 'text-white' : '',
                    activeItem === item.label
                      ? 'text-primary bg-primary/10 scale-103 font-semibold'
                      : '',
                    isServiceHome && activeItem === item.label ? 'bg-white/30' : '',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const circle = {
  width: 8,
  height: 8,
  backgroundColor: '#1c7b55',
  borderRadius: 4,
};
