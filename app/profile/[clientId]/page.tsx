// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Avatar,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { User, Edit2, Save, Upload } from "lucide-react";
import {
  getClientInfo,
  updateClientInfo,
  setClientImage,
  getClientImage,
} from "@/app/lib/api";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchData } from "@/app/lib/api-placeholder-db";

interface ProfileData {
  "Client ID": number;
  Title: string;
  "First Name": string;
  Surname: string;
  "Given Name": string;
  Company: string;
  Gender: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();  
  const [isOpenBookings, setIsOpenBookings] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<[] | null>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const titles = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
  const genders = [
    {
      value: "U",
      label: "Unspecified",
    },
    {
      value: "M",
      label: "Male",
    },
    {
      value: "F",
      label: "Female",
    },
  ];


  const toggleCollapseBookings = () => {
    setIsOpenBookings(!isOpenBookings);
  };
  const arrayBufferToBase64 = (buffer: string) => {
    return `data:image/jpeg;base64,${buffer}`;
  };

  useEffect(() => {
    const fetchProfileAndImage = async () => {
      try {
        setIsLoading(true);
        const clientId = params.clientId;

        if (!clientId) {
          router.push("/auth/login");
          return;
        }

        const parsedClientId = parseInt(clientId as string);
        if (isNaN(parsedClientId)) {
          throw new Error("Invalid client ID");
        }

        // Fetch both profile and image data
        const [profileData, imageData] = await Promise.all([
          getClientInfo(parsedClientId),
          getClientImage(parsedClientId),
        ]);

        setProfileData(profileData); // This ensures profileData is set before it's used.

        if (imageData.success && imageData.imageInfo) {
          const base64Image = arrayBufferToBase64(imageData.imageInfo);
          setProfileImage(base64Image);
        }
        
        const bookings = await fetchData("bookings");
        bookings.filter(booking => booking.clientID === clientID)

      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
      };
    fetchProfileAndImage();
  }, [params.clientId, router]);

  const handleImageUpload = async () => {
    if (!selectedFile || !profileData) return; // Ensure profileData is present before using it

    try {
      setIsUploading(true);

      // First, get the image UID
      const imageResponse = await setClientImage(profileData["Client ID"]);

      if (imageResponse.imageUID) {
        // Then upload the binary data
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("imageUID", imageResponse.imageUID);

        await axios.post("/api/profile/image/binary", formData);
      }

      onClose();

      // After uploading the image, refetch the profile and image data
      const clientId = params.clientId;
      if (!clientId) return;
      const parsedClientId = parseInt(clientId as string);
      if (isNaN(parsedClientId)) return;

      // Fetch updated profile and image data
      const [updatedProfileData, updatedImageData] = await Promise.all([
        getClientInfo(parsedClientId), // Fetch updated profile data
        getClientImage(parsedClientId), // Fetch updated image data
      ]);

      setProfileData(updatedProfileData); // Update profile data

      if (updatedImageData.success && updatedImageData.imageInfo) {
        const base64Image = arrayBufferToBase64(updatedImageData.imageInfo); // Convert to base64
        setProfileImage(base64Image); // Update the profile image state
      }
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    } finally {
      setIsUploading(false); // Stop the uploading state
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange =
    (field: keyof ProfileData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (profileData) {
        setProfileData({
          ...profileData,
          [field]: e.target.value,
        });
      }
    };

  const handleSave = async () => {
    if (!profileData) return;

    try {
      await updateClientInfo(profileData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1 p-5">
          <CardBody className="items-center gap-4 text-center">
            <Avatar
              className="h-32 w-32 text-large"
              src={
                profileImage ? `${profileImage}` : undefined
              }
              icon={<User size={40} />}
            />
            <Button
              isIconOnly
              size="sm"
              className="absolute bottom-0 right-0"
              onPress={onOpen}
            >
              <Upload size={16} />
            </Button><div>
              <h2 className="text-xl font-semibold">
              {profileData["Title"]} {profileData["First Name"]} {profileData["Surname"]}
              </h2>
              <p className="text-default-500">{profileData["Given Name"]}</p>

              <div className="mt-4">
                <p className="text-sm text-default-400">
                  <strong>Company:</strong> {profileData["Company"]}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Profile Details Card */}
        <Card className="md:col-span-2 p-5">
          <CardHeader className="flex justify-between">
            <h3 className="text-lg font-semibold">Profile Details</h3>
            <Button
              color={isEditing ? "success" : "primary"}
              variant="flat"
              startContent={
                isEditing ? <Save size={18} /> : <Edit2 size={18} />
              }
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Title"
                defaultSelectedKeys={[profileData["Title"]]}
                disabled={!isEditing}
                onChange={handleInputChange("Title")}
              >
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Gender"
                defaultSelectedKeys={[profileData["Gender"]]}
                disabled={!isEditing}
                onChange={handleInputChange("Gender")}
              >
                {genders.map((gender) => (
                  <SelectItem key={gender.value} value={gender.value}>
                    {gender.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="First Name"
                defaultValue={profileData["First Name"]}
                isReadOnly={!isEditing}
                onChange={handleInputChange("First Name")}
              />

              <Input
                label="Surname"
                defaultValue={profileData["Surname"]}
                isReadOnly={!isEditing}
                onChange={handleInputChange("Surname")}
              />

              <Input
                label="Given Name"
                defaultValue={profileData["Given Name"]}
                isReadOnly={!isEditing}
                onChange={handleInputChange("Given Name")}
              />

              <Input
                label="Company"
                defaultValue={profileData["Company"]}
                isReadOnly={!isEditing}
                onChange={handleInputChange("Company")}
              />
            </div>
          </CardBody>
        </Card>

        <Card className="md:col-span-3 p-5 py-3">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Golf Bookings</h3>
            <Button variant="flat" onPress={toggleCollapseBookings} size="sm">
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CardHeader>
          {isOpenBookings && (
            <CardBody>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-small text-default-500">Member Since</p>
                  <p>January 2024</p>
                </div>
                <div>
                  <p className="text-small text-default-500">Last Login</p>
                  <p>Today</p>
                </div>
                <div>
                  <p className="text-small text-default-500">Status</p>
                  <p className="text-success">Active</p>
                </div>
              </div>
            </CardBody>
          )}
        </Card>

        {/* Additional Info Card */}
        <Card className="md:col-span-3 p-5 py-3">
          <CardHeader>
            <h3 className="text-lg font-semibold">Account Information</h3>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-small text-default-500">Member Since</p>
                <p>January 2024</p>
              </div>
              <div>
                <p className="text-small text-default-500">Last Login</p>
                <p>Today</p>
              </div>
              <div>
                <p className="text-small text-default-500">Status</p>
                <p className="text-success">Active</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Upload Profile Picture</ModalHeader>
            <ModalBody>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {previewUrl && (
                <div className="mt-4">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={500}
                    height={500}
                    className="max-h-48 rounded object-cover"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleImageUpload}
                isLoading={isUploading}
              >
                Upload
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
