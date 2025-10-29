import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Dish, CartItem } from '@/types/restaurants.type';


interface CartState {
  cartlist: {
    items: CartItem[];
  };
  totalDish: () => number;
  addToCartList: (item: Dish) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>() (
   persist(
    (set, get) => ({
      cartlist: {
        items: [],
      },
      totalDish: () => get().cartlist.items.reduce((sum, i) => sum + i.quantity, 0),
      addToCartList: (item: Dish) =>
        set((state) => {
          const existing = state.cartlist.items.find(i => i.id === item.id);
          if (existing) {
            return {
              ...state,
              cartlist: {
                items: state.cartlist.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
              }
            };
          }
          const newItem: CartItem = { id: item.id, name: item.name, description: item.description, image: item.image, price: item.price, quantity: 1 };
          return {
            ...state,
            cartlist: { items: [...state.cartlist.items, newItem] }
          };
        }),
      incrementQuantity: (id: number) => set((state) => ({
        ...state,
        cartlist: { items: state.cartlist.items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i) }
      })),
      decrementQuantity: (id: number) => set((state) => ({
        ...state,
        cartlist: { items: state.cartlist.items.flatMap(i => i.id === id ? (i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : []) : i) as CartItem[] }
      })),
      removeItem: (id: number) => set((state) => ({
        ...state,
        cartlist: { items: state.cartlist.items.filter(i => i.id !== id) }
      })),
      clearCart: () => set((state) => ({ ...state, cartlist: { items: [] } })),
      totalPrice: () => get().cartlist.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cartlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
