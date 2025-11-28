import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order } from '@/types/restaurants.type';


interface OrderState {
    userOrders: Record<string, Order[]>;
    addOrder: (order: Order) => void;
    getOrdersByUserId: (userId: string) => Order[];
}

export const useOrderStore = create<OrderState>() (
   persist(
    (set, get) => ({
      userOrders: {},

      addOrder: (order) =>
        set((state) => {
          const userOrders = state.userOrders[order.userId] || [];
          return {
            userOrders: {
              ...state.userOrders,
              [order.userId]: [...userOrders, order],
            },
          };
        }),

      getOrdersByUserId: (userId: string) => {
        const userOrders = get().userOrders[userId] || [];
        return userOrders;
      },
    }),
    {
      name: "order-history-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getAllOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('order-history-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const userOrders = parsed.state?.userOrders || {};
      return Object.values(userOrders).flat() as Order[];
    } catch {
      return [];
    }
  }
  return [];
};
