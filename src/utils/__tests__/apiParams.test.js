import { describe, it, expect } from 'vitest';
import { buildPageQuery, normalizeToPage, DEFAULT_PAGE_SIZE } from '../apiParams';

describe('apiParams', () => {
  it('buildPageQuery builds page/size/sort params', () => {
    const qs = buildPageQuery(2, 50, ['createdAt,desc', 'id,desc']);
    expect(qs).toContain('page=2');
    expect(qs).toContain('size=50');
    expect(qs).toContain('sort=createdAt%2Cdesc');
    expect(qs).toContain('sort=id%2Cdesc');
  });

  it('normalizeToPage returns page as-is when already paged', () => {
    const page = { content: [{ id: 1 }], number: 0, size: 20, last: true, totalElements: 1 };
    expect(normalizeToPage(page)).toBe(page);
  });

  it('normalizeToPage wraps array into page shape', () => {
    const wrapped = normalizeToPage([{ id: 1 }, { id: 2 }], 1, 10);
    expect(wrapped.content.length).toBe(2);
    expect(wrapped.number).toBe(1);
    expect(wrapped.size).toBe(10);
    expect(wrapped.last).toBe(true);
    expect(wrapped.totalElements).toBe(2);
  });

  it('normalizeToPage falls back to empty page when input invalid', () => {
    const wrapped = normalizeToPage(null);
    expect(wrapped.content).toEqual([]);
    expect(wrapped.size).toBe(DEFAULT_PAGE_SIZE);
    expect(wrapped.last).toBe(true);
  });
});


