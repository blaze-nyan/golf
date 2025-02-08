// app/dashboard/page.tsx
"use client";
import { Card, CardBody } from "@heroui/react";

export default function page() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-2">Total Bookings</h2>
            <p className="text-2xl">123</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-2">Active Courses</h2>
            <p className="text-2xl">8</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-2xl">456</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
