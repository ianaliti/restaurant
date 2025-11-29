'use client';

import dynamic from 'next/dynamic';

export const LazyToast = dynamic(() => import('./Toast').then((mod) => ({ default: mod.Toast })), {
  ssr: false,
});

export const LazyMessage = dynamic(() => import('./Message').then((mod) => ({ default: mod.Message })), {
  ssr: false,
});

export const LazyConfirmDialog = dynamic(() => import('./ConfirmDialog').then((mod) => ({ default: mod.ConfirmDialog })), {
  ssr: false,
});

