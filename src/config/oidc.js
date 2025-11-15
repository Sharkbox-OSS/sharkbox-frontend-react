import { config } from './env';
import { WebStorageStateStore } from 'oidc-client-ts';

/**
 * OIDC Configuration
 * Supports any OIDC provider, configured via environment variables
 */
export const oidcConfig = {
  authority: config.oidcAuthority,
  client_id: config.oidcClientId,
  redirect_uri: `${config.appBaseUrl}/callback`,
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: config.appBaseUrl,
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  // Persist across tabs and synchronize sign-in state
  userStore: typeof window !== 'undefined' ? new WebStorageStateStore({ store: window.localStorage }) : undefined,
  monitorSession: true,
};

