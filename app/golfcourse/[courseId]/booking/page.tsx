'use client';

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
  Avatar,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

const page = () => {
  const { bookingDetails } = useProgress(); // Access bookingDetails from context
  const [paymentType, setPaymentType] = useState<"prepayment" | "fullPayment">("fullPayment");
  const [amountToPay, setAmountToPay] = useState(bookingDetails.price);

  // Credit card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Simple validation function (you can improve it)
  const validateCreditCard = () => {
    if (cardNumber.length < 16) {
      alert("Card number must be 16 digits.");
      return false;
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      alert("Expiry date must be in MM/YY format.");
      return false;
    }
    if (cvv.length < 3) {
      alert("CVV must be 3 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateCreditCard()) {
      onOpen(); // Open the success modal on successful payment
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Payment Page</h1>

      {/* Payment Type Selection */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Select Payment Type</h2>
        <div className="flex gap-4">
          <Button
            className={`w-full ${paymentType === "prepayment" ? "bg-green-700 text-white" : "bg-gray-200"}`}
            onClick={() => handlePaymentTypeChange("prepayment")}
          >
            Prepayment (30% of total)
          </Button>
          <Button
            className={`w-full ${paymentType === "fullPayment" ? "bg-green-700 text-white" : "bg-gray-200"}`}
            onClick={() => handlePaymentTypeChange("fullPayment")}
          >
            Full Payment (100% of total)
          </Button>
        </div>
      </div>

      {/* Payment Amount Display */}
      <Card className="p-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Amount to Pay</h2>
        </CardHeader>
        <CardBody>
          <div className="text-xl">{amountToPay} THB</div>
        </CardBody>
      </Card>

      {/* Credit Card Input Form */}
      <Card className="p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Credit Card Details</h2>
        </CardHeader>
        <CardBody>
          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Card Number</label>
            <Input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full rounded"
              maxLength={16}
              placeholder="Card Number"
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Expiry Date (MM/YY)</label>
              <Input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded"
                placeholder="MM/YY"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">CVV</label>
              <Input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full rounded"
                maxLength={3}
                placeholder="CVV"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Cardholder Name</label>
            <Input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="w-full rounded"
              placeholder="Cardholder Name"
            />
          </div>

          {/* Select Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Select Payment Method</label>
            <Select>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">MasterCard</SelectItem>
              <SelectItem value="amex">American Express</SelectItem>
            </Select>
          </div>

          {/* Loading Spinner */}
          {false && <Spinner />} {/* You can display this based on loading state */}
        </CardBody>

        {/* Submit Button */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Payment Success</ModalHeader>
            <ModalBody>Your payment has been successfully processed.</ModalBody>
            <ModalFooter>
              <NextButton />
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Button onClick={handleSubmit} className="w-full bg-green-700 text-white">Submit Payment</Button>
      </Card>

      {/* Next Button */}
    </div>
  );
};

export default page;
