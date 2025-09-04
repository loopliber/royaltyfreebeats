import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "689a551f981ee080a572838a", 
  requiresAuth: true // Ensure authentication is required for all operations
});
