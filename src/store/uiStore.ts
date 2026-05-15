import { create } from 'zustand'

/**
 * Ephemeral session UI state — not persisted to localStorage.
 * Tracks which accordion entry is expanded per section type,
 * so navigating between sections preserves the open card.
 */
interface UIStore {
  /** sectionType → currently expanded entry id (null = all collapsed) */
  expandedEntry: Record<string, string | null>
  setExpandedEntry: (sectionType: string, id: string | null) => void
  toggleExpandedEntry: (sectionType: string, id: string) => void
}

export const useUIStore = create<UIStore>()((set, get) => ({
  expandedEntry: {},

  setExpandedEntry(sectionType, id) {
    set((s) => ({ expandedEntry: { ...s.expandedEntry, [sectionType]: id } }))
  },

  toggleExpandedEntry(sectionType, id) {
    const current = get().expandedEntry[sectionType]
    set((s) => ({
      expandedEntry: { ...s.expandedEntry, [sectionType]: current === id ? null : id },
    }))
  },
}))
