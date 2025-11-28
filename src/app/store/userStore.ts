import type { User, UserWithPassword, UserRole } from '@/types/user.type';

const MOCK_USERS_KEY = 'mock-users-storage';

export const getMockUsers = (): UserWithPassword[] => {
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

export const saveMockUsers = (users: UserWithPassword[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const getAllRestaurateurs = (): User[] => {
  const users = getMockUsers();
  return users
    .filter((u) => u.role === 'restaurateur')
    .map(({ password, ...user }) => user);
};

export const createUserWithoutLogin = (
  email: string,
  password: string,
  name: string,
  role: UserRole = 'customer'
): User => {
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
  return userWithoutPassword;
};

