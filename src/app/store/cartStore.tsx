import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Dish } from '@/types/restaurants.type';


interface CartState {
  cartlist: {
    items: Dish[];
  };
  totalDish: () => number;
  addToCartList: (item: Dish) => void;
  // removeItem: (id: number) => void;
  // clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>() (
   persist(
    (set, get) => ({
      cartlist: {
        items: [],
      },
      totalDish: () => get().cartlist.items.length,
      addToCartList: (item: Dish) =>
        set((state) => ({
          ...state,
          cartlist: {
            items: [...state.cartlist.items, item],
          },
        })),
        // removeItem: (id) => set({ items: get().cartlist.items.filter(i => i.id !== id) }),
        // clearCart: () => set({ items: [] }),
        totalPrice: () => get().cartlist.items.reduce((sum, i) => sum + i.price, 0),
    }),
    {
      name: "cartlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
