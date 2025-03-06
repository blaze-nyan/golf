// app/components/auth-redirect.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthRedirect = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      // Check localStorage first (for remembered users)
      let clientId = window.localStorage.getItem("clientId");

      // If there's no clientId in localStorage, check sessionStorage
      if (!clientId) {
        clientId = window.sessionStorage.getItem("clientId");
      }

      // If we found a clientId in either storage
      if (clientId) {
        // Check if it's from localStorage and has an expiration
        if (window.localStorage.getItem("clientId") === clientId) {
          const expiration = window.localStorage.getItem("clientIdExpiration");

          // If there's an expiration date set
          if (expiration) {
            const expirationDate = new Date(expiration);
            const now = new Date();

            // If token has expired, clear it and redirect to login
            if (now > expirationDate) {
              window.localStorage.removeItem("clientId");
              window.localStorage.removeItem("clientIdExpiration");
              window.localStorage.removeItem("rememberMe");
              router.push("/auth/login");
              return;
            }
          }
        }

        // If clientId exists and isn't expired, user is authenticated
        // Continue with your authenticated flow here
      } else {
        // No clientId found in either storage, redirect to login
        router.push("/auth/login");
      }
    }
  }, [router, isClient]);

  return null;
};

export default AuthRedirect;
