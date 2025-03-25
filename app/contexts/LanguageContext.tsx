/* eslint-disable @typescript-eslint/no-explicit-any */
// app/contexts/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define available languages
export type Language = "en" | "th" | "zh";
export type TranslationKey = string;

// Context type
type LanguageContextType = {
  language: Language;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  changeLanguage: (lang: Language) => void;
  translations: Record<string, any>;
};

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Initial translations placeholders
const initialTranslations: Record<string, any> = {};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] =
    useState<Record<string, any>>(initialTranslations);
  const [isLoading, setIsLoading] = useState(true);

  // Load translations based on the current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        console.log(`Loading translations for language: ${language}`);
        const response = await fetch(`/locales/${language}/common.json`);
        if (!response.ok) {
          console.error(
            `Failed to load translations: ${response.status} ${response.statusText}`
          );
          return;
        }
        const data = await response.json();
        console.log("Loaded translations:", data); // Debug
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize with browser language or stored preference
    const initializeLanguage = () => {
      // First check localStorage
      const storedLang = localStorage.getItem("language") as Language;
      if (storedLang && ["en", "th", "zh"].includes(storedLang)) {
        setLanguage(storedLang);
        return;
      }

      // Otherwise, try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Language;
      if (["en", "th", "zh"].includes(browserLang)) {
        setLanguage(browserLang);
      }
    };

    if (typeof window !== "undefined") {
      initializeLanguage();
    }

    loadTranslations();
  }, [language]);

  // Translate function that supports parameter replacement
  const t = (
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string => {
    if (isLoading) return key; // Return the key while loading

    const value = translations[key] || key;

    if (params) {
      return Object.entries(params).reduce(
        (acc, [paramKey, paramValue]) =>
          acc.replace(`{{${paramKey}}}`, String(paramValue)),
        value
      );
    }

    return value;
  };

  // Change language function
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);

    // Optional: reload current page with new locale
    const currentPath = window.location.pathname;
    router.push(currentPath);
  };

  return (
    <LanguageContext.Provider
      value={{ language, t, changeLanguage, translations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
