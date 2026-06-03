import { apiFetch } from '@/lib/api/apiClient';
import type { User } from '@/types/user.type';

export async function getUserProfile(): Promise<User> {
  const res = await apiFetch('/api/users/me');
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function updateUserProfile(data: { name?: string; email?: string }): Promise<User> {
  const res = await apiFetch('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Update failed');
  }
  return res.json();
}

export async function deleteUserAccount(): Promise<void> {
  const res = await apiFetch('/api/users/me', { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete account');
  }
}
