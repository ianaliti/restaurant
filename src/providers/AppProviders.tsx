'use client';

import { AuthProvider, useAuth } from './AuthProvider';
import { CartProvider } from './CartProvider';

// CartProvider needs the current userId, which comes from AuthProvider.
// This inner wrapper reads from AuthContext so CartProvider gets the right userId.
function CartWithAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return <CartProvider userId={user?.id ?? null}>{children}</CartProvider>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartWithAuth>{children}</CartWithAuth>
    </AuthProvider>
  );
}
