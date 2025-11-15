/**
 * Environment configuration
 * Reads configuration from environment variables
 */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  oidcAuthority: import.meta.env.VITE_OIDC_AUTHORITY || 'http://localhost:9080/realms/sharkbox',
  oidcClientId: import.meta.env.VITE_OIDC_CLIENT_ID || 'sharkbox-client',
  appBaseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173',
};

