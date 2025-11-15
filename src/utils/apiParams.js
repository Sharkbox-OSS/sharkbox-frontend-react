export const DEFAULT_PAGE_SIZE = 20;

/**
 * Build query string for simple page/size/sort pagination.
 * - Uses page, size and multiple sort params
 */
export function buildPageQuery(page = 0, size = DEFAULT_PAGE_SIZE, sort = []) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (Array.isArray(sort)) {
    sort.forEach((s) => params.append('sort', s));
  }
  return params.toString();
}

/**
 * Normalize API result to a Page-like object expected by useInfinitePagination.
 * If `data` is already a page object, return as-is. If it's an array, wrap it.
 */
export function normalizeToPage(data, page = 0, size = DEFAULT_PAGE_SIZE) {
  if (data && typeof data === 'object' && !Array.isArray(data) && 'content' in data) {
    return data;
  }
  if (Array.isArray(data)) {
    return {
      content: data,
      number: page,
      size,
      last: true,
      totalElements: data.length,
    };
  }
  // Fallback to empty page
  return { content: [], number: page, size, last: true, totalElements: 0 };
}


