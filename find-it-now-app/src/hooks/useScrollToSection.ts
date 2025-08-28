'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useScrollToSection() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  const navigateToSection = async (sectionId: string, targetPage = '/') => {
    if (pathname === targetPage) {
      scrollToSection(sectionId);
    } else {
      router.push(`${targetPage}#${sectionId}`);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => scrollToSection(hash), 100);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return { navigateToSection, scrollToSection };
}
