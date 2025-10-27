/**
 * Client-side authentication utilities
 * Used for checking authentication status in client components
 */

/**
 * Check if the user is currently authenticated by calling the server
 * @returns Promise<boolean> true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') {
    console.log('[Auth Client] Running on server-side, returning false');
    return false; // Server-side
  }

  try {
    console.log('[Auth Client] Calling /api/auth/check...');
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
      cache: 'no-store', // Don't cache the auth check
    });

    console.log('[Auth Client] Response status:', response.status);

    if (!response.ok) {
      console.log('[Auth Client] Auth check failed with status:', response.status);
      return false;
    }

    const data = await response.json();
    console.log('[Auth Client] Response data:', data);
    
    const isAuth = data.authenticated === true;
    
    console.log('[Auth Client] Final authentication result:', isAuth);
    
    return isAuth;
  } catch (error) {
    console.error('[Auth Client] Error checking authentication:', error);
    return false;
  }
}

/**
 * Get the auth token from cookies
 * @returns the auth token string or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side
  }

  const authToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  return authToken || null;
}

/**
 * Redirect to login with optional return URL
 * @param returnUrl - URL to return to after login
 */
export function redirectToLogin(returnUrl?: string): void {
  if (typeof window === 'undefined') {
    return; // Server-side
  }

  const redirectPath = returnUrl || window.location.pathname;
  window.location.href = `/login?redirect=${encodeURIComponent(redirectPath)}`;
}
