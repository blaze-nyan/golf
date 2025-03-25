"use client";
import { Card, CardBody } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "Feb 1", bookings: 50 },
  { date: "Feb 2", bookings: 70 },
  { date: "Feb 3", bookings: 65 },
  { date: "Feb 4", bookings: 80 },
  { date: "Feb 5", bookings: 90 },
];

export default function DashboardBookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 lg:mb-6">Bookings Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Total Bookings</h2>
            <p className="text-2xl">1,234</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Upcoming Bookings</h2>
            <p className="text-2xl">256</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-2">Completed Bookings</h2>
            <p className="text-2xl">978</p>
          </CardBody>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="mt-6">
        <Card>
          <CardBody className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">Bookings Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
