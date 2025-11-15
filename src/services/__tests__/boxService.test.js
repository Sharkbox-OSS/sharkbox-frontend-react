import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllBoxes, getBoxBySlug, createBox } from '../boxService';
import apiClient from '../api';

// Mock the API client
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('boxService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBoxes', () => {
    it('fetches all boxes from API', async () => {
      const mockBoxes = [
        { id: 1, name: 'Box 1', slug: 'box-1' },
        { id: 2, name: 'Box 2', slug: 'box-2' },
      ];

      apiClient.get.mockResolvedValue({ data: mockBoxes });

      const result = await getAllBoxes();

      expect(apiClient.get).toHaveBeenCalledWith('/v1/box');
      expect(result).toEqual(mockBoxes);
    });

    it('handles API errors', async () => {
      const error = new Error('API Error');
      apiClient.get.mockRejectedValue(error);

      await expect(getAllBoxes()).rejects.toThrow('API Error');
    });
  });

  describe('getBoxBySlug', () => {
    it('fetches a box by slug', async () => {
      const mockBox = { id: 1, name: 'Test Box', slug: 'test-box' };

      apiClient.get.mockResolvedValue({ data: mockBox });

      const result = await getBoxBySlug('test-box');

      expect(apiClient.get).toHaveBeenCalledWith('/v1/box/test-box');
      expect(result).toEqual(mockBox);
    });
  });

  describe('createBox', () => {
    it('creates a new box', async () => {
      const boxData = {
        name: 'New Box',
        slug: 'new-box',
        description: 'Description',
        access: 'PUBLIC',
      };

      const mockResponse = { id: 1, ...boxData };

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await createBox(boxData);

      expect(apiClient.post).toHaveBeenCalledWith('/v1/box', boxData);
      expect(result).toEqual(mockResponse);
    });
  });
});

