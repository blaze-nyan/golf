/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect } from "react";
//components
import { NextButton } from "@/app/golfcourse/components/NextButton";
import { useProgress } from "../../context/progress-context";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { postData } from "@/app/lib/api-placeholder-db";
import AnimatedLoading from "@/app/components/animated-loading";

const page = () => {
  const { bookingDetails, setBookingDetails } = useProgress(); // Access bookingDetails from context
  const [paymentType, setPaymentType] = useState<"prepayment" | "fullPayment">(
    "fullPayment"
  );
  const [amountToPay, setAmountToPay] = useState(bookingDetails.price);

  // State to track panel visibility
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Credit card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: errorModalOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Monitor screen size and panel visibility
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check for panel visibility from localStorage or custom events
    const checkPanelState = () => {
      const panelState = localStorage.getItem("panelVisible");
      if (panelState) {
        setIsPanelVisible(panelState === "true");
      }
    };

    handleResize();
    checkPanelState();

    window.addEventListener("resize", handleResize);

    // Listen for panel toggle events
    const handlePanelToggle = (e: CustomEvent) => {
      setIsPanelVisible(e.detail.visible);
    };

    window.addEventListener("panelToggle" as any, handlePanelToggle);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("panelToggle" as any, handlePanelToggle);
    };
  }, []);

  useEffect(() => {
    if (paymentType === "prepayment") {
      setAmountToPay(bookingDetails.price * 0.3); // 30% for prepayment
    } else {
      setAmountToPay(bookingDetails.price); // 100% for full payment
    }
  }, [paymentType, bookingDetails.price]);

  const handlePaymentTypeChange = (type: "prepayment" | "fullPayment") => {
    setPaymentType(type);
  };

  useEffect(() => {
    setBookingDetails((prevBookingDetails: any) => ({
      ...prevBookingDetails,
      paymentType: paymentType,
    }));
  }, [paymentType, setBookingDetails]);

  useEffect(() => {
    setBookingDetails((prevBookingDetails: any) => ({
      ...prevBookingDetails,
      paid: amountToPay,
    }));
  }, [amountToPay, setBookingDetails]);

  // Simple validation function
  const validateCreditCard = () => {
    if (cardNumber.length < 16) {
      onErrorOpen();
      return false;
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      onErrorOpen();
      return false;
    }
    if (cvv.length < 3) {
      onErrorOpen();
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateCreditCard()) {
      onOpen(); // Open the success modal on successful payment
      console.log(bookingDetails);
      postData("bookings", bookingDetails);
      setIsLoading(true); // Show loading spinner
      setTimeout(() => {
        setIsLoading(false); // Simulate loading completion after a delay
      }, 3000); // 3 seconds delay to simulate loading time
    }
  };

  return (
    <div
      className={`
        space-y-4 sm:space-y-6 p-3 sm:p-4 transition-all duration-300
        w-full mx-auto
        ${
          isMobile
            ? ""
            : isPanelVisible
            ? "max-w-2xl"
            : "max-w-2xl md:max-w-3xl mx-auto"
        }
      `}
    >
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 md:mb-5">
        Payment Page
      </h1>

      {/* Payment Type Selection */}
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
          Select Payment Type
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            className={`w-full py-2 sm:py-2.5 text-sm sm:text-base ${
              paymentType === "prepayment"
                ? "bg-green-700 text-white dark:bg-green-600"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
            onPress={() => handlePaymentTypeChange("prepayment")}
          >
            Prepayment (30%)
          </Button>
          <Button
            className={`w-full py-2 sm:py-2.5 text-sm sm:text-base ${
              paymentType === "fullPayment"
                ? "bg-green-700 text-white dark:bg-green-600"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
            onPress={() => handlePaymentTypeChange("fullPayment")}
          >
            Full Payment
          </Button>
        </div>
      </div>

      {/* Payment Amount Display */}
      <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
            Amount to Pay
          </h2>
        </CardHeader>
        <CardBody className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-green-400">
            {amountToPay} THB
          </div>
        </CardBody>
      </Card>

      <div className="text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm md:text-md p-2 sm:p-3 md:p-4 border border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-md my-1">
        There will be no refund after payment is made.
      </div>

      {/* Credit Card Input Form */}
      <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Credit Card Details
          </h2>
        </CardHeader>
        <CardBody className="px-3 sm:px-4 py-2 sm:py-3 space-y-3 sm:space-y-4">
          {/* Select Payment Method */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 visible text-gray-700 dark:text-gray-300">
              Select Payment Method
            </label>
            <Select
              placeholder="Select a payment method"
              aria-label="Select a payment method"
              className="w-full"
            >
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">MasterCard</SelectItem>
              <SelectItem value="amex">American Express</SelectItem>
            </Select>
          </div>
          {/* Card Number */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
              Card Number
            </label>
            <Input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full"
              maxLength={16}
              placeholder="Card Number"
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
                Expiry Date (MM/YY)
              </label>
              <Input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full"
                placeholder="MM/YY"
              />
            </div>
            <div className="w-full sm:w-1/2 mt-3 sm:mt-0">
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
                CVV
              </label>
              <Input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full"
                maxLength={3}
                placeholder="CVV"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
              Cardholder Name
            </label>
            <Input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="w-full"
              placeholder="Cardholder Name"
            />
          </div>

          <Button
            onPress={handleSubmit}
            className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white mt-4 sm:mt-6 py-2"
          >
            Submit Payment
          </Button>
        </CardBody>
      </Card>

      {/* Mobile Next Button */}
      <div className="pt-4 md:hidden   p-2 shadow-lg">
        <div className="flex justify-end">
          <NextButton />
        </div>
      </div>

      {/* Desktop Next Button */}
      <div className="pt-4 hidden md:flex md:justify-end shadow-lg">
        <NextButton />
      </div>

      {/* Modal for Payment Success */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent className="dark:bg-gray-800">
          <ModalHeader className="text-center dark:text-gray-100">
            Payment
          </ModalHeader>
          <ModalBody>
            {isLoading ? (
              <div className="w-full py-6 flex justify-center items-center">
                <AnimatedLoading />
              </div>
            ) : (
              <div className="text-center py-4 dark:text-gray-200">
                Your payment has been successfully processed.
              </div>
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center">
            {!isLoading && <NextButton />}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Error */}
      <Modal isOpen={errorModalOpen} onClose={onErrorClose} size="sm">
        <ModalContent className="dark:bg-gray-800">
          <ModalHeader className="text-center dark:text-gray-100">
            Error
          </ModalHeader>
          <ModalBody>
            <div className="text-center text-red-600 dark:text-red-400 py-4">
              There is an issue with the card details provided. Please check and
              try again.
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <Button
              onPress={onErrorClose}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default page;
