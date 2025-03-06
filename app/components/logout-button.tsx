import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { clearAuthData } from "@/app/lib/auth";

const LogoutButton = () => {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      console.log("Logging out, clearing auth data");
      clearAuthData();

      // Verify storage was cleared
      console.log(
        "After logout - localStorage clientId:",
        localStorage.getItem("clientId")
      );
      console.log(
        "After logout - sessionStorage clientId:",
        sessionStorage.getItem("clientId")
      );

      router.push("/auth/login");
      setIsLogoutModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmation = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <div>
      <Button
        onPress={handleConfirmation}
        className="bg-red-500 text-white hover:bg-red-700 w-[100%] text-medium"
      >
        Logout
      </Button>

      {/* Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to log out?</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={closeModal} className="mr-2">
              Cancel
            </Button>
            <Button
              onPress={handleLogout}
              className="bg-red-500 text-white hover:bg-red-700"
            >
              Yes, Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LogoutButton;
