import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE } from '../utils/apiParams';

/**
 * Generic infinite pagination hook for Spring-style pageable APIs.
 * - Calls fetchPage(page, size, sort[]) and expects { content, number, size, last, totalElements }
 * - Flattens and de-duplicates by id
 * - Provides IntersectionObserver sentinel for auto-fetching
 */
export function useInfinitePagination({
  queryKey,
  fetchPage,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = [],
  enabled = true,
}) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [...queryKey, sort.join('|')],
    queryFn: ({ pageParam = 0 }) => fetchPage(pageParam, pageSize, sort),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const size = lastPage?.size ?? pageSize;
      const total = lastPage?.totalElements;
      const number = lastPage?.number ?? (allPages.length - 1);
      const fetched = allPages.reduce((acc, p) => acc + ((p?.content || []).length), 0);
      const hasMoreByTotal = typeof total === 'number' ? fetched < total : undefined;
      const hasMore = (lastPage?.last === false)
        || (Array.isArray(lastPage?.content) && lastPage.content.length === size)
        || hasMoreByTotal === true;
      return hasMore ? number + 1 : undefined;
    },
    enabled,
  });

  const items = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const page of (data?.pages || [])) {
      for (const c of (page?.content || [])) {
        const id = c?.id ?? `${out.length}-${Math.random()}`;
        if (!seen.has(id)) {
          seen.add(id);
          out.push(c);
        }
      }
    }
    return out;
  }, [data]);

  const total = data?.pages?.[0]?.totalElements ?? items.length;

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) fetchNextPage();
      });
    }, { root: null, rootMargin: '200px', threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return {
    pages: data?.pages || [],
    items,
    total,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    sentinelRef,
  };
}


