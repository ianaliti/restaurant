import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'customer' | 'restaurateur' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}


interface UserWithPassword extends User {
  password: string; 
}

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


const MOCK_USERS_KEY = 'mock-users-storage';

const getMockUsers = (): UserWithPassword[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const defaultUsers: UserWithPassword[] = [
    {
      id: '1',
      email: 'admin@restodigital.com',
      name: 'Admin User',
      password: 'admin123', 
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'restaurateur@restodigital.com',
      name: 'Restaurateur User',
      password: 'resto123',
      role: 'restaurateur',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveMockUsers = (users: UserWithPassword[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

// Helper function to get all restaurateurs (exported for use in admin page)
export const getAllRestaurateurs = (): User[] => {
  const users = getMockUsers();
  return users
    .filter((u) => u.role === 'restaurateur')
    .map(({ password, ...user }) => user);
};

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
        // Mark as hydrated when rehydration is complete
        state?.setHasHydrated(true);
      },
    }
  )
);

