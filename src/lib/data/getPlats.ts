import type { PlatData } from '@/types/restaurants.type';
import { mockPlats } from '@/mock-data/data';
import { getRestaurants } from './getRestaurants';

interface BackendDish {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  category: string;
  isAvailable: boolean;
}

function mapDish(d: BackendDish): PlatData {
  return {
    id: d.id,
    userId: d.restaurantId,
    name: d.name,
    price: d.price,
    image: d.image,
    description: d.description,
    category: d.category || '',
    isAvailable: d.isAvailable ?? true,
  };
}

async function fetchDishesForRestaurant(restaurantId: string): Promise<PlatData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/dishes`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const dishes: BackendDish[] = await res.json();
    return Array.isArray(dishes) ? dishes.map(mapDish) : [];
  } catch {
    return [];
  }
}

export async function getPlats(): Promise<PlatData[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return mockPlats;
  }

  try {
    const restaurants = await getRestaurants();
    const allDishes = await Promise.all(
      restaurants.map((r) => fetchDishesForRestaurant(r.id))
    );
    return allDishes.flat();
  } catch (error) {
    console.error('Error fetching plats:', error);
    return mockPlats;
  }
}

export async function getPlatById(id: string): Promise<PlatData | null> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return mockPlats.find((p) => p.id === id) || null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dishes/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const dish: BackendDish = await res.json();
    return mapDish(dish);
  } catch (error) {
    console.error('Error fetching plat:', error);
    return null;
  }
}

export async function getPlatWithRestaurant(id: string): Promise<{
  plat: PlatData;
  restaurantId: string;
} | null> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    const plat = mockPlats.find((p) => p.id === id);
    if (!plat) return null;
    const restaurants = await getRestaurants();
    const restaurant = restaurants.find((r) => r.userId === plat.userId);
    if (!restaurant) return null;
    return { plat, restaurantId: restaurant.id };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dishes/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const dish: BackendDish = await res.json();
    const plat = mapDish(dish);
    return { plat, restaurantId: dish.restaurantId };
  } catch (error) {
    console.error('Error fetching plat with restaurant:', error);
    return null;
  }
}

export async function getPlatsByRestaurantId(restaurantId: string): Promise<PlatData[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    const plats = await getPlats();
    return plats.filter((p) => p.userId === restaurantId);
  }
  return fetchDishesForRestaurant(restaurantId);
}
