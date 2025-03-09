import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientId, isAuthValid } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";
const AuthRedirect = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      logger.log("Auth redirect checking authentication state");
      logger.log("localStorage clientId:", localStorage.getItem("clientId"));
      logger.log(
        "sessionStorage clientId:",
        sessionStorage.getItem("clientId")
      );

      // Get clientId and check if authentication is valid
      const clientId = getClientId();
      const validAuth = isAuthValid();

      logger.log("Client ID:", clientId);
      logger.log("Auth valid:", validAuth);

      if (clientId && validAuth) {
        // User is authenticated, continue with the app
        logger.log("User is authenticated, proceeding...");
      } else {
        // Not authenticated, redirect to login
        logger.log("User is not authenticated, redirecting to login");
        router.push("/auth/login");
      }
    }
  }, [router, isClient]);

  return null;
};

export default AuthRedirect;
