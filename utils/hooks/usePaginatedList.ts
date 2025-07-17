import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';

/**
 * Generic helper for paginated lists pulled incrementally with `useInfiniteQuery`.
 * Keeps a unified configuration (cache, retry, etc.) so drawers and other
 * consumers only provide the fetch function and query key.
 */
export type PaginatedResponse<T> = {
  data: T[];
  nextPage: number | null;
};

export function usePaginatedList<T>(
  queryKey: unknown[],
  fetchFn: ({ pageParam }: { pageParam?: number }) => Promise<PaginatedResponse<T>>,
  enabled: boolean = true,
) {
  return useInfiniteQuery<PaginatedResponse<T>, Error, InfiniteData<PaginatedResponse<T>>>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFn({ pageParam: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    // 15 min cache & stale windows as convention for drawers
    staleTime: 15 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled,
    placeholderData: {
      pages: [{ data: [], nextPage: null }],
      pageParams: [1],
    },
  });
}
