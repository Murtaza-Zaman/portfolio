import { create } from "zustand";

/**
 * Global UI Store (Zustand)
 * Manages global client-side UI states such as mobile drawer, search modal,
 * theme preferences, and accessibility motion settings.
 */
export const useUiStore = create((set) => ({
  isMobileNavOpen: false,
  isSearchModalOpen: false,
  themeMode: "dark",
  isReducedMotionPreferred: false,

  setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: Boolean(isOpen) }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: Boolean(isOpen) }),
  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),

  setThemeMode: (themeMode) => set({ themeMode }),
  setReducedMotionPreferred: (isReducedMotionPreferred) => set({ isReducedMotionPreferred: Boolean(isReducedMotionPreferred) }),
}));
