"use client";

import type { NavbarProps } from "@heroui/react";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Divider,
} from "@heroui/react";
import Image from "next/image";
//componets
import ProfileIcon from "./profile-icon";
import { ThemeSwitcher } from "@/app/components/theme-switcher";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";

import { cn } from "@heroui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { checkClientId } from "../lib/general";

export default function NavBar(props: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t } = useLanguage();

  // Define links with translation keys
  const links = [
    { href: "/golfcourse", label: t("golf") },
    { href: "/f&b", label: t("food") },
    { href: "/hotel", label: t("hotel") },
    { href: "/membership", label: t("membership") },
  ];

  if (pathname.startsWith("/dashboard")) {
    return <></>;
  }

  return (
    <Navbar
      {...props}
      classNames={{
        base: cn("border-default-100 nav-section", {
          "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
        }),
        wrapper: "w-full justify-center",
        item: "hidden md:flex",
        // Keep the size but make sure it doesn't override other styles
        toggle: "min-w-12 min-h-12 text-default-500",
      }}
      height="60px"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBordered
    >
      {/* Left Content */}
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">
          <Image
            src="/logo.webp"
            alt="logo"
            width={50}
            height={50}
            priority={true}
          />
          <span>SPLASH GOLF CLUB</span>
        </Link>
      </NavbarBrand>

      {/* Center Content */}
      <NavbarContent justify="center">
        {links.map(({ href, label }) => (
          <NavbarItem key={href} isActive={pathname === href}>
            <Link href={href}>{label}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Content */}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>

        <ThemeSwitcher />

        {checkClientId() ? (
          <ProfileIcon />
        ) : (
          <NavbarItem className="ml-2 !flex gap-2">
            <Button
              as={NextLink}
              href="/auth/login"
              color="primary"
              variant="flat"
            >
              {t("login")}
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile Language Switcher + Menu Toggle */}
      <div className="md:hidden flex items-center gap-2">
        <NavbarItem className="flex md:hidden !items-center">
          <LanguageSwitcher />
        </NavbarItem>
        {/* Improved menu toggle with larger touch target */}
        <div className="flex items-center justify-center w-14 h-14 -mr-2">
          <NavbarMenuToggle
            className="text-default-400 burger-menu w-full h-full flex items-center justify-center p-3"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </div>

      <NavbarMenu className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
        {/* Regular menu items first */}
        {links.map(({ href, label }) => (
          <NavbarMenuItem key={`${href}-${label}`}>
            <Link
              className="mb-2 w-full text-default-500 p-3 rounded-md hover:bg-default-100 dark:hover:bg-default-200/30 flex items-center"
              href={href}
              size="md"
            >
              {label}
            </Link>
            <Divider className="opacity-50" />
          </NavbarMenuItem>
        ))}

        {/* Profile or login */}
        {checkClientId() ? (
          <NavbarMenuItem>
            <Link
              className="mb-2 w-full text-default-500 mobile-profile p-3 rounded-md hover:bg-default-100 dark:hover:bg-default-200/30 flex items-center"
              href={`/profile`}
              size="md"
            >
              {t("profile")}
            </Link>
          </NavbarMenuItem>
        ) : (
          <NavbarMenuItem>
            <Button
              fullWidth
              as={NextLink}
              href="/auth/login"
              variant="faded"
              className="h-12 px-5 py-3 mt-2 mb-3"
            >
              {t("login")}
            </Button>
          </NavbarMenuItem>
        )}

        {/* Theme switcher at the bottom with icon hints */}
        <div className="flex justify-center items-center mt-6 mb-2">
          <div className="p-2 rounded-full bg-default-100/70 dark:bg-default-200/20 flex items-center">
            <span className="text-yellow-500 dark:text-yellow-400 mr-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <ThemeSwitcher />
            <span className="text-blue-500 dark:text-blue-400 ml-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
