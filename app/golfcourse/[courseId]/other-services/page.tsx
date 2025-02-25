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

const OtherServicesPage = () => {
  const { setBookingDetails, bookingDetails } = useProgress();

  useEffect(() => {
    const clientID = localStorage.getItem("clientId");
    setBookingDetails((prevBookingDetails: any) => ({
      ...prevBookingDetails,
      clientID: clientID,
    }));
    if (clientID) {
      getClientInfo(Number(clientID)).then((clientInfo) => {
        setGolferList([
          clientInfo["Given Name"] !== "" 
            ? clientInfo["Given Name"] 
            : `${clientInfo["First Name"]} ${clientInfo["Surname"]}`
        ]);
      
        console.log(clientInfo)
      });
    }
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
    const calculatedPrice = numGolfers * feeForDay +
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
}, [numGolfers, numCaddies, numGolfCarts, numFoodDrinks, numNonPlayers, setBookingDetails, golferList]);


  const handleNumGolfersChange = (change: number) => {
    setNumGolfers((prev) => Math.min(4, Math.max(1, prev + change)));
  };

  const handleNonPlayerChange = (change: number) => {
    setNonPlayers((prev) => Math.max(0, prev + change));
  };

  const handleServiceChange = (service: "caddies" | "golfCarts" | "foodDrinks", change: number) => {
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

  const dayOfWeek = convertExcelDateToJSDate(bookingDetails.teeDate)
  .toLocaleDateString('en-US', { weekday: 'long' }) as keyof typeof golfFees;

  var feeForDay = golfFees[dayOfWeek];
  if (bookingDetails.bookingType == 2){
    feeForDay = golfFees18Hole[dayOfWeek];
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Booking Details</h1>

      {/* Golfers */}
      <div className="flex justify-between items-center bg-gray-100 p-3 px-4 rounded-lg ">
        <span className="text-medium flex items-center gap-2">
          <Icon icon="mdi-golf" />
          Golfers - {feeForDay} THB
        </span>
        <div className="flex items-center space-x-3">
          <button
            className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
            onClick={() => handleRemoveGolfer()}
            disabled={numGolfers === 1}
          >
            <Icon icon="mdi-minus" />
          </button>
          <span className="text-medium w-6 text-center">{numGolfers}</span>
          <button
            className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
            onClick={() => setGolferModalOpen(true)}
          >
            <Icon icon="mdi-plus" />
          </button>
        </div>
      </div>

      {/* Golfers List as Tags */}
      <div className="mt-2">
        <div className="flex flex-wrap gap-2">
          {golferList.length === 0 ? (
            <span className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm w-32 text-center">
              Loading Golfer
            </span>
          ) : (
            golferList.map((golfer, index) => (
              <span
                key={index}
                className="border border-green-700 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {golfer}
              </span>
            ))
          )}
        </div>
      </div>

      {/* New Golfer Modal */}
      {isGolferModalOpen && (
        <Modal isOpen={isGolferModalOpen} onClose={() => setGolferModalOpen(false)}>
        <ModalContent className="max-w-sm mx-auto">
          <ModalHeader>Add New Golfer</ModalHeader>
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
              onClick={handleAddGolfer}
              className="bg-green-800 text-white"
            >
              Add Golfer
            </Button>
            <Button
              onClick={() => setGolferModalOpen(false)}
              className=""
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )}

      {/* Guests */}
      <div className="flex justify-between items-center bg-gray-100 p-3 px-4 rounded-lg my-4">
        <span className="text-medium flex items-center gap-2">
          <Icon icon="mdi-person" />
          Accompanying Persons - 100 THB
        </span>
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleNonPlayerChange(-1)}
              disabled={numNonPlayers === 1}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center">{numNonPlayers}</span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center "
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
        <div className="flex justify-between items-center bg-gray-100 p-3 px-4 rounded-lg">
          <span className="text-medium flex items-center gap-2">
            <Icon icon="mdi-backpack" />
            Caddies - 300 THB
          </span>
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleServiceChange("caddies", -1)}
              disabled={numCaddies === 0}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center">{numCaddies}</span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleServiceChange("caddies", 1)}
            >
              <Icon icon="mdi-plus" />
            </button>
          </div>
        </div>

        {/* Golf Cart */}
        <div className="flex justify-between items-center bg-gray-100 p-3 px-4 rounded-lg">
          <span className="text-medium flex items-center gap-2">
            <Icon icon="mdi-car" />
            Golf Cart - 500 THB
          </span>
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleServiceChange("golfCarts", -1)}
              disabled={numGolfCarts === numGolfers}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center">{numGolfCarts}</span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleServiceChange("golfCarts", 1)}
            >
              <Icon icon="mdi-plus" />
            </button>
          </div>
        </div>

        {/* Food & Drinks */}
        <div className="flex justify-between items-center bg-gray-100 p-3 px-4 rounded-lg">
          <span className="text-medium flex items-center gap-2">
            <Icon icon="mdi-food" />
            Food & Drinks - 300 THB
          </span>
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleServiceChange("foodDrinks", -1)}
              disabled={numFoodDrinks === 0}
            >
              <Icon icon="mdi-minus" />
            </button>
            <span className="text-medium w-6 text-center">{numFoodDrinks}</span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleServiceChange("foodDrinks", 1)}
            >
              <Icon icon="mdi-plus" />
            </button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="mt-3 text-lg text-right">
        Total: {totalPrice} THB
      </div>

      <NextButton />
    </div>
  );
};

export default OtherServicesPage;
