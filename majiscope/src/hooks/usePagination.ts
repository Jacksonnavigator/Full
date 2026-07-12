import { useCallback, useEffect, useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(0);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.max(0, Math.min(nextPage, totalPages - 1)));
    },
    [totalPages]
  );

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    nextPage: () => goToPage(page + 1),
    prevPage: () => goToPage(page - 1),
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
  };
}
