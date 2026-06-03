'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}
