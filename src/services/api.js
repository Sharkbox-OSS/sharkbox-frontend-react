import axios from 'axios';
import { config } from '../config/env';

/**
 * Get access token from localStorage
 * react-oidc-context stores user data with a key pattern based on authority and client_id
 * 
 * Strategy: Always try to get the token if user is logged in.
 * This allows public endpoints to still benefit from authenticated requests
 * (better rate limiting, personalization, analytics, etc.)
 * 
 * Best Practice: Send token if available, even for public endpoints.
 * Backend should handle public endpoints gracefully by ignoring the token if not needed.
 */
const getAccessToken = () => {
  try {
    // react-oidc-context stores user as JSON with key pattern: oidc.user:{authority}#{client_id}
    // Try to find any oidc user storage key in both localStorage and sessionStorage
    const localKeys = Object.keys(localStorage);
    const sessionKeys = Object.keys(sessionStorage);
    
    // Look for oidc.user: key first (most reliable)
    const userKey = (localKeys.find((key) => key.startsWith('oidc.user:'))
      ?? sessionKeys.find((key) => key.startsWith('oidc.user:')));
    if (userKey) {
      try {
        const stored = localStorage.getItem(userKey) ?? sessionStorage.getItem(userKey);
        if (stored) {
          const user = JSON.parse(stored);
          // react-oidc-context stores token in access_token property
          if (user?.access_token) {
            return user.access_token;
          }
        }
      } catch (e) {
        // JSON parse failed, try next method
      }
    }
    
    // Fallback: try direct access_token key patterns
    // Some configurations might store it directly
    const directTokenKeys = [
      'oidc.access_token',
      ...localKeys.filter(key => key.includes('access_token')),
      ...sessionKeys.filter(key => key.includes('access_token')),
    ];
    
    for (const key of directTokenKeys) {
      const token = localStorage.getItem(key) ?? sessionStorage.getItem(key);
      if (token && token.length > 10) { // Basic validation
        return token;
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error retrieving access token:', error);
    return null;
  }
};

/**
 * API Client
 * Centralized axios instance with interceptors for auth and error handling
 */
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add auth token
 * 
 * Best Practice: Always send token if available, even for public endpoints.
 * Benefits:
 * - Backend can provide personalized responses to logged-in users
 * - Better rate limiting for authenticated users
 * - Analytics and usage tracking
 * - Backend can ignore token for public endpoints if not needed
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Note: If no token is found, we don't add Authorization header
    // This allows public endpoints to work without auth
    // Backend should handle public endpoints gracefully
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 for authenticated endpoints
    // Public endpoints might return 401 if token is invalid but request should still work
    // So we only redirect if we actually had a token
    if (error.response?.status === 401) {
      const token = getAccessToken();
      
      if (token) {
        // We had a token but got 401, so it's expired/invalid
        // Clear auth data and redirect to login
        const storageKeys = Object.keys(localStorage);
        storageKeys
          .filter((key) => key.startsWith('oidc.'))
          .forEach((key) => localStorage.removeItem(key));
        
        // Only redirect if we're not already on login/callback pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/callback')) {
          window.location.href = '/login';
        }
      }
      // If no token and 401, it's likely a public endpoint that requires auth
      // Let the component handle the error appropriately
    }
    return Promise.reject(error);
  }
);

export default apiClient;
