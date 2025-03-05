/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { NextButton } from "@/app/golfcourse/components/NextButton";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useProgress } from "../../context/progress-context";
import { convertExcelDateToJSDate } from "@/app/components/date-functionalities";
import { golfFees, golfFees18Hole } from "@/app/components/golf-fee-table";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";

import { getClientInfo } from "@/app/lib/api";

const page = () => {
  const { setBookingDetails, bookingDetails } = useProgress();

  useEffect(() => {
    const clientID =
      typeof window !== "undefined"
        ? window.localStorage.getItem("clientId")
        : null;
    setBookingDetails((prevBookingDetails: any) => ({
      ...prevBookingDetails,
      clientID: clientID,
    }));
    if (clientID) {
      getClientInfo(Number(clientID)).then((clientInfo) => {
        setGolferList([
          clientInfo["Given Name"] !== ""
            ? clientInfo["Given Name"]
            : `${clientInfo["First Name"]} ${clientInfo["Surname"]}`,
        ]);

        console.log(clientInfo);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Individual state variables
  const [numGolfers, setNumGolfers] = useState(1);
  const [numCaddies, setNumCaddies] = useState(0);
  const [numNonPlayers, setNonPlayers] = useState(0);
  const [numGolfCarts, setNumGolfCarts] = useState(1); // Minimum 1 cart
  const [numFoodDrinks, setNumFoodDrinks] = useState(0);
  const [totalPrice, settotalPrice] = useState(1);
  const [golferList, setGolferList] = useState<string[]>([]); // Golfer list
  const [newGolferName, setNewGolferName] = useState(""); // New golfer input
  const [isGolferModalOpen, setGolferModalOpen] = useState(false); // Modal visibility

  useEffect(() => {
    setNumGolfCarts((prev) => Math.max(prev, numGolfers));
  }, [numGolfers]);

  useEffect(() => {
    const calculatedPrice =
      numGolfers * feeForDay +
      numNonPlayers * 100 +
      numCaddies * 300 +
      numGolfCarts * 500 +
      numFoodDrinks * 300;

    settotalPrice(calculatedPrice);

    setBookingDetails((prevBookingDetails: any) => ({
      ...prevBookingDetails,
      numberOfGolfers: numGolfers,
      Caddies: numCaddies,
      numberOfnonPlayers: numNonPlayers,
      "Golf Cart": numGolfCarts,
      "Food & Drinks": numFoodDrinks,
      "Golfer Names": golferList,
      price: calculatedPrice,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    numGolfers,
    numCaddies,
    numGolfCarts,
    numFoodDrinks,
    numNonPlayers,
    setBookingDetails,
    golferList,
  ]);

  const handleNonPlayerChange = (change: number) => {
    setNonPlayers((prev) => Math.max(0, prev + change));
  };

  const handleServiceChange = (
    service: "caddies" | "golfCarts" | "foodDrinks",
    change: number
  ) => {
    if (service === "golfCarts") {
      setNumGolfCarts((prev) => Math.max(numGolfers, prev + change)); // Ensure Golf Carts >= Golfers
    } else if (service === "caddies") {
      setNumCaddies((prev) => Math.max(0, prev + change));
    } else if (service === "foodDrinks") {
      setNumFoodDrinks((prev) => Math.max(0, prev + change));
    }
  };

  const handleAddGolfer = () => {
    if (newGolferName.trim()) {
      setGolferList((prevGolferList) => [...prevGolferList, newGolferName]);
      setNewGolferName(""); // Clear the input field
      setGolferModalOpen(false); // Close the modal
      setNumGolfers((prev) => prev + 1); // Increment number of golfers
    }
  };

  const handleRemoveGolfer = () => {
    if (numGolfers > 1) {
      setGolferList((prevGolfers) => prevGolfers.slice(0, -1));
      setNumGolfers((prev) => prev - 1);
    }
  };

  const dayOfWeek = convertExcelDateToJSDate(
    bookingDetails.teeDate
  ).toLocaleDateString("en-US", { weekday: "long" }) as keyof typeof golfFees;

  let feeForDay = golfFees[dayOfWeek];
  if (bookingDetails.bookingType == 2) {
    feeForDay = golfFees18Hole[dayOfWeek];
  }

  return (
    <div className=" p-4 w-[100%] h-full">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-5">
        Booking Details
      </h1>
      {/* Golfers */}
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 px-4 rounded-lg mb-4 shadow-sm">
        <span className="text-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <Icon
            icon="mdi-golf"
            className="text-green-600 dark:text-green-400"
          />
          Golfers - {feeForDay} THB
        </span>
        <div className="flex items-center space-x-3">
          <button
            className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            onClick={() => handleRemoveGolfer()}
            disabled={numGolfers === 1}
          >
            <Icon icon="mdi-minus" />
          </button>
          <span className="text-medium w-6 text-center font-semibold text-gray-700 dark:text-gray-200">
            {numGolfers}
          </span>
          <button
            className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick={() => setGolferModalOpen(true)}
          >
            <Icon icon="mdi-plus" />
          </button>
        </div>
      </div>
      <div>
        {golferList.map((golfer) => (
          <span
            key={golfer}
            className="px-2 sm:px-4 py-1 sm:py-2 border border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full shadow-sm mr-1"
          >
            {golfer}
          </span>
        ))}
      </div>
      {/* New Golfer Modal */}
      {isGolferModalOpen && (
        <Modal
          isOpen={isGolferModalOpen}
          onClose={() => setGolferModalOpen(false)}
        >
          <ModalContent className="max-w-sm mx-auto dark:bg-gray-800">
            <ModalHeader className="dark:text-gray-100">
              Add New Golfer
            </ModalHeader>
            <ModalBody>
              <Input
                value={newGolferName}
                onChange={(e) => setNewGolferName(e.target.value)}
                placeholder="Enter Golfer's Name"
                className="w-full"
              />
            </ModalBody>
            <ModalFooter className="space-x-3">
              <Button
                onPress={handleAddGolfer}
                className="bg-green-700 dark:bg-green-600 text-white"
              >
                Add Golfer
              </Button>
              <Button
                onPress={() => setGolferModalOpen(false)}
                className="dark:bg-gray-700 dark:text-gray-200"
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {/* Guests */}
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 px-4 rounded-lg my-4 shadow-sm">
        <span className="text-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <Icon
            icon="mdi-person"
            className="text-green-600 dark:text-green-400"
          />
          Accompanying Persons - 100 THB
        </span>
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              onClick={() => handleNonPlayerChange(-1)}
              disabled={numNonPlayers === 0}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center font-semibold text-gray-700 dark:text-gray-200">
              {numNonPlayers}
            </span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              onClick={() => handleNonPlayerChange(1)}
              disabled={numNonPlayers === 4}
            >
              <Icon icon="mdi-plus" />
            </button>
          </div>
        </div>
      </div>
      {/* Services */}
      <div className="space-y-4">
        {/* Caddies */}
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 px-4 rounded-lg shadow-sm">
          <span className="text-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Icon
              icon="mdi-backpack"
              className="text-green-600 dark:text-green-400"
            />
            Caddies - 300 THB
          </span>
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              onClick={() => handleServiceChange("caddies", -1)}
              disabled={numCaddies === 0}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center font-semibold text-gray-700 dark:text-gray-200">
              {numCaddies}
            </span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => handleServiceChange("caddies", 1)}
            >
              <Icon icon="mdi-plus" />
            </button>
          </div>
        </div>

        {/* Golf Cart */}
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 px-4 rounded-lg shadow-sm">
          <span className="text-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Icon
              icon="mdi-car"
              className="text-green-600 dark:text-green-400"
            />
            Golf Cart - 500 THB
          </span>
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              onClick={() => handleServiceChange("golfCarts", -1)}
              disabled={numGolfCarts === numGolfers}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center font-semibold text-gray-700 dark:text-gray-200">
              {numGolfCarts}
            </span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => handleServiceChange("golfCarts", 1)}
            >
              <Icon icon="mdi-plus" />
            </button>
          </div>
        </div>

        {/* Food & Drinks */}
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 px-4 rounded-lg shadow-sm">
          <span className="text-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Icon
              icon="mdi-food"
              className="text-green-600 dark:text-green-400"
            />
            Food & Drinks - 300 THB
          </span>
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              onClick={() => handleServiceChange("foodDrinks", -1)}
              disabled={numFoodDrinks === 0}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center font-semibold text-gray-700 dark:text-gray-200">
              {numFoodDrinks}
            </span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle text-center shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => handleServiceChange("foodDrinks", 1)}
            >
              <Icon icon="mdi-plus" />
            </button>
          </div>
        </div>
      </div>
      {/* Total Price */}
      <div className="mt-6 text-lg text-right font-bold text-gray-800 dark:text-green-400">
        Total: {totalPrice} THB
      </div>
      <div className="mt-6 flex justify-start w-[100%]">
        <NextButton />
      </div>
    </div>
  );
};

export default page;
