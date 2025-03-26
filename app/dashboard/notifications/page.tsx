"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchData } from "@/app/lib/api-placeholder-db";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notificationSettings, setNotificationSettings] = useState({
    bookingConfirmation: true,
    paymentConfirmation: true,
    paymentFailure: true,
    systemAlerts: true,
    bookingReminders: true,
    membershipRenewal: true,
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await fetchData("notifications");
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleSettingChange = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || notification.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "success";
      case "scheduled":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "booking":
        return <Icon icon="mdi:calendar-check" className="text-blue-500" />;
      case "payment":
        return <Icon icon="mdi:cash-register" className="text-green-500" />;
      case "system":
        return <Icon icon="mdi:alert-circle" className="text-red-500" />;
      case "membership":
        return <Icon icon="mdi:account-group" className="text-purple-500" />;
      default:
        return <Icon icon="mdi:bell" className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Notifications Management</h1>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Notification Settings</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Booking Confirmations</p>
                <p className="text-sm text-gray-500">
                  Send emails when bookings are confirmed
                </p>
              </div>
              <Switch
                isSelected={notificationSettings.bookingConfirmation}
                onValueChange={() => handleSettingChange("bookingConfirmation")}
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Payment Confirmations</p>
                <p className="text-sm text-gray-500">
                  Send receipts after payments
                </p>
              </div>
              <Switch
                isSelected={notificationSettings.paymentConfirmation}
                onValueChange={() => handleSettingChange("paymentConfirmation")}
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Payment Failures</p>
                <p className="text-sm text-gray-500">
                  Alert when payments fail
                </p>
              </div>
              <Switch
                isSelected={notificationSettings.paymentFailure}
                onValueChange={() => handleSettingChange("paymentFailure")}
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">System Alerts</p>
                <p className="text-sm text-gray-500">
                  Critical system notifications
                </p>
              </div>
              <Switch
                isSelected={notificationSettings.systemAlerts}
                onValueChange={() => handleSettingChange("systemAlerts")}
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Booking Reminders</p>
                <p className="text-sm text-gray-500">
                  Send reminders before tee time
                </p>
              </div>
              <Switch
                isSelected={notificationSettings.bookingReminders}
                onValueChange={() => handleSettingChange("bookingReminders")}
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Membership Renewals</p>
                <p className="text-sm text-gray-500">
                  Notify members before expiration
                </p>
              </div>
              <Switch
                isSelected={notificationSettings.membershipRenewal}
                onValueChange={() => handleSettingChange("membershipRenewal")}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notification History</h2>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "solid" : "bordered"}
                onPress={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "sent" ? "solid" : "bordered"}
                color="success"
                onPress={() => setStatusFilter("sent")}
                size="sm"
              >
                Sent
              </Button>
              <Button
                variant={statusFilter === "scheduled" ? "solid" : "bordered"}
                color="warning"
                onPress={() => setStatusFilter("scheduled")}
                size="sm"
              >
                Scheduled
              </Button>
              <Button
                variant={statusFilter === "failed" ? "solid" : "bordered"}
                color="danger"
                onPress={() => setStatusFilter("failed")}
                size="sm"
              >
                Failed
              </Button>
            </div>
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              startContent={<Icon icon="mdi:search" />}
            />
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center p-4">
              Loading notifications...
            </div>
          ) : (
            <Table aria-label="Notifications table">
              <TableHeader>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>RECIPIENT</TableColumn>
                <TableColumn>SENT DATE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notification.type)}
                        <span className="capitalize">{notification.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {notification.title}
                    </TableCell>
                    <TableCell>{notification.recipient}</TableCell>
                    <TableCell>
                      {new Date(notification.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(notification.status)}
                        variant="flat"
                      >
                        {notification.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<Icon icon="mdi:eye" />}
                        >
                          View
                        </Button>
                        {notification.status === "failed" && (
                          <Button
                            size="sm"
                            variant="light"
                            color="primary"
                            startContent={<Icon icon="mdi:refresh" />}
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
