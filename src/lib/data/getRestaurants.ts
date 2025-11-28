import type { RestaurantData } from '@/app/store/restaurantStore';
import { mockRestaurants } from '@/mock-data/data';

export async function getRestaurants(): Promise<RestaurantData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/restaurants`, {
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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/restaurants/${id}`, {
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

