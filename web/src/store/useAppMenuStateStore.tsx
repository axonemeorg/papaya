import { create } from "zustand";

interface AppMenuState {
    isOpen: boolean;
    toggleOpen: () => void;
    open: () => void;
    close: () => void;
}

const LOCAL_STORAGE_KEY = "ZISK_APP_MENU_OPEN_STATE";
const DEFAULT_OPEN_STATE = true;

const getInitialOpenState = (): boolean => {
    if (typeof window !== "undefined") {
        const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedState === "true";
    }
    return DEFAULT_OPEN_STATE;
};

export const useAppMenuStateStore = create<AppMenuState>((set) => ({
    isOpen: getInitialOpenState(),
    toggleOpen: () =>
        set((state) => {
            const newState = !state.isOpen;
            if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE_KEY, newState.toString());
            }
            return { isOpen: newState };
        }),
    open: () =>
        set(() => {
            if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE_KEY, "true");
            }
            return { isOpen: true };
        }),
    close: () =>
        set(() => {
            if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE_KEY, "false");
            }
            return { isOpen: false };
        }),
}));
