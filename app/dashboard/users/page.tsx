"use client";
import { Card, CardBody } from "@heroui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 250 },
  { month: "Apr", users: 300 },
  { month: "May", users: 350 },
];

export default function DashboardUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 lg:mb-6">Users Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-2xl">1,540</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Active Users</h2>
            <p className="text-2xl">1,120</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">New Users This Month</h2>
            <p className="text-2xl">320</p>
          </CardBody>
        </Card>
      </div>

      {/* User Growth Chart */}
      <div className="mt-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">User Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
