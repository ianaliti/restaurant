'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { User, UserRole } from '@/types/user.type';
import { setMemoryToken } from '@/lib/api/apiClient';
import { loginAction, registerAction, logoutAction, getSessionAction } from '@/actions/auth';
import { updateUserProfile, deleteUserAccount } from '@/services/user.service';
import { updateMyRestaurantService } from '@/services/restaurant.service';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isAdmin: boolean;
  isRestaurateur: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount: restore session from HttpOnly cookie via Server Action
  useEffect(() => {
    getSessionAction()
      .then((session) => {
        if (session) {
          setMemoryToken(session.token);
          setUser(session.user);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: me, token } = await loginAction(email, password);
      setMemoryToken(token);
      setUser(me);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: me, token } = await registerAction(email, password, name);
      setMemoryToken(token);
      setUser(me);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
    setMemoryToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const updateProfile = useCallback(
    async (name: string, email: string) => {
      if (!user) throw new Error('Not logged in');
      setIsLoading(true);
      setError(null);
      try {
        let updated: Partial<User>;
        if (user.role === 'customer') {
          updated = await updateUserProfile({ name, email });
        } else if (user.role === 'restaurateur') {
          updated = await updateMyRestaurantService({ name });
        } else {
          throw new Error('Profile update not supported for this role');
        }
        setUser((prev) => prev && { ...prev, name: updated.name ?? prev.name, email: updated.email ?? prev.email });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const deleteAccount = useCallback(async () => {
    try {
      await deleteUserAccount();
    } finally {
      await logoutAction();
      setMemoryToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError: () => setError(null),
        updateProfile,
        deleteAccount,
        isAdmin: user?.role === 'admin',
        isRestaurateur: user?.role === 'restaurateur',
        isCustomer: user?.role === 'customer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
