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
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchData } from "@/app/lib/api-placeholder-db";

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await fetchData("staff");
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleStaffSelect = (staffMember) => {
    setSelectedStaff(staffMember);
    onOpen();
  };

  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch =
      searchQuery === "" ||
      staffMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || staffMember.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "on leave":
        return "warning";
      case "terminated":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Staff Management</h1>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Staff Members</h2>
          <div className="flex gap-4">
            <Select
              placeholder="Filter by role"
              selectedKeys={roleFilter !== "all" ? [roleFilter] : []}
              onChange={(e) =>
                setRoleFilter(e.target.value === "" ? "all" : e.target.value)
              }
              className="w-40"
            >
              <SelectItem key="all" value="all">
                All Roles
              </SelectItem>
              <SelectItem key="caddie" value="caddie">
                Caddie
              </SelectItem>
              <SelectItem key="cart staff" value="cart staff">
                Cart Staff
              </SelectItem>
              <SelectItem key="manager" value="manager">
                Manager
              </SelectItem>
              <SelectItem key="admin" value="admin">
                Admin
              </SelectItem>
            </Select>
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              startContent={<Icon icon="mdi:search" />}
            />
            <Button color="primary">Add Staff Member</Button>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center p-4">Loading staff data...</div>
          ) : (
            <Table aria-label="Staff table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>PHONE</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>HIRE DATE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-medium">
                      {staffMember.name}
                    </TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.phone}</TableCell>
                    <TableCell>
                      <Chip variant="flat" color="primary">
                        {staffMember.role}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {new Date(staffMember.hireDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(staffMember.status)}
                        variant="flat"
                      >
                        {staffMember.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => handleStaffSelect(staffMember)}
                        >
                          View
                        </Button>
                        <Button size="sm" variant="light" color="primary">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Staff Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {selectedStaff && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Staff Member Details
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedStaff.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedStaff.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedStaff.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <Chip color="primary" variant="flat">
                      {selectedStaff.role}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hire Date</p>
                    <p className="font-medium">
                      {new Date(selectedStaff.hireDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Chip
                      color={getStatusColor(selectedStaff.status)}
                      variant="flat"
                    >
                      {selectedStaff.status}
                    </Chip>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{selectedStaff.address}</p>
                </div>

                {selectedStaff.role === "caddie" && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold">
                      Caddie Information
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Experience Level
                        </p>
                        <p className="font-medium">
                          {selectedStaff.experienceLevel}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-medium">{selectedStaff.rating}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Trips This Month
                        </p>
                        <p className="font-medium">
                          {selectedStaff.tripsThisMonth}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Earnings This Month
                        </p>
                        <p className="font-medium">
                          ${selectedStaff.earningsThisMonth}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p>{selectedStaff.notes || "No notes available"}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">Edit Details</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
