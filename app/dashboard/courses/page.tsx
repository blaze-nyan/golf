"use client";
import { Card, CardBody } from "@heroui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Course A", bookings: 120 },
  { name: "Course B", bookings: 98 },
  { name: "Course D", bookings: 90 },
];

export default function GolfCoursesDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 lg:mb-6">Golf Courses Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Total Golf Courses</h2>
            <p className="text-2xl">12</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Total Bookings</h2>
            <p className="text-2xl">456</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Active Users</h2>
            <p className="text-2xl">1,234</p>
          </CardBody>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="mt-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">Bookings per Golf Course</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
