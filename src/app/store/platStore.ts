import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WithoutId, UpdateData } from '@/types/utils.type';
import { findByUserId, findById } from '@/types/utils.type';

export interface PlatData {
  id: string;
  userId: string;
  name: string;
  price: number;
  image: string;
}

export type PlatInput = WithoutId<PlatData>;
export type PlatUpdate = UpdateData<Omit<PlatData, 'userId'>>;

interface PlatState {
  plats: PlatData[];
  createPlat: (platData: PlatInput) => PlatData;
  getPlatsByUserId: (userId: string) => PlatData[];
  updatePlat: (platId: string, updates: PlatUpdate) => PlatData | null;
  deletePlat: (platId: string) => void;
  deletePlatsByUserId: (userId: string) => void;
  getAllPlats: () => PlatData[];
}

export const usePlatStore = create<PlatState>()(
  persist(
    (set, get) => ({
      plats: [],

      createPlat: (platData: PlatInput) => {
        const newPlat: PlatData = {
          ...platData,
          id: Date.now().toString(),
        };
        set((state) => ({
          plats: [...state.plats, newPlat],
        }));
        return newPlat;
      },

      getPlatsByUserId: (userId: string): PlatData[] => {
        const plats = get().plats;
        return findByUserId(plats, userId);
      },

      updatePlat: (platId: string, updates: PlatUpdate) => {
        const plats = get().plats;
        const plat = findById(plats, platId);
        if (plat) {
          const updated = plats.map((p) => 
            p.id === platId ? { ...p, ...updates } : p
          );
          set({ plats: updated });
          return { ...plat, ...updates } as PlatData;
        }
        return null;
      },

      deletePlat: (platId: string) => {
        set((state) => ({
          plats: state.plats.filter((p) => p.id !== platId),
        }));
      },

      deletePlatsByUserId: (userId: string) => {
        set((state) => {
          const platsToKeep = state.plats.filter((p) => p.userId !== userId);
          return { plats: platsToKeep };
        });
      },

      getAllPlats: (): PlatData[] => {
        return get().plats;
      },
    }),
    {
      name: 'plats-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

