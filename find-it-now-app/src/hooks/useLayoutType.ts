'use client';

import { usePathname } from 'next/navigation';

const useLayoutType = () => {
  const pathname = usePathname();
  const isRoot = pathname === '/'; // main for seeker
  const isHome = pathname === '/service'; // main for institution
  // const isContact = pathname === "/contact";
  return {
    showLogin: isHome,
    showFooter: isRoot || isHome,
    headerType: isRoot || isHome ? 'large' : 'small',
  };
};

export default useLayoutType;