/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@heroui/button";

// Placeholder images
const membershipImage =
  "https://media.istockphoto.com/id/1184365682/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A1%E0%B8%B8%E0%B8%A1%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%99%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B8%B2%E0%B8%A1.jpg?s=1024x1024&w=is&k=20&c=CM0TXIFzZrQP6FQCgbZBdC6ezgbl7gLwgl-uFINLBWg=";

export default function MembershipPage() {
  const [selectedMembership, setSelectedMembership] = useState<string>("");

  const handleMembershipChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMembership(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-6">
      {/* Section for introduction */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">Become a Member</h2>
        <p>
          Join our exclusive golf club and enjoy special privileges, including
          discounted tee times, access to private events, and much more.
        </p>
      </div>

      {/* Membership Options */}
      <div className="text-center mb-8">
        <img
          src={membershipImage}
          alt="Membership"
          className="w-72 h-48 object-cover mb-4"
        />
        <h3 className="text-xl font-semibold">Choose Your Membership</h3>
        <select
          className="mt-4 p-2 border rounded"
          value={selectedMembership}
          onChange={handleMembershipChange}
        >
          <option value="">Select Membership</option>
          <option value="basic">Basic Membership - $500/year</option>
          <option value="premium">Premium Membership - $1000/year</option>
          <option value="vip">VIP Membership - $2000/year</option>
        </select>
      </div>

      {/* Register Button */}
      {selectedMembership && (
        <Link href="/menu">
          <Button variant="solid" className="flex items-center gap-2">
            <span>Register Now</span>
            <Icon icon="mdi:arrow-right" />
          </Button>
        </Link>
      )}

      {/* Link to learn more */}

      <Link href="/menu">
        <Button variant="solid" className="flex items-center gap-2">
          <span>Learn More About Membership Benefits</span>
          <Icon icon="mdi:arrow-right" />
        </Button>
      </Link>
    </div>
  );
}
