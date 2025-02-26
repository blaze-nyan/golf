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
      const clientId = window.localStorage.getItem("clientId");
      if (clientId) {
        // Do something with clientId
      } else {
        router.push("/auth/login");
      }
    }
  }, [router, isClient]);

  return null;
};

export default AuthRedirect;
