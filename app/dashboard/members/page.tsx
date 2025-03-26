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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchData } from "@/app/lib/api-placeholder-db";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  membershipType: string;
  status: string;
  joinDate: string;
  expiryDate: string;
  notes?: string;
  recentBookings?: {
    courseName: string;
    date: string;
  }[];
}

// Mock data for development/hackathon
const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (123) 456-7890",
    membershipId: "MEM001",
    membershipType: "Gold",
    status: "active",
    joinDate: "2023-01-15",
    expiryDate: "2024-01-15",
    notes: "Prefers early morning tee times.",
    recentBookings: [
      {
        courseName: "East Course",
        date: "2023-11-22",
      },
      {
        courseName: "West Course",
        date: "2023-11-10",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (234) 567-8901",
    membershipId: "MEM002",
    membershipType: "Silver",
    status: "pending",
    joinDate: "2023-02-20",
    expiryDate: "2024-02-20",
    notes: "New member, needs orientation.",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (345) 678-9012",
    membershipId: "MEM003",
    membershipType: "Platinum",
    status: "active",
    joinDate: "2022-05-10",
    expiryDate: "2023-05-10",
    notes: "VIP member, prefers premium services.",
    recentBookings: [
      {
        courseName: "North Course",
        date: "2023-11-18",
      },
    ],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (456) 789-0123",
    membershipId: "MEM004",
    membershipType: "Bronze",
    status: "expired",
    joinDate: "2022-08-15",
    expiryDate: "2023-08-15",
    notes: "Renewal pending payment.",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    phone: "+1 (567) 890-1234",
    membershipId: "MEM005",
    membershipType: "Gold",
    status: "active",
    joinDate: "2023-03-05",
    expiryDate: "2024-03-05",
    recentBookings: [
      {
        courseName: "East Course",
        date: "2023-11-15",
      },
      {
        courseName: "South Course",
        date: "2023-11-03",
      },
    ],
  },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // First try to fetch from API
        const data = await fetchData("members");
        setMembers(data);
      } catch (error) {
        console.error(
          "Error fetching members from API, using mock data:",
          error
        );
        // Fall back to mock data if API fails
        setMembers(MOCK_MEMBERS);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    onOpen();
  };

  // Only filter if members is defined and not empty
  const filteredMembers =
    members?.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.membershipId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const getStatusColor = (
    status: string
  ): "success" | "danger" | "warning" | "default" => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Membership Management</h1>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Members</h2>
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
                variant={statusFilter === "active" ? "solid" : "bordered"}
                color="success"
                onPress={() => setStatusFilter("active")}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "pending" ? "solid" : "bordered"}
                color="warning"
                onPress={() => setStatusFilter("pending")}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "expired" ? "solid" : "bordered"}
                color="danger"
                onPress={() => setStatusFilter("expired")}
                size="sm"
              >
                Expired
              </Button>
            </div>
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              startContent={<Icon icon="mdi:search" />}
            />
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center p-4">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center p-4">
              No members found. Please adjust your search or filters.
            </div>
          ) : (
            <Table aria-label="Members table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>MEMBERSHIP ID</TableColumn>
                <TableColumn>MEMBERSHIP TYPE</TableColumn>
                <TableColumn>JOIN DATE</TableColumn>
                <TableColumn>EXPIRY DATE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.membershipId}</TableCell>
                    <TableCell>{member.membershipType}</TableCell>
                    <TableCell>
                      {new Date(member.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(member.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(member.status)}
                        variant="flat"
                      >
                        {member.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => handleMemberSelect(member)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Member Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {selectedMember && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Member Details
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedMember.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membership ID</p>
                    <p className="font-medium">{selectedMember.membershipId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membership Type</p>
                    <p className="font-medium">
                      {selectedMember.membershipType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Chip
                      color={getStatusColor(selectedMember.status)}
                      variant="flat"
                    >
                      {selectedMember.status}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="font-medium">
                      {new Date(selectedMember.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium">
                      {new Date(selectedMember.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p>{selectedMember.notes || "No notes available"}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-md font-semibold">Recent Bookings</h3>
                  {selectedMember.recentBookings &&
                  selectedMember.recentBookings.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {selectedMember.recentBookings.map((booking, index) => (
                        <li key={index} className="p-2 border rounded-md">
                          <p className="font-medium">{booking.courseName}</p>
                          <p className="text-sm text-gray-500">
                            Date: {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No recent bookings
                    </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">Edit Membership</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
