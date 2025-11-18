import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RestaurantWithPlats } from '@/types/restaurants.type';


interface RestoState {
  restarantList: {
    items: RestaurantWithPlats[];
  };
  addToRestoList: (item: RestaurantWithPlats) => void;
  removeItem: (id: number) => void;
}

export const useRestaurantsStore = create<RestoState>() (
   persist(
    (set, get) => ({
      restarantList: {
        items: [],
      },
      addToRestoList: (item: RestaurantWithPlats) =>
        set((state) => {
          const existing = state.restarantList.items.find(i => i.id === item.id);
          if (existing) {
            return {
              ...state,
              restarantList: {
                items: state.restarantList.items.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i)
              }
            };
          }
          const newItem: RestaurantWithPlats = { id: item.id, name: item.name, description: item.description, image: item.image, address: item.address, email: item.email, cuisine: item.cuisine, codePostal: item.codePostal, city: item.city, quantity: 1  };
          return {
            ...state,
            restarantList: { items: [...state.restarantList.items, newItem] }
          };
        }),
      removeItem: (id: number) => set((state) => ({
        ...state,
        restarantList: { items: state.restarantList.items.filter(i => i.id !== id) }
      })),
    }),
    {
      name: "restarantList-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
