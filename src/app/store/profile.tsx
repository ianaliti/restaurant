// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { Profile } from "@/types/restaurants.type"

// interface ProfileState {
//     profile?: Profile;
// }

// export const useProfileStore = create<ProfileState>(
//     persist(
//         (set, get) => ({
//             addProfile: (profile: Profile) => set((state) => {
//                 const exist = state.profile.id
//             })
//         }
//     )
// )