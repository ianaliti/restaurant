'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function LangUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    const lang = pathname?.split('/')[1] || 'fr';
    document.documentElement.lang = lang;
  }, [pathname]);

  return null;
}

