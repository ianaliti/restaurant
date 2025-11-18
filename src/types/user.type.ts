export type UserRole = 'customer' | 'restaurateur' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

