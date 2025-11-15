import { useAuth as useOidcAuth } from 'react-oidc-context';

/**
 * Custom auth hook
 * Wraps react-oidc-context to provide consistent auth interface
 */
export const useAuth = () => {
  const oidcAuth = useOidcAuth();

  return {
    ...oidcAuth,
    // Convenience properties
    isAuthenticated: oidcAuth.isAuthenticated,
    user: oidcAuth.user,
    isLoading: oidcAuth.isLoading,
    // Actions
    login: (returnTo) => oidcAuth.signinRedirect({ state: { returnTo: returnTo || (typeof window !== 'undefined' ? window.location.href : '/') } }),
    logout: () => oidcAuth.removeUser(),
    // Access token for API calls
    accessToken: oidcAuth.user?.access_token,
  };
};

