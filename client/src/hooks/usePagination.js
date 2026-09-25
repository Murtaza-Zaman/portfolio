import { useMemo, useState } from "react";

/**
 * Custom Hook: usePagination
 * Manages pagination calculations, page boundaries, and page navigation.
 *
 * @param {Object} options
 * @param {Array} [options.items=[]] - Array of items to paginate
 * @param {number} [options.initialPage=1] - Starting page
 * @param {number} [options.pageSize=10] - Number of items per page
 * @param {number} [options.totalCount] - Total items if managing server-side pagination
 */
export function usePagination({ items = [], initialPage = 1, pageSize = 10, totalCount } = {}) {
  const [currentPage, setCurrentPage] = useState(Math.max(1, Number(initialPage) || 1));

  const count = totalCount !== undefined ? totalCount : items.length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // Keep page within bounds if count changes
  const activePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    if (totalCount !== undefined) {
      return items; // Server-side pagination handles slicing
    }
    const startIndex = (activePage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, activePage, pageSize, totalCount]);

  const goToPage = (page) => {
    const target = Math.max(1, Math.min(Number(page) || 1, totalPages));
    setCurrentPage(target);
  };

  const nextPage = () => {
    if (activePage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (activePage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const hasNextPage = activePage < totalPages;
  const hasPrevPage = activePage > 1;

  return {
    currentPage: activePage,
    totalPages,
    pageSize,
    totalItems: count,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
}
