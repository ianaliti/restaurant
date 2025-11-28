import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WithoutId, UpdateData } from '@/types/utils.type';
import { findByUserId, findById } from '@/types/utils.type';

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

export type RestaurantInput = WithoutId<RestaurantData>;
export type RestaurantUpdate = UpdateData<RestaurantData>;

interface RestaurantState {
  restaurants: RestaurantData[];
  createRestaurant: (restaurantData: RestaurantInput | RestaurantData) => void;
  getRestaurantByUserId: (userId: string) => RestaurantData | null;
  deleteRestaurantByUserId: (userId: string) => void;
  getAllRestaurants: () => RestaurantData[];
}

type RestaurantMigrationInput = Partial<RestaurantData> & Pick<RestaurantData, 'userId'>;

const migrateRestaurant = (restaurant: RestaurantMigrationInput): RestaurantData => {
  if (restaurant.id) {
    return restaurant as RestaurantData;
  }
  return {
    ...restaurant,
    id: restaurant.userId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0),
  } as RestaurantData;
};

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: [],

      createRestaurant: (restaurantData: RestaurantInput | RestaurantData) => {
        set((state) => {
          const existingRestaurants = findByUserId(state.restaurants, restaurantData.userId);
          const existingIndex = existingRestaurants.length > 0 
            ? state.restaurants.findIndex((r) => r.userId === restaurantData.userId)
            : -1;
          
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

      getRestaurantByUserId: (userId: string): RestaurantData | null => {
        const restaurants = get().restaurants;
        const userRestaurants = findByUserId(restaurants, userId);
        return userRestaurants[0] || null;
      },

      deleteRestaurantByUserId: (userId: string) => {
        set((state) => {
          const restaurantsToKeep = state.restaurants.filter((r) => r.userId !== userId);
          return { restaurants: restaurantsToKeep };
        });
      },

      getAllRestaurants: (): RestaurantData[] => {
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
