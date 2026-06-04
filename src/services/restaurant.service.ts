import { apiFetch, apiUrl } from '@/lib/api/apiClient';
import type { RestaurantData } from '@/types/restaurants.type';

type RestaurantUpdate = Partial<Pick<
  RestaurantData,
  'name' | 'address' | 'codePostal' | 'city' | 'image' | 'email' | 'description' | 'phone' | 'website' | 'cuisine'
>>;

export async function getRestaurantsService(): Promise<RestaurantData[]> {
  const res = await fetch(apiUrl('/api/restaurants'));
  if (!res.ok) throw new Error('Failed to fetch restaurants');
  const json = await res.json();
  return (json.data ?? []).map(mapRestaurant);
}

export async function getRestaurantByIdService(id: string): Promise<RestaurantData> {
  const list = await getRestaurantsService();
  const found = list.find((r) => r.id === id);
  if (!found) throw new Error('Restaurant not found');
  return found;
}

export async function getMyRestaurantService(): Promise<RestaurantData> {
  const res = await apiFetch('/api/restaurants/me');
  if (!res.ok) throw new Error('Failed to fetch restaurant profile');
  return mapRestaurant(await res.json());
}

export async function deleteRestaurantService(id: string): Promise<void> {
  const res = await apiFetch(`/api/restaurants/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Delete failed');
  }
}

export async function updateMyRestaurantService(data: RestaurantUpdate): Promise<RestaurantData> {
  const res = await apiFetch('/api/restaurants/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Update failed');
  }
  return mapRestaurant(await res.json());
}

function mapRestaurant(r: Record<string, unknown>): RestaurantData {
  return {
    id: r.id as string,
    userId: r.id as string,
    name: (r.name as string) || '',
    email: (r.email as string) || '',
    address: (r.address as string) || '',
    codePostal: (r.codePostal as string) || '',
    city: (r.city as string) || '',
    image: (r.image as string | null) ?? null,
    description: (r.description as string | null) ?? null,
    phone: (r.phone as string) || '',
    website: (r.website as string | null) ?? null,
    cuisine: (r.cuisine as string) || '',
  };
}
