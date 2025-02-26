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
      window.localStorage.removeItem("clientImage");
      window.localStorage.removeItem("clientId");
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
        onClick={handleConfirmation}
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
            <Button onClick={closeModal} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
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
