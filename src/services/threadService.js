import apiClient from './api';
import { buildPageQuery, DEFAULT_PAGE_SIZE } from '../utils/apiParams';

/**
 * Thread Service
 * API calls related to threads (posts)
 */

/**
 * Get threads in a box with pagination
 */
export const getThreads = async (slug, page = 0, size = DEFAULT_PAGE_SIZE, sort = []) => {
  const qs = buildPageQuery(page, size, sort);
  const response = await apiClient.get(`/v1/box/${slug}/threads?${qs}`);
  return response.data;
};

/**
 * Get a thread by ID
 */
export const getThread = async (id) => {
  const response = await apiClient.get(`/v1/thread/${id}`);
  return response.data;
};

/**
 * Create a thread in a box
 */
export const createThread = async (slug, threadData) => {
  const response = await apiClient.post(`/v1/box/${slug}/thread`, threadData);
  return response.data;
};

/**
 * Update a thread
 */
export const updateThread = async (id, threadData) => {
  const response = await apiClient.put(`/v1/thread/${id}`, threadData);
  return response.data;
};

/**
 * Vote on a thread
 */
export const voteOnThread = async (id, isUpvote) => {
  const response = await apiClient.patch(`/v1/thread/${id}`, { isUpvote });
  return response.data;
};

