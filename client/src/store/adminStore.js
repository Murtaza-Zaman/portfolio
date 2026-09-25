import { create } from "zustand";

/**
 * Admin CMS UI Store (Zustand)
 * Manages admin CMS interface states such as sidebar collapse, active resource,
 * and table filter preferences.
 */
export const useAdminStore = create((set) => ({
  isSidebarCollapsed: false,
  activeResource: "projects",
  selectedItem: null,
  searchQuery: "",
  activeFilter: "all",

  setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: Boolean(isCollapsed) }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setActiveResource: (activeResource) => set({ activeResource }),
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setSearchQuery: (searchQuery) => set({ searchQuery: String(searchQuery || "") }),
  setActiveFilter: (activeFilter) => set({ activeFilter: String(activeFilter || "all") }),

  resetFilters: () => set({ searchQuery: "", activeFilter: "all", selectedItem: null }),
}));
