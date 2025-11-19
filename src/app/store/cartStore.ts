import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Plat } from '@/types/restaurants.type';
import { Order } from '@/types/restaurants.type';


interface CartState {
  userCarts: { [userId: string]: CartItem[] };
  currentUserId: string | null;
  setCurrentUser: (userId: string | null) => void;
  getItems: () => CartItem[];
  getItemsByUserId: (userId: string) => CartItem[];
  addItem: (item: Plat & { restaurantId: number }, userId: string) => void;
  removeItem: (id: number, userId: string) => void;
  updateQuantity: (id: number, quantity: number, userId: string) => void;
  clearCart: (userId: string) => void;
  getTotalPrice: (userId: string) => number;
  getTotalItems: (userId: string) => number;
  createOrder: (userId: string) => Order;
}

export const useCartStore = create<CartState>() (
   persist(
    (set, get) => ({
      userCarts: {},
      currentUserId: null,

      setCurrentUser: (userId: string | null) => {
        set({ currentUserId: userId });
      },

      getItems: () => {
        const { currentUserId, userCarts } = get();
        if (!currentUserId) return [];
        return userCarts[currentUserId] || [];
      },

      getItemsByUserId: (userId: string) => {
        const { userCarts } = get();
        return userCarts[userId] || [];
      },

      addItem: (item, userId) =>
        set((state) => {
          const userCart = state.userCarts[userId] || [];
          const existing = userCart.find(i => i.id === item.id);
          
          if (existing) {
            return {
              userCarts: {
                ...state.userCarts,
                [userId]: userCart.map(i =>
                  i.id === item.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i
                ),
              },
            };
          }
          return {
            userCarts: {
              ...state.userCarts,
              [userId]: [...userCart, { ...item, quantity: 1 }],
            },
          };
        }),

      removeItem: (id, userId) =>
        set((state) => {
          const userCart = state.userCarts[userId] || [];
          return {
            userCarts: {
              ...state.userCarts,
              [userId]: userCart.filter(i => i.id !== id),
            },
          };
        }),

      updateQuantity: (id, quantity, userId) =>
        set((state) => {
          const userCart = state.userCarts[userId] || [];
          return {
            userCarts: {
              ...state.userCarts,
              [userId]: userCart.map(i =>
                i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
              ).filter(i => i.quantity > 0),
            },
          };
        }),

      clearCart: (userId) =>
        set((state) => ({
          userCarts: {
            ...state.userCarts,
            [userId]: [],
          },
        })),

      getTotalPrice: (userId) => {
        const userCart = get().userCarts[userId] || [];
        return userCart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: (userId) => {
        const userCart = get().userCarts[userId] || [];
        return userCart.reduce((total, item) => total + item.quantity, 0);
      },

      createOrder: (userId) => {
        const userCart = get().userCarts[userId] || [];
        const total = get().getTotalPrice(userId);

        const order: Order = {
          id: Math.floor(Math.random() * 1000000),
          userId,
          date: new Date().toISOString(),
          total,
          items: userCart,
        };

        get().clearCart(userId);
        return order;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
