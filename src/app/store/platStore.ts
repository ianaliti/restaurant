import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PlatData {
  id: string;
  userId: string;
  name: string;
  price: number;
  image: string;
}

interface PlatState {
  plats: PlatData[];
  createPlat: (platData: Omit<PlatData, 'id'>) => PlatData;
  getPlatsByUserId: (userId: string) => PlatData[];
  updatePlat: (platId: string, updates: Partial<Omit<PlatData, 'id' | 'userId'>>) => PlatData | null;
  deletePlat: (platId: string) => void;
  deletePlatsByUserId: (userId: string) => void;
  getAllPlats: () => PlatData[];
}

export const usePlatStore = create<PlatState>()(
  persist(
    (set, get) => ({
      plats: [],

      createPlat: (platData: Omit<PlatData, 'id'>) => {
        const newPlat: PlatData = {
          ...platData,
          id: Date.now().toString(),
        };
        set((state) => ({
          plats: [...state.plats, newPlat],
        }));
        return newPlat;
      },

      getPlatsByUserId: (userId: string) => {
        const plats = get().plats;
        return plats.filter((p) => p.userId === userId);
      },

      updatePlat: (platId: string, updates: Partial<Omit<PlatData, 'id' | 'userId'>>) => {
        const plats = get().plats;
        const index = plats.findIndex((p) => p.id === platId);
        if (index >= 0) {
          const updated = [...plats];
          updated[index] = { ...updated[index], ...updates };
          set({ plats: updated });
          return updated[index];
        }
        return null;
      },

      deletePlat: (platId: string) => {
        set((state) => ({
          plats: state.plats.filter((p) => p.id !== platId),
        }));
      },

      deletePlatsByUserId: (userId: string) => {
        set((state) => ({
          plats: state.plats.filter((p) => p.userId !== userId),
        }));
      },

      getAllPlats: () => {
        return get().plats;
      },
    }),
    {
      name: 'plats-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

