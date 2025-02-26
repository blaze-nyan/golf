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
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { postData } from "@/app/lib/api-placeholder-db";

const page = () => {
  const { bookingDetails, setBookingDetails } = useProgress(); // Access bookingDetails from context
  const [paymentType, setPaymentType] = useState<"prepayment" | "fullPayment">(
    "fullPayment"
  );
  const [amountToPay, setAmountToPay] = useState(bookingDetails.price);

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

  // Simple validation function (you can improve it)
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
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-5">
        Payment Page
      </h1>

      {/* Payment Type Selection */}
      <div className="space-y-3">
        <h2 className="text-lg md:text-xl font-semibold">
          Select Payment Type
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className={`w-full ${
              paymentType === "prepayment"
                ? "bg-green-700 text-white"
                : "bg-gray-200"
            }`}
            onPress={() => handlePaymentTypeChange("prepayment")}
          >
            Prepayment (30%)
          </Button>
          <Button
            className={`w-full ${
              paymentType === "fullPayment"
                ? "bg-green-700 text-white"
                : "bg-gray-200"
            }`}
            onPress={() => handlePaymentTypeChange("fullPayment")}
          >
            Full Payment
          </Button>
        </div>
      </div>

      {/* Payment Amount Display */}
      <Card className="w-full">
        <CardHeader className="px-4 py-3">
          <h2 className="text-base md:text-lg font-semibold">Amount to Pay</h2>
        </CardHeader>
        <CardBody className="px-4 py-3">
          <div className="text-lg md:text-xl font-bold">{amountToPay} THB</div>
        </CardBody>
      </Card>

      <div className="text-red-600 font-bold text-sm md:text-md p-3 md:p-4 border border-red-500 rounded-md my-1">
        There will be no refund after payment is made.
      </div>

      {/* Credit Card Input Form */}
      <Card className="w-full">
        <CardHeader className="px-4 py-3">
          <h2 className="text-lg md:text-xl font-semibold">
            Credit Card Details
          </h2>
        </CardHeader>
        <CardBody className="px-4 py-3 space-y-4">
          {/* Select Payment Method */}
          <div>
            <label className="block text-sm font-semibold mb-2 visible">
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
            <label className="block text-sm font-semibold mb-2">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold mb-2">
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
            <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
              <label className="block text-sm font-semibold mb-2">CVV</label>
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
            <label className="block text-sm font-semibold mb-2">
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
            className="w-full bg-green-700 text-white mt-6 py-2"
          >
            Submit Payment
          </Button>
        </CardBody>
      </Card>

      {/* Modal for Payment Success */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent>
          <ModalHeader className="text-center">Payment</ModalHeader>
          <ModalBody>
            {isLoading ? (
              <div className="w-full py-6 flex justify-center items-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="text-center py-4">
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
        <ModalContent>
          <ModalHeader className="text-center">Error</ModalHeader>
          <ModalBody>
            <div className="text-center text-red-600 py-4">
              There is an issue with the card details provided. Please check and
              try again.
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <Button onPress={onErrorClose} className="bg-red-500 text-white">
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default page;
