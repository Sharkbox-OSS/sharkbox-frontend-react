import apiClient from './api';

/**
 * Auth Service
 * API calls related to authentication configuration
 */

/**
 * Get auth configuration from backend
 */
export const getAuthConfig = async () => {
  const response = await apiClient.get('/v1/auth/config');
  return response.data;
};

