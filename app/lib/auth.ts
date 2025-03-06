// app/lib/auth.ts
/**
 * Gets the client ID from either localStorage or sessionStorage
 */
export function getClientId(): string | null {
  if (typeof window === "undefined") return null;

  // First try localStorage
  const localClientId = window.localStorage.getItem("clientId");
  if (localClientId) return localClientId;

  // Then try sessionStorage
  const sessionClientId = window.sessionStorage.getItem("clientId");
  if (sessionClientId) return sessionClientId;

  return null;
}

/**
 * Sets the client ID in appropriate storage based on remember option
 */
export function setClientId(clientId: string, remember: boolean = false): void {
  if (typeof window === "undefined") return;

  if (remember) {
    // Store in localStorage for persistent sessions
    window.localStorage.setItem("clientId", clientId);

    // Optional: Set expiration (30 days)
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);
    window.localStorage.setItem("clientIdExpiration", expiration.toISOString());
    window.localStorage.setItem("rememberMe", "true");

    // Clean up sessionStorage to avoid conflicts
    window.sessionStorage.removeItem("clientId");
  } else {
    // Store in sessionStorage for session-only
    window.sessionStorage.setItem("clientId", clientId);

    // Clean up localStorage to avoid conflicts
    window.localStorage.removeItem("clientId");
    window.localStorage.removeItem("clientIdExpiration");
    window.localStorage.removeItem("rememberMe");
  }
}

/**
 * Clears auth data from all storages
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;

  // Clear all auth-related data
  window.localStorage.removeItem("clientImage");
  window.localStorage.removeItem("clientId");
  window.localStorage.removeItem("clientIdEncrypt");
  window.localStorage.removeItem("clientIdExpiration");
  window.localStorage.removeItem("rememberMe");

  window.sessionStorage.removeItem("clientId");
}

/**
 * Checks if auth data is valid (not expired)
 */
export function isAuthValid(): boolean {
  if (typeof window === "undefined") return false;

  const clientId = getClientId();
  if (!clientId) return false;

  // Check expiration if it's from localStorage
  if (window.localStorage.getItem("clientId") === clientId) {
    const expiration = window.localStorage.getItem("clientIdExpiration");
    if (expiration) {
      const expirationDate = new Date(expiration);
      const now = new Date();
      if (now > expirationDate) {
        clearAuthData();
        return false;
      }
    }
  }

  return true;
}
