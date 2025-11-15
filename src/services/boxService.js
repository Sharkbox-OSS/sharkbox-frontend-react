import apiClient from './api';
import { buildPageQuery, DEFAULT_PAGE_SIZE, normalizeToPage } from '../utils/apiParams';

// Paged boxes list (for infinite scroll on Home)
export const getBoxes = async (page = 0, size = DEFAULT_PAGE_SIZE, sort = []) => {
  const qs = buildPageQuery(page, size, sort);
  const res = await apiClient.get(`/v1/box?${qs}`);
  return normalizeToPage(res.data, page, size);
};

export const getAllBoxes = async () => {
  const res = await apiClient.get('/v1/box');
  return res.data;
};

export const getBoxBySlug = async (slug) => {
  const res = await apiClient.get(`/v1/box/${slug}`);
  return res.data;
};

export const createBox = async (boxData) => {
  const res = await apiClient.post('/v1/box', boxData);
  return res.data;
};

export const updateBox = async (slug, boxData) => {
  const res = await apiClient.put(`/v1/box/${slug}`, boxData);
  return res.data;
};

