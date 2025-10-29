// import { describe, it, expect, beforeEach } from "vitest";
// import { useWatchlistStore } from "@/app/store/cartStore";


// beforeEach(() => {
//     try {
//         localStorage.removeItem("watchlist-storage");
//     } catch (e) {
//     }

//     useWatchlistStore.setState({
//         watchlist: {
//             items: [
//                 { id: 5, title: "Inception" },
//                 { id: 6, title: "Interstellar" },
//             ],
//         },
//     });
// });

// describe("WatchlistState.totalMovies", () => {
//     it("returns the initial count of movies (2)", () => {
//         const total = useWatchlistStore.getState().totalMovies();
//         expect(total).toBe(2);
//     });

//     it("increases the count when a movie is added", () => {
//         useWatchlistStore.getState().addToWatchList({ id: 7, title: "The Dark Knight" });
//         const total = useWatchlistStore.getState().totalMovies();
//         expect(total).toBe(3);
//     });
// });