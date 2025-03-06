import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientId, isAuthValid } from "@/app/lib/auth";

const AuthRedirect = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      console.log("Auth redirect checking authentication state");
      console.log("localStorage clientId:", localStorage.getItem("clientId"));
      console.log(
        "sessionStorage clientId:",
        sessionStorage.getItem("clientId")
      );

      // Get clientId and check if authentication is valid
      const clientId = getClientId();
      const validAuth = isAuthValid();

      console.log("Client ID:", clientId);
      console.log("Auth valid:", validAuth);

      if (clientId && validAuth) {
        // User is authenticated, continue with the app
        console.log("User is authenticated, proceeding...");
      } else {
        // Not authenticated, redirect to login
        console.log("User is not authenticated, redirecting to login");
        router.push("/auth/login");
      }
    }
  }, [router, isClient]);

  return null;
};

export default AuthRedirect;
