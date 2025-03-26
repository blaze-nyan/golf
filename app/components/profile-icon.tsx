"use client";

import { Avatar } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getClientImage, getClientInfo } from "../lib/api";
import { logger } from "@/app/lib/logger";

export default function ProfileIcon() {
  // Don't access localStorage during rendering
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const arrayBufferToBase64 = (buffer: string) => {
    return `data:image/jpeg;base64,${buffer}`;
  };

  useEffect(() => {
    // Move all client-side logic to useEffect
    const clientImage = window.localStorage.getItem("clientImage");
    setProfileImage(clientImage);
    setIsLoaded(true);

    // Only fetch if no image is available
    if (!clientImage) {
      const fetchProfileAndImage = async () => {
        try {
          const clientId = window.localStorage.getItem("clientId");
          if (!clientId) return;

          const parsedClientId = parseInt(clientId);
          if (isNaN(parsedClientId)) return;

          // Fetch profile and image data
          const [, imageData] = await Promise.all([
            getClientInfo(parsedClientId),
            getClientImage(parsedClientId),
          ]);

          if (imageData.success && imageData.imageInfo) {
            const base64Image = arrayBufferToBase64(imageData.imageInfo);
            setProfileImage(base64Image);
            window.localStorage.setItem("clientImage", base64Image);
          }
        } catch (err) {
          logger.error("Error fetching profile image:", err);
        }
      };

      fetchProfileAndImage();
    }
  }, []);

  // Show placeholder or nothing during server rendering
  if (!isLoaded) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  // Determine which image to use
  const usedImage =
    profileImage && profileImage !== "null" ? profileImage : "/golfball.webp";

  return (
    <Link href="/profile">
      <Avatar isBordered color="success" src={usedImage} />
    </Link>
  );
}
