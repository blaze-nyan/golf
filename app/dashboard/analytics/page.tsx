"use client";
import { Card, CardBody } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Example revenue data
const data = [
  { date: "Feb 1", revenue: 2000 },
  { date: "Feb 2", revenue: 2500 },
  { date: "Feb 3", revenue: 2200 },
  { date: "Feb 4", revenue: 2700 },
  { date: "Feb 5", revenue: 3000 },
];

export default function DashboardRevenuePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 lg:mb-6">Revenue Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Total Revenue Card */}
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <p className="text-2xl">12,345 THB</p>
          </CardBody>
        </Card>

        {/* Daily Revenue Card */}
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Daily Revenue</h2>
            <p className="text-2xl">1,234 THB</p>
          </CardBody>
        </Card>

        {/* Projected Revenue Card */}
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Projected Revenue</h2>
            <p className="text-2xl">15,000 THB</p>
          </CardBody>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="mt-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}