import type { PlatData } from '@/app/store/platStore';
import { mockPlats } from '@/mock-data/data';

export async function getPlats(): Promise<PlatData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl ? `${baseUrl}/api/plats` : '/api/plats';
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const result = await response.json();
      return result.data || mockPlats;
    }
  } catch (error) {
    console.error('Error fetching plats:', error);
  }
  
  return mockPlats;
}

export async function getPlatById(id: string | number): Promise<PlatData | null> {
  const idString = typeof id === 'number' ? id.toString() : id;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl ? `${baseUrl}/api/plats/${idString}` : `/api/plats/${idString}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const result = await response.json();
      return result.data?.plat || null;
    }
  } catch (error) {
    console.error('Error fetching plat:', error);
  }
  
  return mockPlats.find((p) => p.id === idString) || null;
}

export async function getPlatWithRestaurant(id: string | number): Promise<{
  plat: PlatData;
  restaurantId: number;
} | null> {
  const idString = typeof id === 'number' ? id.toString() : id;
  const plat = mockPlats.find((p) => p.id === idString);
  
  if (!plat) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl ? `${baseUrl}/api/plats/${idString}` : `/api/plats/${idString}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.data?.restaurantId) {
        return {
          plat: result.data.plat,
          restaurantId: result.data.restaurantId,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching plat with restaurant:', error);
  }
  
  const { getRestaurants } = await import('./getRestaurants');
  const restaurants = await getRestaurants();
  const restaurant = restaurants.find((r) => r.userId === plat.userId);
  
  if (!restaurant) return null;

  return {
    plat,
    restaurantId: restaurant.id,
  };
}

export async function getPlatsByRestaurantId(userId: string): Promise<PlatData[]> {
  const plats = await getPlats();
  return plats.filter((p) => p.userId === userId);
}

