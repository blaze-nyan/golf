// app/dashboard/page.tsx
"use client";
import { Card, CardBody } from "@heroui/react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 lg:mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Total Bookings</h2>
            <p className="text-2xl">123</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Active Courses</h2>
            <p className="text-2xl">8</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-2xl">456</p>
          </CardBody>
        </Card>
      </div>

      {/* More responsive content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {/* Add content */}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            {/* Add content */}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
