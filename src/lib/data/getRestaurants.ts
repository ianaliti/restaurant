import type { RestaurantData } from '@/types/restaurants.type';
import { mockRestaurants } from '@/mock-data/data';

interface BackendRestaurant {
  id: string;
  name: string;
  email: string;
  image: string | null;
  address: string;
  city: string;
  codePostal: string;
  description: string | null;
  phone: string;
  website: string | null;
  cuisine: string;
}

function mapRestaurant(r: BackendRestaurant): RestaurantData {
  return {
    id: r.id,
    userId: r.id,
    name: r.name,
    email: r.email,
    address: r.address || '',
    codePostal: r.codePostal || '',
    city: r.city || '',
    image: r.image,
    description: r.description,
    phone: r.phone || '',
    website: r.website,
    cuisine: r.cuisine || '',
  };
}

export async function getRestaurants(): Promise<RestaurantData[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return mockRestaurants;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data: BackendRestaurant[] = await res.json();
      return Array.isArray(data) ? data.map(mapRestaurant) : mockRestaurants;
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }

  return mockRestaurants;
}

export async function getRestaurantById(id: string): Promise<RestaurantData | null> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return mockRestaurants.find((r) => r.id === id) || null;
  }

  try {
    const restaurants = await getRestaurants();
    return restaurants.find((r) => r.id === id) || null;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}
