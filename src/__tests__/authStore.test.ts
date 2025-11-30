import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/app/store/authStore';
import { saveMockUsers } from '@/app/store/userStore';
import { useCartStore } from '@/app/store/cartStore';

beforeEach(() => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error(e);
  }

  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  useCartStore.setState({
    userCarts: {},
    currentUserId: null,
  });

  const defaultUsers = [
    {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
    },
  ];
  saveMockUsers(defaultUsers);
});

describe('authStore', () => {
  it('should register a new user', async () => {
    await useAuthStore.getState().register('newuser@example.com', 'password123', 'New User');
    
    const state = useAuthStore.getState();
    expect(state.user?.email).toBe('newuser@example.com');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should login with correct credentials', async () => {
    await useAuthStore.getState().login('test@example.com', 'password123');
    
    const state = useAuthStore.getState();
    expect(state.user?.email).toBe('test@example.com');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should throw error with wrong password', async () => {
    await expect(
      useAuthStore.getState().login('test@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid email or password');
  });

  it('should logout user', async () => {
    await useAuthStore.getState().login('test@example.com', 'password123');
    useAuthStore.getState().logout();
    
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should update user profile', async () => {
    await useAuthStore.getState().login('test@example.com', 'password123');
    await useAuthStore.getState().updateProfile('Updated Name', 'updated@example.com');
    
    const state = useAuthStore.getState();
    expect(state.user?.name).toBe('Updated Name');
    expect(state.user?.email).toBe('updated@example.com');
  });
});
