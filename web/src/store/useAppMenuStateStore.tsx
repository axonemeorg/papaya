import { create } from "zustand";


interface AppMenuState {
    isOpen: boolean;
    toggleOpen: () => void;
    open: () => void;
    close: () => void;
}

export const useAppMenuStateStore = create<AppMenuState>((set) => ({
    isOpen: false,
    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
