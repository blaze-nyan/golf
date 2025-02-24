import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthRedirect = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const clientId = localStorage.getItem("clientId");
      if (clientId) {
      } else {
        router.push("/auth/login");
      }
    }
  }, [router, isClient]);

  return null;
};

export default AuthRedirect;
