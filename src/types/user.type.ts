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

export type UserInput = Omit<User, 'id' | 'createdAt'>;
export type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;

