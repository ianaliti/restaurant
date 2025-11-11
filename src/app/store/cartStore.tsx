import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Dish } from '@/types/restaurants.type';


interface CartState {
  items: (CartItem)[];
  addItem: (item: Dish & { restaurantId: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>() (
   persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(i => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === item.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),
      removeItem: (id: number) =>
        set((state) => ({
          items: state.items.filter(i => i.id !== id),
        })),
      updateQuantity: (id: number, quantity: number) =>
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter(i => i.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      // Getters
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
