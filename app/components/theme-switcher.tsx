// app/components/ThemeSwitcher.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only run after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR, render a placeholder button to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="light"
        isIconOnly
        className="rounded-full light-dark"
        aria-label="Theme"
      >
        {/* No icon during SSR */}
      </Button>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" isIconOnly className="rounded-full light-dark">
          {theme === "dark" ? (
            <Moon size={25} />
          ) : theme === "light" ? (
            <Sun size={25} />
          ) : (
            <Monitor size={25} />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Theme options">
        <DropdownItem
          key="light"
          startContent={<Sun size={20} />}
          onPress={() => setTheme("light")}
        >
          Light
        </DropdownItem>
        <DropdownItem
          key="dark"
          startContent={<Moon size={20} />}
          onPress={() => setTheme("dark")}
        >
          Dark
        </DropdownItem>
        <DropdownItem
          key="system"
          startContent={<Monitor size={20} />}
          onPress={() => setTheme("system")}
        >
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
