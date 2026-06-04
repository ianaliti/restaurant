import { apiFetch, apiUrl } from '@/lib/api/apiClient';
import type { Plat } from '@/types/restaurants.type';

export async function getDishesByRestaurantService(restaurantId: string): Promise<Plat[]> {
  const res = await fetch(apiUrl(`/api/restaurants/${restaurantId}/dishes`));
  if (!res.ok) throw new Error('Failed to fetch dishes');
  const json = await res.json();
  return json.data ?? [];
}

export async function getDishByIdService(id: string): Promise<Plat> {
  const res = await fetch(apiUrl(`/api/dishes/${id}`));
  if (!res.ok) throw new Error('Dish not found');
  return res.json();
}

export async function createDishService(
  data: Omit<Plat, 'id'> & { category?: string; description?: string }
): Promise<Plat> {
  const res = await apiFetch('/api/dishes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create dish');
  }
  return res.json();
}

export async function updateDishService(
  id: string,
  data: Partial<Omit<Plat, 'id'>>
): Promise<Plat> {
  const res = await apiFetch(`/api/dishes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update dish');
  }
  return res.json();
}

export async function deleteDishService(id: string): Promise<void> {
  const res = await apiFetch(`/api/dishes/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete dish');
  }
}
