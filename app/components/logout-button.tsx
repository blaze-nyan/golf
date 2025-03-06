// app/components/logout-button.tsx
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

const LogoutButton = () => {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // Clear all auth-related data from both storages
      window.localStorage.removeItem("clientImage");
      window.localStorage.removeItem("clientId");
      window.localStorage.removeItem("clientIdEncrypt");
      window.localStorage.removeItem("clientIdExpiration");
      window.localStorage.removeItem("rememberMe");

      window.sessionStorage.removeItem("clientId");

      router.push("/auth/login");
      setIsLogoutModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsLogoutModalOpen(false); // Close the modal without logging out
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
