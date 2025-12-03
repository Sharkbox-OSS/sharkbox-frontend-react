import apiClient from './api';
import { normalizeToPage } from '../utils/apiParams';
import { buildPageQuery, DEFAULT_PAGE_SIZE } from '../utils/apiParams';

/**
 * Comment Service
 * API calls related to comments
 */

/**
 * Get comments in a thread with pagination
 */
export const getComments = async (threadId, page = 0, size = DEFAULT_PAGE_SIZE, sort = []) => {
  const qs = buildPageQuery(page, size, sort);
  const response = await apiClient.get(`/v1/comment/${threadId}?${qs}`);
  return normalizeToPage(response.data, page, size);
};

/**
 * Get comments by user with pagination
 */
export const getCommentsByUser = async (username, page = 0, size = DEFAULT_PAGE_SIZE, sort = []) => {
  const qs = buildPageQuery(page, size, sort);
  const response = await apiClient.get(`/v1/user/${username}/comments?${qs}`);
  return normalizeToPage(response.data, page, size);
};

/**
 * Create a comment in a thread
 */
export const createComment = async (threadId, commentData) => {
  const response = await apiClient.post(`/v1/comment/${threadId}`, commentData);
  return response.data;
};

/**
 * Update a comment
 */
export const updateComment = async (threadId, commentId, commentData) => {
  const response = await apiClient.put(`/v1/comment/${threadId}/${commentId}`, commentData);
  return response.data;
};

/**
 * Vote on a comment
 */
export const voteOnComment = async (threadId, commentId, isUpvote) => {
  const response = await apiClient.patch(`/v1/comment/${threadId}/${commentId}`, { isUpvote });
  return response.data;
};

