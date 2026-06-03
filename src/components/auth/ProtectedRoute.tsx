'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(redirectTo ?? `/${lang}/login`);
      return;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (user && !roles.includes(user.role)) {
        router.push(`/${lang}/restaurants`);
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, router, lang]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (user && !roles.includes(user.role)) return null;
  }

  return <>{children}</>;
}
