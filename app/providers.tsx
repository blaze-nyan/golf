"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <HeroUIProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
