// app/components/dashboard/Sidebar.tsx
"use client";

import React, { useState } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import {
  Home,
  Calendar,
  LandPlot,
  Users,
  Settings,
  BarChart,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    icon: <Home size={20} />,
    path: "/dashboard",
  },
  {
    name: "Golf Courses",
    icon: <LandPlot size={20} />,
    path: "/dashboard/courses",
  },
  {
    name: "Bookings",
    icon: <Calendar size={20} />,
    path: "/dashboard/bookings",
  },
  {
    name: "Users",
    icon: <Users size={20} />,
    path: "/dashboard/users",
  },
  {
    name: "Analytics",
    icon: <BarChart size={20} />,
    path: "/dashboard/analytics",
  },
  {
    name: "Settings",
    icon: <Settings size={20} />,
    path: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button isIconOnly variant="light" onPress={toggleSidebar}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Card className="h-full rounded-none">
          <CardBody className="p-0 overflow-y-auto">
            {/* Logo/Brand */}
            <Link href="/dashboard" className="p-4 border-b">
              <h1 className="text-xl font-bold">Golf Admin</h1>
            </Link>

            {/* Menu Items */}
            <nav className="p-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                      transition-colors duration-200 cursor-pointer
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-default-100"
                      }
                    `}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </CardBody>
        </Card>
      </aside>
    </>
  );
}
