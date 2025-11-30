'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import type { UserRole } from '@/types/user.type';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const defaultRedirect = `/${lang}/restaurants`;
  const [mounted] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    const checkHydration = () => {
      if (typeof window === 'undefined') {
        setIsChecking(false);
        return;
      }

      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          setTimeout(() => {
            setIsChecking(false);
          }, 100);
        } else {
          setIsChecking(false);
        }
      } catch {
        setIsChecking(false);
      }
    };

    checkHydration();
  }, [mounted]);

  useEffect(() => {
    if (!mounted || isChecking) return;
    if (!isAuthenticated) {
      const targetPath = redirectTo || defaultRedirect;
      router.push(targetPath);
      return;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (user && !roles.includes(user.role)) {
        router.push(`/${lang}/restaurants`);
        return;
      }
    }
  }, [mounted, isChecking, isAuthenticated, user, requiredRole, redirectTo, router, defaultRedirect, lang]);

  if (!mounted || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (user && !roles.includes(user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}

