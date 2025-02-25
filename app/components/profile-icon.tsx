import { Avatar } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getClientImage, getClientInfo } from "../lib/api";

export default function ProfileIcon() {
  const clientImage = localStorage.getItem("clientImage");
  const [profileImage, setProfileImage] = useState<string | null>(clientImage);

  const arrayBufferToBase64 = (buffer: string) => {
    return `data:image/jpeg;base64,${buffer}`;
  };

  useEffect(() => {
    // If profileImage already exists, skip fetching
    if (profileImage) return;

    const fetchProfileAndImage = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
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
          localStorage.setItem("clientImage", base64Image);
        }
      } catch (err) {
        console.error("Error fetching profile image:", err);
      }
    };

    fetchProfileAndImage();
  }, [profileImage]);

  console.log(profileImage)
  let usedImage: string
  if(profileImage !== "null" && profileImage){
    usedImage = profileImage
  }else (
    usedImage = "/golfball.jpg"
  )

  return (
    <Link href="/profile">
      <Avatar
        isBordered
        color="success"
        src={usedImage}
      />
    </Link>
  );
}
