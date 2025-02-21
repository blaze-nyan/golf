"use client";

import React, { useState } from "react";
import { NextButton } from "@/app/golfcourse/components/NextButton";
import { Icon } from "@iconify/react/dist/iconify.js";

const services = [
  { id: 1, name: "Caddie", price: 500, icon: "mdi-person" },
  { id: 2, name: "Golf Cart", price: 800, icon: "mdi-car" },
  { id: 3, name: "Food & Drinks", price: 300,  icon: "mdi-food" },
];

const OtherServicesPage = () => {
  const [numGolfers, setNumGolfers] = useState(1); // Default to 1 golfer
  const [selectedServices, setSelectedServices] = useState(
    services.reduce((acc, service) => {
      acc[service.id] = service.id === 2 ? 1 : 0; // Golf Cart starts at 1
      return acc;
    }, {} as Record<number, number>)
  );

  // Update Golf Cart count automatically based on golfers
  const handleNumGolfersChange = (change: number) => {
    setNumGolfers((prev) => Math.min(4, Math.max(1, prev + change))); // Ensure 1 to 4 golfers
    setSelectedServices((prev) => ({
      ...prev,
      2: Math.max(1, Math.min(4, prev[2] + change)), // Ensure at least 1 cart, matches golfers
    }));
  };

  const handleQuantityChange = (id: number, change: number) => {
    setSelectedServices((prev) => ({
      ...prev,
      [id]: Math.max(id === 2 ? numGolfers : 0, prev[id] + change), // Golf Carts >= golfers
    }));
  };

  const totalPrice =
    numGolfers * 1000 + // Base price per golfer
    services.reduce(
      (sum, service) => sum + service.price * selectedServices[service.id],
      0
    );

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Booking Details</h1>

      {/* Services List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-100 p-3 px-4 rounded-lg">
          <span className="text-medium flex items-center gap-2">
            <Icon icon="mdi-golf" />
            Golfers - (4 Maximum)
          </span>
          <div className="flex items-center space-x-3">
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleNumGolfersChange(-1)}
              disabled={numGolfers === 1}
            >
                <Icon icon="mdi-minus"></Icon>
            </button>
            <span className="text-medium w-6 text-center">
              {numGolfers}
            </span>
            <button
              className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
              onClick={() => handleNumGolfersChange(1)}
              disabled={numGolfers === 4}
            >
                <Icon icon="mdi-plus"></Icon>
            </button>
          </div>
        </div>
        {services.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center bg-gray-100 p-3 px-4 rounded-lg"
          >
            <span className="text-medium">
              <span className="text-medium flex items-center gap-2">
                <Icon icon={service.icon} />
                {service.name} - {service.price} THB
              </span>
            </span>
            <div className="flex items-center space-x-3">
              <button
                className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
                onClick={() => handleQuantityChange(service.id, -1)}
                disabled={selectedServices[service.id] === (service.id === 2 ? numGolfers : 0)}
              >
                <Icon icon="mdi-minus"></Icon>
              </button>
              <span className="text-medium w-6 text-center">
                {selectedServices[service.id]}
              </span>
              <button
                className="px-3 py-1 rounded-lg text-xl bg-white align-middle text-center"
                onClick={() => handleQuantityChange(service.id, 1)}
              >
                <Icon icon="mdi-plus"></Icon>
              </button>
            </div>
          </div>
        ))}
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