import { create } from 'zustand'

interface AppMenuState {
	isExpanded: boolean
	isDrawerOpen: boolean
	closeDrawer: () => void
	openDrawer: () => void
	toggleExpanded: () => void
	expand: () => void
	collapse: () => void
}

export const useAppMenuStateStore = create<AppMenuState>((set) => ({
	isExpanded: false,
	isDrawerOpen: false,
	closeDrawer: () => set({ isDrawerOpen: false }),
	openDrawer: () => set({ isDrawerOpen: true }),
	toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
	expand: () => set({ isExpanded: true }),
	collapse: () => set({ isExpanded: false }),
}))
