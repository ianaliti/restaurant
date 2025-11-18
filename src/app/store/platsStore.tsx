import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


interface PlatState {
    addPlat: (id: number) => void;
    deletePlat: (id: number) => void;
}

export const useCartStore = create<PlatState>() (
   persist(
    (set, get) => ({
    addPlat: (id: number) =>
        set((state) => {
        
    }),
    {
      name: "plat-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
