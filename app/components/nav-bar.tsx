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
//componets
import ProfileIcon from "./profile-icon";
import { ThemeSwitcher } from "@/app/components/theme-switcher";

import { cn } from "@heroui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { checkClientId } from "../lib/general";
const links = [
  { href: "/golfcourse", label: "Golf" },
  { href: "/f&b", label: "F&B" },
  { href: "/hotel", label: "Hotel" },
  { href: "/membership", label: "Membership" },
];

export default function NavBar(props: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  if (pathname.startsWith("/dashboard")) {
    return <></>;
  }

  return (
    <Navbar
      {...props}
      classNames={{
        base: cn("border-default-100", {
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
          GOLF CLUB
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
              Login to Book
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <ThemeSwitcher />

      <NavbarMenuToggle className="text-default-400 md:hidden" />

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
        {checkClientId() ? (
          <NavbarMenuItem>
            <Link
              className="mb-2 w-full text-default-500"
              href="/profile"
              size="md"
            >
              Profile
            </Link>
            <Divider className="opacity-50" />
          </NavbarMenuItem>
        ) : (
          <NavbarMenuItem>
            <Button fullWidth as={NextLink} href="/auth/login" variant="faded">
              Sign In
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
