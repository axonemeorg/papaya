import { ItemAvatar } from "@/types/get";
import { create } from "zustand";

interface UserImageAvatarHistoryStore {
    history: ItemAvatar[];
    add: (avatar: ItemAvatar) => void;
    clear: () => void;
  }

export const useUserImageAvatarHistoryStore = create<UserImageAvatarHistoryStore>((set) => ({
    history: [],
    add: (avatar: ItemAvatar) => set((state) => ({ history: [avatar, ...state.history] })),
    clear: () => set({ history: [] }),
}));
