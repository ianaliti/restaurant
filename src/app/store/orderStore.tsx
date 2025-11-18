import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order } from '@/types/restaurants.type';


interface OrderState {
    orders: Order[];
    addOrder: (order : Order) => void;
}

export const useOrderStore = create<OrderState>() (
   persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
    }),
    {
      name: "order-history-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
