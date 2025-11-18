export interface RestaurantData {
  userId: string;
  name: string;
  address: string;
  codePostal: string;
  city: string;
  email: string;
}

const MOCK_RESTAURANTS_KEY = 'mock-restaurants-storage';

const getMockRestaurants = (): RestaurantData[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MOCK_RESTAURANTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

const saveMockRestaurants = (restaurants: RestaurantData[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_RESTAURANTS_KEY, JSON.stringify(restaurants));
};

export const createRestaurant = (restaurantData: RestaurantData) => {
  const restaurants = getMockRestaurants();
  const existingIndex = restaurants.findIndex(r => r.userId === restaurantData.userId);
  if (existingIndex >= 0) {
    restaurants[existingIndex] = restaurantData;
  } else {
    restaurants.push(restaurantData);
  }
  saveMockRestaurants(restaurants);
};

export const getRestaurantByUserId = (userId: string): RestaurantData | null => {
  const restaurants = getMockRestaurants();
  return restaurants.find(r => r.userId === userId) || null;
};

export const deleteRestaurantByUserId = (userId: string) => {
  const restaurants = getMockRestaurants();
  const filtered = restaurants.filter(r => r.userId !== userId);
  saveMockRestaurants(filtered);
};

