import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Movie = {
  id: number;
  title: string;
};

interface WatchlistState {
  watchlist: {
    items: Movie[];
  };
  totalMovies: () => number;
  addToWatchList: (item: Movie) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: {
        items: [
          {
            title: "Inception",
            id: 5,
          },
          {
            title: "Interstellar",
            id: 6,
          },
        ],
      },
      totalMovies: () => get().watchlist.items.length,
      addToWatchList: (item: Movie) =>
        set((state) => ({
          ...state,
          watchlist: {
            items: [...state.watchlist.items, item],
          },
        })),
    }),
    {
      name: "watchlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
 