import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInfinitePagination } from '../../hooks/useInfinitePagination';

function wrapper({ children }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const makePage = (page, size, total) => ({
  content: Array.from({ length: Math.min(size, Math.max(0, total - page * size)) }, (_, i) => ({ id: page * size + i + 1 })),
  number: page,
  size,
  last: (page + 1) * size >= total,
  totalElements: total,
});

describe('useInfinitePagination', () => {
  it('flattens and de-duplicates items across pages and fetches next page', async () => {
    const fetchPage = vi.fn((page, size) => Promise.resolve(makePage(page, size, 45)));

    const { result } = renderHook(() => useInfinitePagination({
      queryKey: ['test'],
      fetchPage,
      pageSize: 20,
      sort: ['id,asc'],
    }), { wrapper });

    expect(Array.isArray(result.current.items)).toBeTruthy();

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThanOrEqual(20);
    });
    expect(result.current.hasNextPage).toBeTruthy();
  });
});


