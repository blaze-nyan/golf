"use client";

import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ToastProvider } from "@heroui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <HeroUIProvider>
          <LanguageProvider>
            {/* First render children */}
            {children}

            {/* Then add the ToastProvider */}
            <ToastProvider
              placement="top-right"
              maxVisibleToasts={5}
              toastOffset={16}
            />

            {/* Add the ToastViewport component if required by the library */}
          </LanguageProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
