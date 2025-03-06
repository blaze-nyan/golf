/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { decryptData } from "@/app/lib/dataEncrypt";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Image,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
} from "@heroui/react";
import { User, Edit2, Save, Upload } from "lucide-react";
import {
  getClientInfo,
  updateClientInfo,
  setClientImage,
  getClientImage,
} from "@/app/lib/api";

import { fetchData } from "@/app/lib/api-placeholder-db";

import {
  convertExcelDateToJSDate,
  convertMinutesToTimeWithAMPM,
  dateToString,
} from "@/app/components/date-functionalities";

import BookingModal from "@/app/components/booking-model";
import LogoutButton from "@/app/components/logout-button";
import Link from "next/link";
import MembershipInfoList from "@/app/components/memberships";
import AnimatedLoading from "@/app/components/animated-loading";

interface ProfileData {
  "Client ID": number;
  Title: string;
  "First Name": string;
  Surname: string;
  "Given Name": string;
  Company: string;
  Gender: string;
  "Communication List": Array<any>;
}

type Communication = {
  "Communication ID": number;
  "Communication Detail": string;
  Description: string;
  "Communication Type": string;
  Priority: string;
  "Record Marked Deleted": boolean;
  "Status List": any[];
};

export default function ProfilePage() {
  //decryptcliendId
  const params = useParams();
  const router = useRouter();
  /////
  const clientId_: any = params.clientId;

  if (!clientId_) {
    console.error("clientId_ is undefined");
    router.push("/auth/login");
  }
  const decodedClientId_ = decodeURIComponent(clientId_);
  console.log("Before decryption (Decoded clientId_):", decodedClientId_);

  const clientId = decryptData(decodedClientId_);
  console.log("After decryption (Decrypted clientId):", clientId);

  ///////////////////////////////////////////////////
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [bookingData, setBookingData] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const [message, setMessage] = useState("");

  const [phoneData, setPhoneData] = useState<Communication>({
    "Communication ID": 0,
    "Communication Detail": "No Phone Number Set",
    Description: "Telephone Number",
    "Communication Type": "C",
    Priority: "2",
    "Record Marked Deleted": false,
    "Status List": [],
  });
  const [emailData, setEmailData] = useState<Communication>({
    "Communication ID": 0,
    "Communication Detail": "No Email Set",
    Description: "Email",
    "Communication Type": "M",
    Priority: "5",
    "Record Marked Deleted": false,
    "Status List": [],
  });

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

  const getFirstContactInfo = (
    commList: Communication[],
    oldPhone: Communication,
    oldEmail: Communication
  ) => {
    let telephoneComm: Communication | undefined;
    let emailComm: Communication | undefined;

    for (const comm of commList) {
      if (!telephoneComm && comm["Communication Type"] === "C") {
        telephoneComm = comm;
      }
      if (!emailComm && comm["Communication Type"] === "M") {
        emailComm = comm;
      }
      if (telephoneComm && emailComm) break; // Stop searching if both are found
    }

    if (!telephoneComm) {
      telephoneComm = oldPhone;
    }

    if (!emailComm) {
      emailComm = oldEmail;
    }

    return { telephoneComm, emailComm };
  };

  const [isOpenBookings, setIsOpenBookings] = useState(false);

  useEffect(() => {
    // Only run this code on the client side
    if (typeof window !== "undefined") {
      const _clientId = window.localStorage.getItem("clientId");
      if (_clientId) {
        router.push(`/profile/${clientId_}`);
      } else {
        router.push("/auth/login");
      }
    }
  }, [router]);

  const openBookingModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsOpenBookings(true); // Open the booking modal
  };

  const closeBookingModal = () => {
    setIsOpenBookings(false); // Close the booking modal
  };

  const arrayBufferToBase64 = (buffer: string) => {
    return `data:image/jpeg;base64,${buffer}`;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[0-9]\d{8,14}$/; // E.164 format
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    // Only execute on the client side
    if (typeof window !== "undefined") {
      console.log(profileImage);
      window.localStorage.setItem("clientImage", profileImage);
    }
  }, [profileImage]);

  useEffect(() => {
    const fetchProfileAndImage = async () => {
      try {
        setIsLoading(true);

        if (!clientId_) {
          router.push("/auth/login");
          return;
        }
        // Fetch both profile and image data
        const [profileData, imageData] = await Promise.all([
          getClientInfo(clientId),

          getClientImage(clientId),
        ]);
        await console.log(
          "profileData=>",
          profileData,
          "parsedClientId=>",
          clientId
        );

        setProfileData(profileData); // This ensures profileData is set before it's used.

        if (imageData.success && imageData.imageInfo) {
          console.log("TEST");
          console.log(imageData.imageInfo);
          const base64Image = arrayBufferToBase64(imageData.imageInfo);
          setProfileImage(base64Image);
        }

        const result = getFirstContactInfo(
          profileData["Communication List"],
          phoneData,
          emailData
        );

        console.log(result.emailComm);
        if (result.emailComm !== null) {
          setEmailData(result.emailComm);
        }

        if (result.telephoneComm !== null) {
          setPhoneData(result.telephoneComm);
        }

        const bookings = await fetchData("bookings");
        const filteredBookings = bookings.filter(
          (booking: { clientID: any }) => booking.clientID === clientId
        );

        setBookingData(filteredBookings);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileAndImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.clientId, router]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const refetchBookings = async () => {
    await sleep(1000);
    const bookings = await fetchData("bookings");
    const filteredBookings = bookings.filter(
      (booking: { clientID: any }) => booking.clientID === clientId
    );
    closeBookingModal();
    setBookingData(filteredBookings);
  };

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
      if (!clientId_) return;

      // Fetch updated profile and image data
      const [updatedProfileData, updatedImageData] = await Promise.all([
        getClientInfo(clientId), // Fetch updated profile data
        getClientImage(clientId), // Fetch updated image data
      ]);

      setProfileData(updatedProfileData); // Update profile data

      if (updatedImageData.success && updatedImageData.imageInfo) {
        const base64Image = arrayBufferToBase64(updatedImageData.imageInfo); // Convert to base64
        console.log(base64Image);
        setProfileImage(base64Image); // Update the profile image state
      }

      setMessage("Profile picture updated successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear after 3s
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

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;

    setEmailData((prev: any) => ({
      ...prev,
      "Communication Detail": newEmail,
    }));
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = event.target.value;

    setPhoneData((prev: any) => ({
      ...prev,
      "Communication Detail": newPhone,
    }));
  };

  useEffect(() => {
    if (profileData) {
      if (phoneData) {
        if (isValidPhoneNumber(phoneData["Communication Detail"])) {
          // If the phone number is valid, update the Communication List with the phone data
          setProfileData((prev: any) => ({
            ...prev,
            "Communication List": [
              ...prev["Communication List"].filter(
                (comm: any) => comm["Communication Type"] !== "C"
              ), // Remove existing phone
              phoneData, // Add the updated phone data
            ],
          }));
        } else {
          // If the phone number is invalid, remove the phone data from the Communication List
          setProfileData((prev: any) => ({
            ...prev,
            "Communication List": prev["Communication List"].filter(
              (comm: any) => comm["Communication Type"] !== "C"
            ), // Remove phone data
          }));
        }
      }

      if (emailData) {
        if (isValidEmail(emailData["Communication Detail"])) {
          // If the email is valid, update the Communication List with the email data
          setProfileData((prev: any) => ({
            ...prev,
            "Communication List": [
              ...prev["Communication List"].filter(
                (comm: any) => comm["Communication Type"] !== "M"
              ), // Remove existing email
              emailData, // Add the updated email data
            ],
          }));
        } else {
          // If the email is invalid, remove the email data from the Communication List
          setProfileData((prev: any) => ({
            ...prev,
            "Communication List": prev["Communication List"].filter(
              (comm: any) => comm["Communication Type"] !== "M"
            ), // Remove email data
          }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneData, emailData]);

  const handleSave = async () => {
    if (!profileData) return;
    try {
      await updateClientInfo(profileData);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear after 3s
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <AnimatedLoading />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-800 dark:text-gray-200">
          Failed to load profile
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 transition-colors duration-200">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1 p-4 sm:p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardBody className="items-center gap-4 text-center">
            <div className="relative inline-block">
              <Avatar
                className="h-24 w-24 sm:h-32 sm:w-32 text-large"
                src={profileImage ? `${profileImage}` : undefined}
                icon={<User size={40} />}
              />
              <Button
                isIconOnly
                size="sm"
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onPress={onOpen}
              >
                <Upload size={16} />
              </Button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {profileData["Title"]} {profileData["First Name"]}{" "}
                {profileData["Surname"]}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {profileData["Given Name"]}
              </p>

              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong className="text-gray-600 dark:text-gray-300">
                    Company:
                  </strong>{" "}
                  {profileData["Company"] || "Not specified"}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Profile Details Card */}
        <Card className="md:col-span-2 p-4 sm:p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex justify-between items-center px-1 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Profile Details
            </h3>
            <Button
              color={isEditing ? "success" : "primary"}
              variant="flat"
              startContent={
                isEditing ? <Save size={18} /> : <Edit2 size={18} />
              }
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={
                isEditing
                  ? "bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-400"
                  : ""
              }
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {isEditing ? (
                <Select
                  label="Title"
                  defaultSelectedKeys={[profileData["Title"]]}
                  onChange={handleInputChange("Title")}
                >
                  {titles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                <p className=" bg-default-50 text-default-700 px-3 py-2 rounded-md flex flex-col justify-center text-sm">
                  <span>Title</span>
                  {profileData["Title"] || "N/A"}
                </p>
              )}
              {isEditing ? (
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
              ) : (
                <p className=" bg-default-50 text-default-700 px-3 py-2 rounded-md flex flex-col justify-center text-sm">
                  <span>Gender</span>
                  {profileData["Gender"] || "N/A"}
                </p>
              )}

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

              <div>
                <Input
                  label="Email"
                  defaultValue={emailData["Communication Detail"]}
                  isReadOnly={!isEditing}
                  onChange={handleEmailChange}
                />
                {!isValidEmail(emailData["Communication Detail"]) &&
                  isEditing && (
                    <div className="text-gray-500 dark:text-gray-400 text-sm px-3 pt-1">
                      Invalid email will not be saved.
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Phone Number"
                  defaultValue={phoneData["Communication Detail"]}
                  isReadOnly={!isEditing}
                  onChange={handlePhoneChange}
                />
                {!isValidPhoneNumber(phoneData["Communication Detail"]) &&
                  isEditing && (
                    <div className="text-gray-500 dark:text-gray-400 text-sm px-3 pt-1">
                      Invalid phone number will not be saved.
                    </div>
                  )}
              </div>

              {message && (
                <div className="bg-green-500 text-white p-2 rounded col-span-2">
                  {message}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        <Card className="md:col-span-3 p-4 sm:p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="px-1 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Bookings
            </h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto w-full">
              {/* Header Row */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow-sm">
                <div className="text-xs sm:text-sm">Course Name</div>
                <div className="text-xs sm:text-sm hidden md:block">
                  Location
                </div>
                <div className="text-xs sm:text-sm">Date</div>
                <div className="text-xs sm:text-sm">Time</div>
                <div className="text-xs sm:text-sm hidden md:block">
                  Golfers
                </div>
                <div className="text-xs sm:text-sm hidden md:block">Status</div>
              </div>

              {/* Booking Data Rows or No Data Message */}
              {bookingData.length === 0 ? (
                <>
                  <div className="text-center text-gray-500 dark:text-gray-400 py-5">
                    No Booking Available
                  </div>
                  <div className="text-center">
                    <Button
                      as={Link}
                      href="/golfcourse"
                      color="primary"
                      className="mt-2"
                    >
                      Go to Golf Courses
                    </Button>
                  </div>
                </>
              ) : (
                bookingData.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="grid grid-cols-3 md:grid-cols-6 gap-4 p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors duration-300 rounded-lg"
                    onClick={() => openBookingModal(booking)}
                  >
                    <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 truncate">
                      {booking.courseName}
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 md:block hidden truncate">
                      {booking.courseLocation.length > 50
                        ? `${booking.courseLocation.substring(0, 50)}...`
                        : booking.courseLocation}
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {dateToString(convertExcelDateToJSDate(booking.teeDate))}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {convertMinutesToTimeWithAMPM(booking.teeTime)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden md:block">
                      {booking.numberOfGolfers}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden md:block">
                      {booking.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        <MembershipInfoList membershipsList={[]}></MembershipInfoList>

        {/* Additional Info Card */}
        <Card className="md:col-span-3 p-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="px-1 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Account Information
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  Member Since
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  February 2024
                </p>
              </div>
              <div>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  Last Login
                </p>
                <p className="text-gray-800 dark:text-gray-200">Today</p>
              </div>
              <div>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="md:col-span-3 mt-2">
          <LogoutButton />
        </div>

        {/* Use the BookingModal component */}
        <BookingModal
          isOpen={isOpenBookings}
          onClose={closeBookingModal}
          booking={selectedBooking}
          forceReload={refetchBookings}
        />

        {/* Image Upload Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent className="bg-white dark:bg-gray-800">
            <ModalHeader className="text-gray-800 dark:text-gray-100">
              Upload Profile Picture
            </ModalHeader>
            <ModalBody>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {previewUrl && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={500}
                    height={500}
                    className="max-h-48 rounded object-cover border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleImageUpload}
                isLoading={isUploading}
                className="bg-green-600 dark:bg-green-700 text-white"
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
