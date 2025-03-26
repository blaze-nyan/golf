"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Icon } from "@iconify/react";

export default function RevenueDashboardPage() {
  const [timeRange, setTimeRange] = useState("week");

  // Define consistent colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Sample data with consistent structure
  const revenueData = {
    day: [
      { name: "12 AM", total: 400 },
      { name: "4 AM", total: 300 },
      { name: "8 AM", total: 1000 },
      { name: "12 PM", total: 5800 },
      { name: "4 PM", total: 3800 },
      { name: "8 PM", total: 1200 },
    ],
    week: [
      { name: "Mon", total: 4000 },
      { name: "Tue", total: 3000 },
      { name: "Wed", total: 5000 },
      { name: "Thu", total: 2780 },
      { name: "Fri", total: 7890 },
      { name: "Sat", total: 8390 },
      { name: "Sun", total: 6490 },
    ],
    month: [
      { name: "Week 1", total: 18000 },
      { name: "Week 2", total: 20000 },
      { name: "Week 3", total: 23000 },
      { name: "Week 4", total: 29000 },
    ],
  };

  const bookingsData = {
    day: [
      { name: "12 AM", value: 0 },
      { name: "4 AM", value: 0 },
      { name: "8 AM", value: 12 },
      { name: "12 PM", value: 35 },
      { name: "4 PM", value: 25 },
      { name: "8 PM", value: 8 },
    ],
    week: [
      { name: "Mon", value: 20 },
      { name: "Tue", value: 15 },
      { name: "Wed", value: 25 },
      { name: "Thu", value: 18 },
      { name: "Fri", value: 30 },
      { name: "Sat", value: 42 },
      { name: "Sun", value: 32 },
    ],
    month: [
      { name: "Week 1", value: 90 },
      { name: "Week 2", value: 110 },
      { name: "Week 3", value: 125 },
      { name: "Week 4", value: 145 },
    ],
  };

  const revenueBySourceData = [
    { name: "Green Fees", value: 65000 },
    { name: "Memberships", value: 45000 },
    { name: "Cart Rental", value: 15000 },
    { name: "Pro Shop", value: 8000 },
    { name: "Food & Beverage", value: 12000 },
  ];

  const popularTimeSlots = [
    { name: "8:00 AM", value: 85 },
    { name: "9:00 AM", value: 95 },
    { name: "10:00 AM", value: 100 },
    { name: "11:00 AM", value: 80 },
    { name: "12:00 PM", value: 70 },
    { name: "1:00 PM", value: 60 },
    { name: "2:00 PM", value: 55 },
    { name: "3:00 PM", value: 65 },
    { name: "4:00 PM", value: 75 },
  ];

  // Get the appropriate data based on the selected time range
  const currentRevenueData = revenueData[timeRange];
  const currentBookingsData = bookingsData[timeRange];

  // Calculate some summary statistics
  const totalRevenue = currentRevenueData.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const totalBookings = currentBookingsData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const averageRevenuePerBooking =
    totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Revenue Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === "day" ? "solid" : "bordered"}
            onPress={() => setTimeRange("day")}
            size="sm"
          >
            Day
          </Button>
          <Button
            variant={timeRange === "week" ? "solid" : "bordered"}
            onPress={() => setTimeRange("week")}
            size="sm"
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "solid" : "bordered"}
            onPress={() => setTimeRange("month")}
            size="sm"
          >
            Month
          </Button>
          <Select className="w-40 ml-2" placeholder="Export">
            <SelectItem key="pdf" value="pdf">
              Export as PDF
            </SelectItem>
            <SelectItem key="csv" value="csv">
              Export as CSV
            </SelectItem>
            <SelectItem key="excel" value="excel">
              Export as Excel
            </SelectItem>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <div className="p-2 bg-blue-100 rounded-full">
                <Icon icon="mdi:money" className="text-blue-600 text-xl" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-500 mt-2 flex items-center">
              <Icon icon="mdi:arrow-up" /> 8.2% from previous {timeRange}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <div className="p-2 bg-green-100 rounded-full">
                <Icon
                  icon="mdi:calendar-check"
                  className="text-green-600 text-xl"
                />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{totalBookings}</p>
            <p className="text-xs text-green-500 mt-2 flex items-center">
              <Icon icon="mdi:arrow-up" /> 12.5% from previous {timeRange}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Revenue per Booking</p>
              <div className="p-2 bg-purple-100 rounded-full">
                <Icon
                  icon="mdi:chart-line"
                  className="text-purple-600 text-xl"
                />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">
              ${averageRevenuePerBooking}
            </p>
            <p className="text-xs text-red-500 mt-2 flex items-center">
              <Icon icon="mdi:arrow-down" /> 3.1% from previous {timeRange}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Active Members</p>
              <div className="p-2 bg-orange-100 rounded-full">
                <Icon
                  icon="mdi:account-group"
                  className="text-orange-600 text-xl"
                />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">187</p>
            <p className="text-xs text-green-500 mt-2 flex items-center">
              <Icon icon="mdi:arrow-up" /> 5.3% from previous month
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Revenue Over Time</h3>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentRevenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      "$" + value.toLocaleString(),
                      "Revenue",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Bookings Over Time</h3>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentBookingsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Bookings" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Revenue by Source</h3>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBySourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {revenueBySourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      "$" + value.toLocaleString(),
                      "Revenue",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Popular Time Slots</h3>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={popularTimeSlots}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Popularity Score"
                    stroke="#ff7300"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
