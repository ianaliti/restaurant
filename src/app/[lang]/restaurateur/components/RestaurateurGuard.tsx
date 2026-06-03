'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function RestaurateurGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}
