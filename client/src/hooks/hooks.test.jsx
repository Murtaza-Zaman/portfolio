import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { useAuth } from "./useAuth";
import { useDebounce } from "./useDebounce";
import { useModal } from "./useModal";
import { usePagination } from "./usePagination";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { useAdminStore } from "../store/adminStore";

describe("Custom Hooks & State Stores (Layer 07 & Layer 08)", () => {
  beforeEach(() => {
    sessionStorage.clear();
    useAuthStore.setState({ token: null, user: null });
    useUiStore.setState({
      isMobileNavOpen: false,
      isSearchModalOpen: false,
      themeMode: "dark",
      isReducedMotionPreferred: false,
    });
    useAdminStore.setState({
      isSidebarCollapsed: false,
      activeResource: "projects",
      selectedItem: null,
      searchQuery: "",
      activeFilter: "all",
    });
  });

  describe("useAuth", () => {
    it("returns guest status when not authenticated", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userRole).toBe("GUEST");
      expect(result.current.canEdit).toBe(false);
      expect(result.current.canDelete).toBe(false);
    });

    it("returns admin permissions when authenticated as ADMIN", () => {
      act(() => {
        useAuthStore.getState().setSession({
          accessToken: "mock_jwt_token",
          user: { name: "Murtaza", role: "ADMIN" },
        });
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.canEdit).toBe(true);
      expect(result.current.canDelete).toBe(true);
      expect(result.current.canManageUsers).toBe(true);
    });

    it("restricts delete and user management for EDITOR role", () => {
      act(() => {
        useAuthStore.getState().setSession({
          accessToken: "mock_jwt_token",
          user: { name: "Editor User", role: "EDITOR" },
        });
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isEditor).toBe(true);
      expect(result.current.canEdit).toBe(true);
      expect(result.current.canDelete).toBe(false);
      expect(result.current.canManageUsers).toBe(false);
    });
  });

  describe("useDebounce", () => {
    it("debounces value updates according to delay", () => {
      vi.useFakeTimers();
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: "initial", delay: 300 },
      });

      expect(result.current).toBe("initial");

      rerender({ value: "updated", delay: 300 });
      expect(result.current).toBe("initial"); // not updated yet

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe("updated");
      vi.useRealTimers();
    });
  });

  describe("useModal", () => {
    it("handles modal open, payload setting, close, and toggle", () => {
      const { result } = renderHook(() => useModal());
      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();

      act(() => {
        result.current.openModal({ id: "project-1", title: "Enterprise SaaS" });
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toEqual({ id: "project-1", title: "Enterprise SaaS" });

      act(() => {
        result.current.closeModal();
      });
      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();

      act(() => {
        result.current.toggleModal();
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe("usePagination", () => {
    it("calculates pages and slices client-side items accurately", () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
      const { result } = renderHook(() => usePagination({ items, pageSize: 10 }));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.totalItems).toBe(25);
      expect(result.current.paginatedItems).toHaveLength(10);
      expect(result.current.paginatedItems[0].id).toBe(1);
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPrevPage).toBe(false);

      act(() => {
        result.current.nextPage();
      });
      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedItems[0].id).toBe(11);
      expect(result.current.hasPrevPage).toBe(true);

      act(() => {
        result.current.goToPage(3);
      });
      expect(result.current.currentPage).toBe(3);
      expect(result.current.paginatedItems).toHaveLength(5);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe("Zustand UI & Admin Stores", () => {
    it("manages global UI states in useUiStore", () => {
      expect(useUiStore.getState().isMobileNavOpen).toBe(false);
      act(() => {
        useUiStore.getState().toggleMobileNav();
      });
      expect(useUiStore.getState().isMobileNavOpen).toBe(true);

      act(() => {
        useUiStore.getState().toggleSearchModal();
      });
      expect(useUiStore.getState().isSearchModalOpen).toBe(true);
    });

    it("manages admin CMS navigation and filters in useAdminStore", () => {
      expect(useAdminStore.getState().isSidebarCollapsed).toBe(false);
      act(() => {
        useAdminStore.getState().toggleSidebar();
      });
      expect(useAdminStore.getState().isSidebarCollapsed).toBe(true);

      act(() => {
        useAdminStore.getState().setActiveResource("projects");
        useAdminStore.getState().setSearchQuery("SaaS");
      });
      expect(useAdminStore.getState().activeResource).toBe("projects");
      expect(useAdminStore.getState().searchQuery).toBe("SaaS");

      act(() => {
        useAdminStore.getState().resetFilters();
      });
      expect(useAdminStore.getState().searchQuery).toBe("");
    });
  });
});
