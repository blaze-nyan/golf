import React from 'react';
import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import Link from 'next/link';

// Function to format date
const formatDate = (date: any) => {
  if (!date || date === 0) return "N/A";
  return new Date(date).toLocaleDateString();
};

interface Membership {
    membershipID: number;
    membershipTypeDescription?: string;
    memberNumber?: string;
    membershipStateDescription?: string;
    membershipTierDescription?: string;
    joinDate: number;
    expiryDate: number;
    priority?: string;
  }

  interface MembershipInfoListProps {
    membershipsList: Membership[];
  }

// MembershipInfoList component
const MembershipInfoList: React.FC<MembershipInfoListProps> = ({ membershipsList }) => {
  return (
    <Card className="md:col-span-3 p-5">
      <CardHeader>
        <h3 className="text-lg font-semibold">Membership Information</h3>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto max-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-3 md:grid-cols-8 gap-4 font-semibold text-gray-700 bg-gray-100 p-3 rounded-md shadow-sm">
            <div className="text-sm">Membership ID</div>
            <div className="text-sm hidden md:block">Membership Type</div>
            <div className="text-sm">Membership Number</div>
            <div className="text-sm">State</div>
            <div className="text-sm hidden md:block">Tier</div>
            <div className="text-sm hidden md:block">Join Date</div>
            <div className="text-sm hidden md:block">Expiry Date</div>
            <div className="text-sm hidden md:block">Priority</div>
          </div>

          {/* Membership Data Rows or No Data Message */}
          {membershipsList.length === 0 ? (
            <>
              <div className="text-center text-gray-500 py-5">No Membership Available</div>
              <div className="text-center">
                <Link href="/membership">
                  <Button color="primary">Go to Memberships</Button>
                </Link>
              </div>
            </>
          ) : (
            membershipsList.map((membership: any, index: any) => (
              <div
                key={index}
                className="grid grid-cols-3 md:grid-cols-6 gap-4 p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-300 rounded-lg"
              >
                <div className="text-sm text-gray-800">{membership.membershipID}</div>
                <div className="text-sm text-gray-600 hidden md:block">{membership.membershipTypeDescription || "N/A"}</div>
                <div className="text-sm text-gray-600">{membership.memberNumber || "N/A"}</div>
                <div className="text-sm text-gray-600">{membership.membershipStateDescription || "N/A"}</div>
                <div className="text-sm text-gray-600 hidden md:block">{membership.membershipTierDescription || "N/A"}</div>
                <div className="text-sm text-gray-600 hidden md:block">{formatDate(membership.joinDate)}</div>
                <div className="text-sm text-gray-600 hidden md:block">{formatDate(membership.expiryDate)}</div>
                <div className="text-sm text-gray-600 hidden md:block">{membership.priority || "N/A"}</div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MembershipInfoList;
