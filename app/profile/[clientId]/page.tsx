/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { addToast } from "@heroui/toast";
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
import { logger } from "@/app/lib/logger";
import { useLanguage } from "@/app/contexts/LanguageContext";

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
  "Client Code": string;
  Title: string;
  "First Name": string;
  Surname: string;
  "Given Name": string;
  Company: string;
  Gender: string;
  "Birth Date": number;
  Language: string;
  Nationality: string;
  "Passport Number": string;
  "ID Number": string;
  "Passport or ID": string;
  Designation: string;
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
  const { t } = useLanguage();
  //decryptcliendId
  const params = useParams();
  const router = useRouter();
  /////
  const clientId_: any = params.clientId;

  if (!clientId_) {
    logger.error("clientId_ is undefined");
    router.push("/auth/login");
  }
  const decodedClientId_ = decodeURIComponent(clientId_);
  logger.log("Before decryption (Decoded clientId_):", decodedClientId_);

  const clientId = decryptData(decodedClientId_);
  logger.log("After decryption (Decrypted clientId):", clientId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  // Email verification states
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0); // For resend button countdown

  const [phoneData, setPhoneData] = useState<Communication>({
    "Communication ID": 0,
    "Communication Detail": t("noPhoneSet"),
    Description: t("telephoneNumber"),
    "Communication Type": "C",
    Priority: "2",
    "Record Marked Deleted": false,
    "Status List": [],
  });
  const [emailData, setEmailData] = useState<Communication>({
    "Communication ID": 0,
    "Communication Detail": t("noEmailSet"),
    Description: t("email"),
    "Communication Type": "M",
    Priority: "5",
    "Record Marked Deleted": false,
    "Status List": [],
  });

  const titles = [t("mr"), t("mrs"), t("ms"), t("dr"), t("prof")];
  const genders = [
    {
      value: "U",
      label: t("unspecified"),
    },
    {
      value: "M",
      label: t("male"),
    },
    {
      value: "F",
      label: t("female"),
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

  // Format countdown time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    // Only run this code on the client side
    if (typeof window !== "undefined") {
      logger.log("=== PROFILE PAGE DEBUG ===");
      logger.log("URL clientId:", clientId_);
      logger.log("Decoded clientId_:", decodedClientId_);
      logger.log("Decrypted clientId:", clientId);
      logger.log("localStorage clientId:", localStorage.getItem("clientId"));
      logger.log(
        "sessionStorage clientId:",
        sessionStorage.getItem("clientId")
      );

      // Get clientId from either storage
      const getStoredClientId = () => {
        const sessionId = window.sessionStorage.getItem("clientId");
        if (sessionId) return sessionId;

        const localId = window.localStorage.getItem("clientId");
        if (localId) return localId;

        return null;
      };

      const storedClientId = getStoredClientId();

      // If we can't find a client ID in storage, redirect to login
      if (!storedClientId) {
        logger.log("No client ID found in storage, redirecting to login");
        router.push("/auth/login");
        return;
      }

      // If the decrypted ID doesn't match what's in storage, redirect to login
      if (clientId.toString() !== storedClientId) {
        logger.log("Client ID mismatch, redirecting to login");
        logger.log("Decrypted:", clientId.toString());
        logger.log("Stored:", storedClientId);
        router.push("/auth/login");
        return;
      }
    }
  }, []);

  // Countdown timer effect for resend button
  useEffect(() => {
    if (countdownTime <= 0) return;

    const timer = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownTime]);

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

  const toastShownRef = useRef(false); // Track if toast is shown
  const toastPhoneShowRef = useRef(false);

  useEffect(() => {
    // Only execute on the client side
    if (typeof window !== "undefined") {
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
        await logger.log(
          "profileData=>",
          profileData,
          "parsedClientId=>",
          clientId
        );

        setProfileData(profileData); // This ensures profileData is set before it's used.

        if (imageData.success && imageData.imageInfo) {
          const base64Image = arrayBufferToBase64(imageData.imageInfo);
          setProfileImage(base64Image);
        }

        const result = getFirstContactInfo(
          profileData["Communication List"],
          phoneData,
          emailData
        );

        if (result.emailComm !== null) {
          setEmailData(result.emailComm);
          setOriginalEmail(result.emailComm["Communication Detail"]);
        }

        if (result.telephoneComm !== null) {
          setPhoneData(result.telephoneComm);
        }

        const bookings = await fetchData("bookings");
        const filteredBookings = bookings.filter(
          (booking: { clientID: any }) => booking.clientID === String(clientId)
        );

        setBookingData(filteredBookings);
      } catch (err) {
        setError(t("failedToLoadProfile"));
        logger.error("Error:", err);
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
      (booking: { clientID: any }) =>
        String(booking.clientID) === String(clientId)
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
        setProfileImage(base64Image); // Update the profile image state
      }

      // Clear after 3s
    } catch (err) {
      setError(t("failedToUploadImage"));
      logger.error(err);
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
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.post("/api/check-email-exists", { email });
      return response.data.exists;
    } catch (err) {
      logger.error("Error checking if email exists:", err);
      return false; // Assume email doesn't exist if there's an error
    }
  };

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const enteredEmail = event.target.value;

    // If email is different from original, store it as newEmail
    if (enteredEmail !== originalEmail) {
      setNewEmail(enteredEmail);
    } else {
      setNewEmail(null);
    }

    // Update the display value
    setEmailData((prev: any) => ({
      ...prev,
      "Communication Detail": enteredEmail,
    }));

    if (
      !isValidEmail(enteredEmail) &&
      isEditing &&
      !toastShownRef.current // Ensure it's not shown before
    ) {
      addToast({
        title: t("invalidEmailNotSaved"),
        color: "danger",
        timeout: 5000, // Ensure toast stays visible long enough
      });
      toastShownRef.current = true; // Prevent future toasts
    }
  };
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = event.target.value;

    setPhoneData((prev: any) => ({
      ...prev,
      "Communication Detail": newPhone,
    }));

    if (
      !isValidPhoneNumber(phoneData["Communication Detail"]) &&
      isEditing &&
      !toastPhoneShowRef.current // Ensure it's not shown before
    ) {
      addToast({
        title: t("invalidPhoneNotSaved"),
        color: "danger",
      });
      toastPhoneShowRef.current = true; // Prevent future toasts
    }
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

      // Only update email in the Communication List if we're not in the process of verification
      // and the email hasn't changed, or if we're not in edit mode
      if (emailData && (!newEmail || !isEditing)) {
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
  }, [phoneData, emailData, isEditing]);

  // Handle save
  const handleSave = async () => {
    if (!profileData) return;

    // Start loading state at the beginning of the save process
    setIsSaving(true);

    try {
      // Check if email has changed and is valid
      if (newEmail && isValidEmail(newEmail) && newEmail !== originalEmail) {
        // Check if email already exists - now with loading state shown
        const emailExists = await checkEmailExists(newEmail);

        if (emailExists) {
          // Create a complete message
          const message = `${t("emailBelongsToAnotherAccount")}: ${newEmail}`;

          // Show toast but don't exit loading state yet
          addToast({
            title: t("emailAlreadyExistsProfile"),
            description: message,
            color: "danger",
            timeout: 5000,
          });

          // End loading state and return
          setIsSaving(false);
          return;
        }

        // Email is valid and not already in use, proceed with verification
        try {
          // No need to set isSaving to true again since it's already true

          // Send verification code to the new email
          const response = await axios.post("/api/verify-email", {
            email: newEmail,
          });

          if (response.data.success) {
            // If in development mode, you might have access to the OTP
            if (response.data.otp) {
              logger.log(
                "DEV MODE - Email verification code:",
                response.data.otp
              );
            }

            // Start countdown for resend button (2 minutes)
            setCountdownTime(120);

            // Open verification modal
            setIsVerificationModalOpen(true);
            setVerificationCode("");
            setVerificationError("");

            // Show toast notification
            addToast({
              title: t("verificationCodeSent"),
              description: t("pleaseCheckYourNewEmail"),
              color: "success",
              timeout: 5000,
            });
          } else {
            setError(t("failedToSendVerificationCode"));
            addToast({
              title: t("failedToSendVerificationCode"),
              color: "danger",
              timeout: 5000,
            });
          }
        } catch (err) {
          logger.error("Error sending verification email:", err);
          setError(t("failedToSendVerificationCode"));
          addToast({
            title: t("failedToSendVerificationCode"),
            color: "danger",
            timeout: 5000,
          });
        } finally {
          setIsSaving(false);
        }
        return;
      }

      // If email hasn't changed or isn't valid, proceed with normal save
      // No need to set isSaving(true) again as it's already true
      await proceedWithSave();
    } catch (error) {
      // Handle any unexpected errors
      logger.error("Error during save process:", error);
      setError(t("errorSavingProfile"));
      addToast({
        title: t("errorSavingProfile"),
        description: t("profileUpdateFailed"),
        color: "danger",
        timeout: 5000,
      });
    } finally {
      // Ensure we reset loading state if we exit early
      setIsSaving(false);
    }
  };

  // Function for the actual saving of profile data
  const proceedWithSave = async () => {
    if (!profileData) return;

    // Don't set isSaving(true) here since it's already set in handleSave
    try {
      await updateClientInfo(profileData);
      setIsEditing(false);

      // Clear email verification state
      setNewEmail(null);

      // Show success toast notification with action to ensure it appears
      addToast({
        title: t("profileUpdatedSuccess"),
        description: t("profileSavedSuccessfully"),
        color: "success",
        timeout: 5000,
      });
    } catch (err) {
      setError(t("failedToUpdateProfile"));
      logger.error(err);

      // Show error toast notification with action to ensure it appears
      addToast({
        title: t("errorSavingProfile"),
        description: t("profileUpdateFailed"),
        color: "danger",
        timeout: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Verify email code
  const verifyEmail = async () => {
    if (!newEmail || !verificationCode || !profileData) {
      setVerificationError(t("verificationCodeRequired"));
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      const response = await axios.put("/api/verify-email", {
        email: newEmail,
        otp: verificationCode,
      });

      if (response.data.success) {
        // Email verified successfully
        logger.log("Email verification successful");

        // Find the existing email communication in the list
        const updatedCommList = [...profileData["Communication List"]];
        const existingEmailIndex = updatedCommList.findIndex(
          (comm) => comm["Communication Type"] === "M"
        );

        if (existingEmailIndex >= 0) {
          // Update existing email communication
          updatedCommList[existingEmailIndex] = {
            ...updatedCommList[existingEmailIndex],
            "Communication Detail": newEmail,
          };

          // Important: Update the emailData for display
          setEmailData({
            ...updatedCommList[existingEmailIndex],
            "Communication Detail": newEmail,
          });
        } else {
          // Create new email communication if none exists
          const newEmailComm = {
            "Communication ID": 0, // ID will be assigned by the API
            "Communication Detail": newEmail,
            Description: "Email",
            "Communication Type": "M",
            Priority: "5",
            "Record Marked Deleted": false,
            "Status List": [],
          };

          updatedCommList.push(newEmailComm);
          setEmailData(newEmailComm);
        }

        // Update profileData with new Communication List
        const updatedProfileData = {
          ...profileData,
          "Communication List": updatedCommList,
        };

        // Set this as the new profile data
        setProfileData(updatedProfileData);

        // Set this as the new original email
        setOriginalEmail(newEmail);

        // Close verification modal
        setIsVerificationModalOpen(false);

        // Clear verification state
        setNewEmail(null);
        setVerificationCode("");

        // Call the API to update the profile with the new email
        try {
          setIsSaving(true);

          // Save the updated profile with the new email
          await updateClientInfo(updatedProfileData);
          setIsEditing(false);

          // Show success toast notification with action to ensure it appears
          addToast({
            title: t("profileUpdatedSuccess"),
            description: t("emailUpdatedSuccessfully"),
            color: "success",
            timeout: 5000,
          });
        } catch (saveError) {
          logger.error("Error saving profile with new email:", saveError);
          addToast({
            title: t("errorSavingProfile"),
            description: t("profileUpdateFailed"),
            color: "danger",
            timeout: 5000,
          });
        } finally {
          setIsSaving(false);
        }
      } else {
        setVerificationError(t("invalidVerificationCode"));
      }
    } catch (err) {
      logger.error("Error verifying email:", err);
      setVerificationError(t("failedToVerifyEmail"));
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend verification code
  const resendVerificationCode = async () => {
    if (!newEmail || countdownTime > 0) return;

    setIsResendingCode(true);
    setVerificationError("");

    try {
      const response = await axios.post("/api/verify-email", {
        email: newEmail,
      });

      if (response.data.success) {
        // If in development mode, you might have access to the OTP
        if (response.data.otp) {
          logger.log(
            "DEV MODE - Resent email verification code:",
            response.data.otp
          );
        }

        // Start countdown for resend button (2 minutes)
        setCountdownTime(120);

        // Show success toast notification with action to ensure it appears
        addToast({
          title: t("verificationCodeResent"),
          description: t("pleaseCheckYourNewEmail"),
          color: "success",
          timeout: 5000,
        });
      } else {
        setVerificationError(t("failedToResendVerificationCode"));
      }
    } catch (err) {
      logger.error("Error resending verification code:", err);
      setVerificationError(t("failedToResendVerificationCode"));
    } finally {
      setIsResendingCode(false);
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
          {t("failedToLoadProfile")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 transition-colors duration-200">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="col-span-full md:col-span-1 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardBody className="items-center justify-center gap-4 text-center">
            <div className="relative inline-block">
              <Avatar
                className="h-24 w-24 sm:h-32 sm:w-32 text-large"
                src={profileImage ? `${profileImage}` : "golfball.webp"}
                icon={<User size={40} />}
              />
              <Button
                isIconOnly
                size="sm"
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-md"
                onPress={onOpen}
              >
                <Upload size={16} />
              </Button>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-2">
                {profileData["Title"]} {profileData["First Name"]}{" "}
                {profileData["Surname"]}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {profileData["Given Name"]}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Profile Details Card */}
        <Card className="col-span-full md:col-span-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex justify-between items-center px-1 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {t("profileDetails")}
            </h3>
            <Button
              color={isEditing ? "success" : "primary"}
              variant="flat"
              startContent={
                isEditing ? (
                  isSaving ? null : (
                    <Save size={18} />
                  )
                ) : (
                  <Edit2 size={18} />
                )
              }
              isLoading={isSaving}
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? (isSaving ? t("saving") : t("save")) : t("edit")}
            </Button>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {isEditing ? (
                <>
                  <Select
                    label={t("title")}
                    defaultSelectedKeys={[profileData["Title"]]}
                    onChange={handleInputChange("Title")}
                    className="w-full"
                    classNames={{
                      label: "text-base font-medium", // Change this to the size you want
                    }}
                  >
                    {titles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label={t("gender")}
                    defaultSelectedKeys={[profileData["Gender"]]}
                    disabled={!isEditing}
                    onChange={handleInputChange("Gender")}
                    className="w-full"
                    classNames={{
                      label: "text-base font-medium", // Change this to the size you want
                    }}
                  >
                    {genders.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label={t("firstName")}
                    defaultValue={profileData["First Name"]}
                    isReadOnly={!isEditing}
                    onChange={handleInputChange("First Name")}
                    classNames={{
                      label: "text-base font-medium", // Change this to the size you want
                    }}
                  />
                  <Input
                    label={t("surname")}
                    defaultValue={profileData["Surname"]}
                    isReadOnly={!isEditing}
                    onChange={handleInputChange("Surname")}
                    classNames={{
                      label: "text-base font-medium", // Change this to the size you want
                    }}
                  />
                  <Input
                    label={t("givenName")}
                    defaultValue={profileData["Given Name"]}
                    isReadOnly={!isEditing}
                    onChange={handleInputChange("Given Name")}
                    classNames={{
                      label: "text-base font-medium", // Change this to the size you want
                    }}
                  />
                  <Input
                    label={t("company")}
                    defaultValue={profileData["Company"]}
                    isReadOnly={!isEditing}
                    onChange={handleInputChange("Company")}
                    classNames={{
                      label: "text-base font-medium", // Change this to the size you want
                    }}
                  />

                  <Input
                    label={t("email")}
                    defaultValue={emailData["Communication Detail"]}
                    isReadOnly={!isEditing}
                    onChange={handleEmailChange}
                    classNames={{
                      label: "text-base font-medium",
                    }}
                  />

                  <Input
                    label={t("phoneNumber")}
                    defaultValue={phoneData["Communication Detail"]}
                    isReadOnly={!isEditing}
                    onChange={handlePhoneChange}
                    classNames={{
                      label: "text-base font-medium", // Change this to the size you want
                    }}
                  />
                </>
              ) : (
                <>
                  <p className=" bg-default-100 font- text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("title")}</span>
                    {profileData["Title"] || t("na")}
                  </p>
                  <p className=" bg-default-100  text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("gender")}</span>
                    {profileData["Gender"] === "M"
                      ? t("male")
                      : profileData["Gender"] === "F"
                      ? t("female")
                      : t("unspecified")}
                  </p>
                  <p className=" bg-default-100 text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("firstName")}</span>
                    {profileData["First Name"] || t("na")}
                  </p>
                  <p className=" bg-default-100 text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("surname")}</span>
                    {profileData["Surname"] || t("na")}
                  </p>
                  <p className=" bg-default-100 text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("givenName")}</span>
                    {profileData["Given Name"] || t("na")}
                  </p>
                  <p className=" bg-default-100 text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("company")}</span>
                    {profileData["Company"] || t("na")}
                  </p>
                  <p className=" bg-default-100 text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("email")}</span>
                    {emailData["Communication Detail"] || t("na")}
                  </p>
                  <p className=" bg-default-100 text-default-700 px-3 py-2 rounded-lg flex flex-col justify-center text-sm">
                    <span>{t("phoneNumber")}</span>
                    {phoneData["Communication Detail"] || t("na")}
                  </p>
                </>
              )}
              {/* button */}
              <div className="md:col-span-2 mt-2">
                <LogoutButton />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="col-span-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="px-1 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {t("bookings")}
            </h3>
          </CardHeader>
          <CardBody>
            <div className="sm:hidden">
              {bookingData.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-5">
                  {t("noBookingAvailable")}
                </div>
              ) : (
                <div className="space-y-3">
                  {bookingData.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors duration-300"
                      onClick={() => openBookingModal(booking)}
                    >
                      <div className="font-medium text-gray-800 dark:text-gray-200 text-base mb-2">
                        {booking.courseName}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 mr-1">
                            {t("date")}:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {dateToString(
                              convertExcelDateToJSDate(booking.teeDate)
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 mr-1">
                            {t("time")}:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {convertMinutesToTimeWithAMPM(booking.teeTime)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 mr-1">
                            {t("golfers")}:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {booking.numberOfGolfers}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 mr-1">
                            {t("status")}:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden sm:block overflow-x-auto w-full">
              {/* Header Row */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow-sm">
                <div className="text-xs sm:text-sm">{t("courseName")}</div>
                <div className="text-xs sm:text-sm hidden md:block">
                  {t("location")}
                </div>
                <div className="text-xs sm:text-sm">{t("date")}</div>
                <div className="text-xs sm:text-sm">{t("time")}</div>
                <div className="text-xs sm:text-sm hidden md:block">
                  {t("golfers")}
                </div>
                <div className="text-xs sm:text-sm hidden md:block">
                  {t("status")}
                </div>
              </div>

              {/* Booking Data Rows or No Data Message */}
              {bookingData.length === 0 ? (
                <>
                  <div className="text-center text-gray-500 dark:text-gray-400 py-5">
                    {t("noBookingAvailable")}
                  </div>
                  <div className="text-center">
                    <Button
                      as={Link}
                      href="/golfcourse"
                      color="primary"
                      className="mt-2"
                    >
                      {t("goToGolfCourses")}
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
              {t("accountInformation")}
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  {t("memberSince")}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {t("march2025")}
                </p>
              </div>
              <div>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  {t("lastLogin")}
                </p>
                <p className="text-gray-800 dark:text-gray-200">{t("today")}</p>
              </div>
              <div>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  {t("status")}
                </p>
                <p className="text-green-600 dark:text-green-400">
                  {t("active")}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Use the BookingModal component */}
        <BookingModal
          isOpen={isOpenBookings}
          onClose={closeBookingModal}
          booking={selectedBooking}
          forceReload={refetchBookings}
        />

        {/* Image Upload Modal */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          className="sm:max-w-md w-[90%] mx-auto"
        >
          <ModalContent className="bg-white dark:bg-gray-800 p-4">
            <ModalHeader className="text-gray-800 dark:text-gray-100">
              {t("uploadProfilePicture")}
            </ModalHeader>
            <ModalBody>
              <Input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="h-12"
              />
              {previewUrl && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={previewUrl}
                    alt={t("preview")}
                    width={500}
                    height={500}
                    className="max-h-48 rounded object-cover border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="dark:text-gray-300 dark:hover:text-white h-12 px-6"
              >
                {t("cancel")}
              </Button>
              <Button
                color="primary"
                onPress={handleImageUpload}
                isLoading={isUploading}
                className="bg-green-600 dark:bg-green-700 text-white h-12 px-6"
              >
                {t("upload")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Email Verification Modal */}
        <Modal
          isOpen={isVerificationModalOpen}
          onClose={() => {
            setIsVerificationModalOpen(false);
            // Revert the displayed email to original
            setEmailData((prev: any) => ({
              ...prev,
              "Communication Detail": originalEmail,
            }));
            setNewEmail(null);
          }}
          className="sm:max-w-md w-[90%] mx-auto"
        >
          <ModalContent className="bg-white dark:bg-gray-800 p-4">
            <ModalHeader className="flex flex-col gap-1 text-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {t("verifyYourNewEmail")}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center gap-4">
                {/* Email verification icon */}
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 dark:text-green-400"
                  >
                    <path d="M22 7.81v10.438c0 .76-.616 1.375-1.375 1.375h-17.25c-.76 0-1.375-.616-1.375-1.375V7.81l10 5.625 10-5.625Z" />
                    <path d="m2 7.81 10-5.625 10 5.625" />
                  </svg>
                </div>

                <p className="text-sm mb-1 text-center text-gray-600 dark:text-gray-300">
                  {t("verificationCodeSentTo")}
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  {newEmail}
                </p>

                {verificationError && (
                  <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg w-full text-center">
                    {verificationError}
                  </div>
                )}

                <Input
                  type="text"
                  label={t("verificationCode")}
                  placeholder={t("enterVerificationCode")}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={isVerifying}
                  variant="bordered"
                  className="w-full"
                  size="lg"
                />

                <Button
                  variant="light"
                  color="primary"
                  className="w-full text-green-600 dark:text-green-400"
                  onPress={resendVerificationCode}
                  disabled={isResendingCode || countdownTime > 0}
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 21h5v-5" />
                    </svg>
                  }
                >
                  {isResendingCode
                    ? t("sending")
                    : countdownTime > 0
                    ? `${t("resendCodeIn")} ${formatTime(countdownTime)}`
                    : t("resendCode")}
                </Button>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3 pt-2 pb-4">
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  setIsVerificationModalOpen(false);
                  // Revert the displayed email to original
                  setEmailData((prev: any) => ({
                    ...prev,
                    "Communication Detail": originalEmail,
                  }));
                  setNewEmail(null);
                }}
                className="w-1/2"
              >
                {t("cancel")}
              </Button>
              <Button
                color="primary"
                onPress={verifyEmail}
                isLoading={isVerifying}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white w-1/2"
              >
                {isVerifying ? t("verifying") : t("verify")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
