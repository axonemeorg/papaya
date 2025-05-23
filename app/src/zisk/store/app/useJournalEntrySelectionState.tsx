import { create } from "zustand";


interface JournalEntrySelectionState {
  selected: Record<string, boolean>;
  setSelected: (selected: Record<string, boolean>) => void
  toggleSelected: (...selected: string[]) => void
}

export const useJournalEntrySelectionStateStore = create<JournalEntrySelectionState>((set) => {
  return {
    selected: {},
    setSelected: (selected: Record<string, boolean>) => set({ selected }),
    toggleSelected: (...selected: string[]) => {
      console.log('selected:', selected)
      set((prev) => {
        return {
          selected: {
            ...prev.selected,
            ...Object.fromEntries(
              selected.map((key) => {
                return [key, !prev.selected[key]]
              })
            ),
          }
        }
      })
    }
  }
})

export const useJournalEntrySelectionState = () => useJournalEntrySelectionStateStore((state) => state.selected)
export const useSetJournalEntrySelectionState = () => useJournalEntrySelectionStateStore((state) => state.setSelected)
export const useToggleJournalEntrySelectionState = () => useJournalEntrySelectionStateStore((state) => state.toggleSelected)
