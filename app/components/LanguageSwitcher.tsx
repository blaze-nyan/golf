// app/components/LanguageSwitcher.tsx
"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useLanguage, Language } from "../contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { key: "en", label: "English", flag: "🇺🇸" },
    { key: "th", label: "ไทย", flag: "🇹🇭" },
    { key: "zh", label: "中文", flag: "🇨🇳" },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" className="min-w-0 px-2">
          <span className="text-xl">
            {languages.find((lang) => lang.key === language)?.flag || "🌐"}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Language options">
        {languages.map((lang) => (
          <DropdownItem
            key={lang.key}
            textValue={lang.label}
            className={
              language === lang.key ? "text-primary-600 font-medium" : ""
            }
            onPress={() => changeLanguage(lang.key as Language)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
