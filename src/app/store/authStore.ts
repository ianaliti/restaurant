import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserRole, User, UserWithPassword } from '@/types/user.type';
import { getMockUsers, saveMockUsers } from './userStore';
import { useRestaurantStore } from './restaurantStore';
import { usePlatStore } from './platStore';
import { useCartStore } from './cartStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  
  setHasHydrated: (state: boolean) => void;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  isAdmin: () => boolean;
  isRestaurateur: () => boolean;
  isCustomer: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },

      register: async (email: string, password: string, name: string, role: UserRole = 'customer') => {
        set({ isLoading: true, error: null });
        
        try {
          const users = getMockUsers();
          
          if (users.find(u => u.email === email)) {
            throw new Error('Email already registered');
          }

          const newUser: UserWithPassword = {
            id: Date.now().toString(),
            email,
            name,
            password, 
            role,
            createdAt: new Date().toISOString(),
          };

          users.push(newUser);
          saveMockUsers(users);

          const { password: _, ...userWithoutPassword } = newUser;

          useCartStore.getState().setCurrentUser(userWithoutPassword.id);
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const users = getMockUsers();
          const user = users.find(u => u.email === email && u.password === password);

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const { password: _, ...userWithoutPassword } = user;

          useCartStore.getState().setCurrentUser(userWithoutPassword.id);
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      logout: () => {
        useCartStore.getState().setCurrentUser(null);
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: async (name: string, email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error('User not logged in');
          }

          const users = getMockUsers();
          const userIndex = users.findIndex(u => u.id === currentUser.id);
          
          if (userIndex === -1) {
            throw new Error('User not found');
          }

          const emailTaken = users.find(u => u.email === email && u.id !== currentUser.id);
          if (emailTaken) {
            throw new Error('Email already in use');
          }

          users[userIndex] = {
            ...users[userIndex],
            name,
            email,
          };
          saveMockUsers(users);

          set({
            user: {
              ...currentUser,
              name,
              email,
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Update failed',
          });
          throw error;
        }
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === 'admin';
      },

      isRestaurateur: () => {
        const user = get().user;
        return user?.role === 'restaurateur';
      },

      isCustomer: () => {
        const user = get().user;
        return user?.role === 'customer';
      },

      deleteUser: async (userId: string) => {
        try {
          const users = getMockUsers();
          const filteredUsers = users.filter((u) => u.id !== userId);
          saveMockUsers(filteredUsers);
          useRestaurantStore.getState().deleteRestaurantByUserId(userId);
          usePlatStore.getState().deletePlatsByUserId(userId);
        } catch (error) {
          throw new Error('Failed to delete user');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user?.id) {
          useCartStore.getState().setCurrentUser(state.user.id);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);

export type { User, UserRole } from '@/types/user.type';
