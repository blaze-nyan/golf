// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <HeroUIProvider>
          <ToastProvider placement={"top-right"} toastOffset={60} />
          <div>{children}</div>
        </HeroUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
