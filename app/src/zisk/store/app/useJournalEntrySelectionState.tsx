import { create } from "zustand";


interface JournalEntrySelectionState {
  selected: Record<string, boolean>;
  setSelected: (selected: Record<string, boolean>) => void
  toggleSelected: (selected: string[]) => void
}

export const useJournalEntrySelectionState = create<JournalEntrySelectionState>((set) => {
  return {
    selected: {},
    setSelected: (selected: Record<string, boolean>) => set({ selected }),
    toggleSelected: (selected: string[]) => {
      set((prev) => {
        return {
          ...prev,
          ...Object.fromEntries(
            selected.map((key) => {
              return [key, !prev.selected[key]]
            })
          ),
        }
      })
    }
  }
})
