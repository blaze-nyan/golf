/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";

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
const MembershipInfoList: React.FC<MembershipInfoListProps> = ({
  membershipsList,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="md:col-span-3 p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm box-border outline-none">
      <CardHeader>
        <h3 className="text-lg font-semibold">{t("membershipInformation")}</h3>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto max-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-3 md:grid-cols-8 gap-4 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow-sm">
            <div className="text-sm">{t("membershipID")}</div>
            <div className="text-sm hidden md:block">{t("membershipType")}</div>
            <div className="text-sm">{t("membershipNumber")}</div>
            <div className="text-sm">{t("state")}</div>
            <div className="text-sm hidden md:block">{t("tier")}</div>
            <div className="text-sm hidden md:block">{t("joinDate")}</div>
            <div className="text-sm hidden md:block">{t("expiryDate")}</div>
            <div className="text-sm hidden md:block">{t("priority")}</div>
          </div>

          {/* Membership Data Rows or No Data Message */}
          {membershipsList.length === 0 ? (
            <>
              <div className="text-center text-gray-500 py-5">
                {t("noMembershipAvailable")}
              </div>
              <div className="text-center">
                <Button as={Link} href="/membership" color="primary">
                  {t("goToMemberships")}
                </Button>
              </div>
            </>
          ) : (
            membershipsList.map((membership: any, index: any) => (
              <div
                key={index}
                className="grid grid-cols-3 md:grid-cols-6 gap-4 p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-300 rounded-lg"
              >
                <div className="text-sm text-gray-800">
                  {membership.membershipID}
                </div>
                <div className="text-sm text-gray-600 hidden md:block">
                  {membership.membershipTypeDescription || t("na")}
                </div>
                <div className="text-sm text-gray-600">
                  {membership.memberNumber || t("na")}
                </div>
                <div className="text-sm text-gray-600">
                  {membership.membershipStateDescription || t("na")}
                </div>
                <div className="text-sm text-gray-600 hidden md:block">
                  {membership.membershipTierDescription || t("na")}
                </div>
                <div className="text-sm text-gray-600 hidden md:block">
                  {formatDate(membership.joinDate)}
                </div>
                <div className="text-sm text-gray-600 hidden md:block">
                  {formatDate(membership.expiryDate)}
                </div>
                <div className="text-sm text-gray-600 hidden md:block">
                  {membership.priority || t("na")}
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MembershipInfoList;
