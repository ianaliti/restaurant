'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/authStore';

/**
 * AuthProvider component to ensure auth state is hydrated on page load
 * This ensures the user session persists across page reloads
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Access the store to trigger rehydration
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // Zustand persist automatically rehydrates, but we mark it as hydrated
    // after a brief delay to ensure localStorage is read
    if (!hasHydrated) {
      // Small delay to ensure rehydration is complete
      const timer = setTimeout(() => {
        setHasHydrated(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasHydrated, setHasHydrated]);

  return <>{children}</>;
}

