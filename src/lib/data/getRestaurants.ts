import type { RestaurantData } from '@/app/store/restaurantStore';
import { mockRestaurants } from '@/mock-data/data';

export async function getRestaurants(): Promise<RestaurantData[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return mockRestaurants;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}/api/restaurants`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const result = await response.json();
      return result.data || mockRestaurants;
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
  
  return mockRestaurants;
}

export async function getRestaurantById(id: number): Promise<RestaurantData | null> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return mockRestaurants.find((r) => r.id === id) || null;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}/api/restaurants/${id}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const result = await response.json();
      return result.data || null;
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
  }
  
  return mockRestaurants.find((r) => r.id === id) || null;
}

