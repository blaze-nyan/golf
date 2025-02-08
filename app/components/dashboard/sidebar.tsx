// app/components/dashboard/Sidebar.tsx
"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import {
  Home,
  Calendar,
  Users,
  LandPlot,
  Settings,
  BarChart,
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

  return (
    <Card className="h-screen w-64 rounded-none">
      <CardBody className="p-0">
        {/* Logo/Brand */}
        <Link href="/dashboard" className="p-4 border-b">
          <h1 className="text-xl font-bold">Golf Admin</h1>
        </Link>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                    transition-colors duration-200
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
        </div>
      </CardBody>
    </Card>
  );
}
