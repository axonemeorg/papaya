import { create } from "zustand";

interface AppMenuState {
    isExpanded: boolean;
    toggleOpen: () => void;
    open: () => void;
    close: () => void;
}

export const useAppMenuStateStore = create<AppMenuState>((set) => ({
    isExpanded: false,
    toggleOpen: () => set((state) => ({ isExpanded: !state.isExpanded })),
    open: () => set({ isExpanded: true }),
    close: () => set({ isExpanded: false }),
}));
