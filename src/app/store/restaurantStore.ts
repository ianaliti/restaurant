import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RestaurantData {
  id: number;
  userId: string;
  name: string;
  address: string;
  codePostal: string;
  city: string;
  email: string;
  image: string;
}

interface RestaurantState {
  restaurants: RestaurantData[];
  createRestaurant: (restaurantData: Omit<RestaurantData, 'id'> | RestaurantData) => void;
  getRestaurantByUserId: (userId: string) => RestaurantData | null;
  deleteRestaurantByUserId: (userId: string) => void;
  getAllRestaurants: () => RestaurantData[];
}

const migrateRestaurant = (restaurant: any): RestaurantData => {
  if (restaurant.id) {
    return restaurant as RestaurantData;
  }
  return {
    ...restaurant,
    id: restaurant.userId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0),
  };
};

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: [],

      createRestaurant: (restaurantData: Omit<RestaurantData, 'id'> | RestaurantData) => {
        set((state) => {
          const existingIndex = state.restaurants.findIndex(
            (r) => r.userId === restaurantData.userId
          );
          
          const restaurantWithId: RestaurantData = 'id' in restaurantData && restaurantData.id
            ? restaurantData as RestaurantData
            : {
                ...restaurantData,
                id: Date.now(), 
              };
          
          if (existingIndex >= 0) {
            const updated = [...state.restaurants];
            updated[existingIndex] = {
              ...restaurantWithId,
              id: updated[existingIndex].id || restaurantWithId.id,
            };
            return { restaurants: updated };
          }
          const newRestaurants = [...state.restaurants, restaurantWithId];
          return {
            restaurants: newRestaurants,
          };
        });
      },

      getRestaurantByUserId: (userId: string) => {
        const restaurants = get().restaurants;
        return restaurants.find((r) => r.userId === userId) || null;
      },

      deleteRestaurantByUserId: (userId: string) => {
        set((state) => ({
          restaurants: state.restaurants.filter((r) => r.userId !== userId),
        }));
      },

      getAllRestaurants: () => {
        return get().restaurants;
      },
    }),
    {
      name: 'restaurants-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.restaurants) {
          const needsMigration = state.restaurants.some(r => !r.id);
          if (needsMigration) {
            const migrated = state.restaurants.map(migrateRestaurant);
            state.restaurants = migrated;
          }
        }
      },
    }
  )
);
