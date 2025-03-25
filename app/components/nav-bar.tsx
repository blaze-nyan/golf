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
        <NavbarMenuToggle className="text-default-400 burger-menu" />
      </div>

      <NavbarMenu className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
        {links.map(({ href, label }) => (
          <NavbarMenuItem key={`${href}-${label}`}>
            <Link
              className="mb-2 w-full text-default-500"
              href={href}
              size="md"
            >
              {label}
            </Link>
            <Divider className="opacity-50" />
          </NavbarMenuItem>
        ))}

        {/* No need for language switcher here anymore */}

        {checkClientId() ? (
          <NavbarMenuItem>
            <Link
              className="mb-2 w-full text-default-500 mobile-profile"
              href={`/profile`}
              size="md"
            >
              {t("profile")}
            </Link>
          </NavbarMenuItem>
        ) : (
          <NavbarMenuItem>
            <Button fullWidth as={NextLink} href="/auth/login" variant="faded">
              {t("login")}
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
