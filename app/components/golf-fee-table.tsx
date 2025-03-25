"use client";

import { useLanguage } from "../contexts/LanguageContext";

export const golfFees = {
  Monday: 400,
  Tuesday: 400,
  Wednesday: 400,
  Thursday: 400,
  Friday: 500,
  Saturday: 600,
  Sunday: 600,
};

export const golfFees18Hole = {
  Monday: 700, // Example price for 18 hole
  Tuesday: 700,
  Wednesday: 700,
  Thursday: 700,
  Friday: 800,
  Saturday: 900,
  Sunday: 900,
};

const GolfFeesTable = () => {
  const { t } = useLanguage();
  const tableData9Hole = Object.entries(golfFees); // Convert the object to an array of key-value pairs for 9 hole
  const tableData18Hole = Object.entries(golfFees18Hole); // Convert the object to an array of key-value pairs for 18 hole

  return (
    <div className="overflow-x-auto py-4 price">
      {/* 9-Hole Table */}
      <div className="mb-8">
        <h2 className="text-lg mb-2">{t("nineHoleCourseTitle")}</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center border-b"> </th>
              {tableData9Hole.map(([day], index) => (
                <th key={index} className="px-4 py-2 text-center border-b">
                  {t(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-center border-b">{t("feeTHB")}</td>
              {tableData9Hole.map(([_, fee], index) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                _;
                return (
                  <td key={index} className="px-4 py-2 text-center border-b">
                    {fee}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 18-Hole Table */}
      <div>
        <h2 className="text-lg mb-2">{t("eighteenHoleCourseTitle")}</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center border-b"> </th>
              {tableData18Hole.map(([day], index) => (
                <th key={index} className="px-4 py-2 text-center border-b">
                  {t(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-center border-b">{t("feeTHB")}</td>
              {tableData18Hole.map(([_, fee], index) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                _;
                return (
                  <td key={index} className="px-4 py-2 text-center border-b">
                    {fee}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GolfFeesTable;
