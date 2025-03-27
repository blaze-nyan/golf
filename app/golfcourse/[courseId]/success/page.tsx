/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button, Card } from "@heroui/react";
import { useProgress } from "../../context/progress-context";
import { Icon } from "@iconify/react/dist/iconify.js";
import Confetti from "react-confetti";
import {
  dateToString,
  convertMinutesToTimeWithAMPM,
  convertExcelDateToJSDate,
} from "../../../components/date-functionalities";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { motion } from "framer-motion";
import Barcode from "react-barcode";

const page = () => {
  const { bookingDetails, currentStep } = useProgress();
  const router = useRouter();
  const { t } = useLanguage();

  // State for triggering confetti and window dimensions
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0,
  });

  // Generate a random 6-digit booking ID if none exists
  const generateBookingId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Get a consistent booking ID for this session
  const [bookingId] = useState(bookingDetails.id || generateBookingId());

  // Add loading state for the profile button
  const [isNavigatingToProfile, setIsNavigatingToProfile] = useState(false);

  const goToProfile = () => {
    setIsNavigatingToProfile(true);
    router.push("/profile");
  };

  const detectSize = () => {
    if (typeof window !== "undefined") {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  };

  useEffect(() => {
    // Initialize window dimensions
    detectSize();

    // Set up window resize listener for responsive confetti
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, []);

  useEffect(() => {
    // Trigger the confetti effect once the page has successfully loaded
    setShowConfetti(true);

    // Optionally, stop the confetti after a few seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Stop after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Prevent browser back button
  useEffect(() => {
    const handleBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
      router.replace(`/golfcourse/${bookingDetails.courseId}`);
    };

    window.addEventListener("popstate", handleBackNavigation);
    window.history.pushState(null, "", window.location.href);

    const intervalId = setInterval(() => {
      window.history.pushState(null, "", window.location.href);
    }, 300);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
      clearInterval(intervalId);
    };
  }, [router, bookingDetails.courseId]);

  const handlePrint = () => {
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;

    // Add a class to the ticket element to highlight it before printing
    const ticketElement = document.querySelector(".card-to-print");
    if (ticketElement) {
      // For mobile, make sure we're scrolled to see the ticket
      ticketElement.scrollIntoView({ behavior: "auto", block: "start" });

      // Add a highlight class temporarily
      ticketElement.classList.add("printing-highlight");

      // Remove it after a short delay
      setTimeout(() => {
        ticketElement.classList.remove("printing-highlight");
      }, 1000);
    }

    // Apply print-specific class to body
    document.body.classList.add("printing-eticket");

    // Mobile-specific optimizations
    let metaTag: HTMLMetaElement | null = null;
    if (isMobile) {
      // Create and add meta viewport tag for better mobile printing
      metaTag = document.createElement("meta");
      metaTag.name = "viewport";
      metaTag.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
      document.head.appendChild(metaTag);

      // For mobile, add extra delay to ensure layout is ready
      setTimeout(() => {
        window.print();

        // Remove classes and meta tag after printing
        setTimeout(() => {
          document.body.classList.remove("printing-eticket");
          if (metaTag) {
            document.head.removeChild(metaTag);
          }
        }, 800);
      }, 300);
    } else {
      // For desktop, shorter delay is fine
      setTimeout(() => {
        window.print();

        // Remove the class after printing
        setTimeout(() => {
          document.body.classList.remove("printing-eticket");
        }, 500);
      }, 100);
    }
  };

  // Add print styles
  useEffect(() => {
    // Add a style tag for print styles
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        /* Reset page margins and add some spacing around the ticket */
        @page {
          margin: 10mm; /* Add margin around the printed page */
          size: auto;
        }
        
        /* Hide everything by default */
        body * {
          visibility: hidden;
        }
        
        /* Create a clean slate for our ticket */
        body {
          background-color: white !important;
          height: auto !important;
          overflow: visible !important;
        }
        
        /* Show only the ticket and its contents */
        .card-to-print, .card-to-print * {
          visibility: visible !important;
        }
        
        /* Mobile-specific print styling */
        @media screen and (max-width: 768px) {
          /* Position the ticket for mobile printing - maintain vertical layout */
          .card-to-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: calc(100% - 20mm) !important;
            height: auto !important;
            margin: 10mm !important;
            box-shadow: none !important;
            border-radius: 10px !important;
            overflow: visible !important;
            transform: none !important;
          }
          
          /* Ensure the mobile layout is preserved when printing */
          .md\\:flex {
            display: block !important;
          }
          
          .md\\:w-1\\/3, .md\\:w-2\\/3 {
            width: 100% !important;
          }
          
          /* Ensure the barcode is clearly visible */
          .bg-white.rounded-lg.p-3.py-4 svg {
            transform: scale(1.3) !important;
            margin: 15px auto !important;
          }
        }
        
        /* Desktop-specific print styling */
        @media screen and (min-width: 769px) {
          /* Position the ticket correctly for printing */
          .card-to-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: calc(100% - 20mm) !important;
            height: auto !important;
            margin: 10mm !important;
            box-shadow: none !important;
            overflow: visible !important;
            border-radius: 10px;
          }
          
          /* Preserve horizontal layout on desktop */
          .md\\:flex {
            display: flex !important;
          }
          
          .md\\:w-1\\/3 {
            width: 33.333333% !important;
          }
          
          .md\\:w-2\\/3 {
            width: 66.666667% !important;
          }
        }
        
        /* Preserve the color scheme and styling for both */
        .bg-gradient-to-r.from-green-700.to-green-600 {
          background: linear-gradient(to right, #15803d, #16a34a) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Keep colors the same on both layouts */
        .text-white {
          color: white !important;
        }
        
        .text-green-600, .dark\\:text-green-400 {
          color: #16a34a !important;
        }
        
        .text-gray-700, .dark\\:text-gray-300 {
          color: #374151 !important;
        }
        
        .text-gray-900, .dark\\:text-gray-100 {
          color: #111827 !important;
        }
        
        /* Other existing styles remain unchanged */
        .opacity-80 {
          opacity: 0.8 !important;
        }
        
        /* Preserve background colors */
        .bg-white, .dark\\:bg-gray-800 {
          background-color: white !important;
        }
        
        .bg-gray-50, .dark\\:bg-gray-700\\/30 {
          background-color: #f9fafb !important;
        }
        
        .bg-green-50, .dark\\:bg-green-900\\/30 {
          background-color: #f0fdf4 !important;
        }
        
        .bg-white\\/20 {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .bg-white\\/10 {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Hide buttons and decorative elements */
        button, .print\\:hidden {
          display: none !important;
        }
        
        /* Ensure SVGs print properly */
        svg {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }

      /* Special class for print preparation */
      body.printing-eticket {
        height: auto !important;
        overflow: visible !important;
      }

      body.printing-eticket .card-to-print {
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen w-full py-8 px-4 flex flex-col items-center justify-center md:justify-normal bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="print:hidden">
          <Confetti
            width={windowDimension.width}
            height={windowDimension.height}
            gravity={0.2}
            numberOfPieces={windowDimension.width < 768 ? 80 : 150}
            recycle={false}
            initialVelocityX={5}
            initialVelocityY={20}
            confettiSource={{
              x: 0,
              y: windowDimension.height,
              w: windowDimension.width,
              h: 0,
            }}
          />
        </div>
      )}

      {/* E-Ticket Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-full lg:max-w-5xl relative"
      >
        {/* The ticket */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/30 rounded-lg overflow-hidden border-0 relative card-to-print">
          {/* Switch to horizontal layout on larger screens */}
          <div className="md:flex md:flex-row">
            {/* Left section for header - vertical on mobile, side column on larger screens */}
            <div className="relative bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-600 text-white py-6 px-4 md:w-1/3 md:flex md:flex-col">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Icon icon="mdi-golf" className="text-2xl" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">{t("eTicket")}</div>
                    <div className="text-xl font-bold">{t("golfBooking")}</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 md:mt-4">
                  <Icon icon="mdi-check-decagram" className="text-green-300" />
                  <span className="text-sm font-medium">{t("confirmed")}</span>
                </div>
              </div>

              {/* Course name highlighted */}
              <div className="text-2xl font-bold mb-1">
                {bookingDetails.courseName || t("courseName")}
              </div>
              <div className="text-sm opacity-80 mb-2">
                {bookingDetails.courseLocation || t("notAvailable")}
              </div>

              {/* Date & time moved to side column on larger screens */}
              <div className="hidden md:block md:bg-white/10 md:rounded-lg md:p-4 md:mt-auto md:mb-4">
                <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
                  {t("dateAndTime")}
                </div>
                <div className="text-xl font-bold">
                  {bookingDetails.teeDate
                    ? dateToString(
                        convertExcelDateToJSDate(bookingDetails.teeDate)
                      )
                    : t("select")}
                </div>
                <div className="text-lg">
                  {bookingDetails.teeTime
                    ? convertMinutesToTimeWithAMPM(bookingDetails.teeTime)
                    : t("select")}
                </div>
              </div>

              {/* Reference number in side column */}
              <div className="hidden md:block md:mt-4">
                <div className="text-xs uppercase tracking-wide opacity-80">
                  {t("bookingReference")}
                </div>
                <div className="font-mono font-bold text-lg">#{bookingId}</div>
              </div>

              {/* Payment type badge - NEW */}
              <div className="hidden md:flex md:mt-4 md:items-center md:gap-2">
                <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
                  <Icon icon="mdi-cash-check" className="inline-block mr-1" />
                  {bookingDetails.paymentType === "prepayment"
                    ? t("prepayment")
                    : t("fullPayment")}
                </div>
              </div>

              {/* Decorative hole punches for vertical mobile design */}
              <div className="md:hidden absolute -bottom-1 left-0 right-0 h-2">
                <svg
                  viewBox="0 0 100 5"
                  className="w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 L2.5,2 L5,0 L7.5,2 L10,0 L12.5,2 L15,0 L17.5,2 L20,0 L22.5,2 L25,0 L27.5,2 L30,0 L32.5,2 L35,0 L37.5,2 L40,0 L42.5,2 L45,0 L47.5,2 L50,0 L52.5,2 L55,0 L57.5,2 L60,0 L62.5,2 L65,0 L67.5,2 L70,0 L72.5,2 L75,0 L77.5,2 L80,0 L82.5,2 L85,0 L87.5,2 L90,0 L92.5,2 L95,0 L97.5,2 L100,0 V5 H0 Z"
                    fill="white"
                    className="dark:fill-gray-800"
                  />
                </svg>
              </div>

              {/* Decorative hole punches for horizontal tablet/desktop design */}
              <div className="hidden md:block absolute -right-2.5 top-1/4 w-5 h-5 bg-gray-50 dark:bg-gray-900 rounded-full"></div>
              <div className="hidden md:block absolute -right-2.5 top-2/4 w-5 h-5 bg-gray-50 dark:bg-gray-900 rounded-full"></div>
              <div className="hidden md:block absolute -right-2.5 top-3/4 w-5 h-5 bg-gray-50 dark:bg-gray-900 rounded-full"></div>
            </div>

            {/* Right section for booking details - main content */}
            <div className="p-5 space-y-4 md:w-2/3 md:flex md:flex-col">
              {/* Prominent booking reference & payment type - only show on mobile */}
              <div className="flex justify-between items-center md:hidden">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t("bookingReference")}
                  </div>
                  <div className="font-mono font-bold text-lg text-gray-900 dark:text-gray-100">
                    #{bookingId}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full text-green-700 dark:text-green-400 font-medium text-sm">
                    {bookingDetails.price
                      ? `${bookingDetails.price} ${t("thb")}`
                      : t("notAvailable")}
                  </div>

                  {/* Payment type badge - NEW - Mobile version */}
                  <div className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 text-gray-700 dark:text-gray-300">
                    {bookingDetails.paymentType === "prepayment"
                      ? t("prepayment")
                      : t("fullPayment")}
                  </div>
                </div>
              </div>

              {/* Date & time highlighted - mobile only */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 my-4 flex items-center gap-4 md:hidden">
                <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm">
                  <Icon
                    icon="mdi-calendar-clock"
                    className="text-2xl text-green-600 dark:text-green-400"
                  />
                </div>

                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {bookingDetails.teeDate
                      ? dateToString(
                          convertExcelDateToJSDate(bookingDetails.teeDate)
                        )
                      : t("select")}
                  </div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {bookingDetails.teeTime
                      ? convertMinutesToTimeWithAMPM(bookingDetails.teeTime)
                      : t("select")}
                  </div>
                </div>
              </div>

              {/* Price and payment type visible on larger screens */}
              <div className="hidden md:flex md:justify-between md:items-center md:mb-2">
                <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {bookingDetails.paymentType === "prepayment"
                    ? t("prepaymentNote")
                    : t("fullPaymentNote")}
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full text-green-700 dark:text-green-400 font-medium text-lg">
                  {bookingDetails.price
                    ? `${bookingDetails.price} ${t("thb")}`
                    : t("notAvailable")}
                </div>
              </div>

              {/* Booking details grid - Adjusted for tablet/desktop with Food & Drinks */}
              <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-3 md:gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    {t("type")}
                  </div>
                  <div className="font-medium flex items-center gap-1">
                    <Icon
                      icon="mdi-golf"
                      className="text-green-600 dark:text-green-400"
                    />
                    {bookingDetails.bookingType === 1
                      ? t("nineHole")
                      : t("eighteenHole")}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    {t("golfers")}
                  </div>
                  <div className="font-medium flex items-center gap-1">
                    <Icon
                      icon="mdi-account-group"
                      className="text-green-600 dark:text-green-400"
                    />
                    {bookingDetails.numberOfGolfers || 0}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    {t("caddies")}
                  </div>
                  <div className="font-medium flex items-center gap-1">
                    <Icon
                      icon="mdi-human-dolly"
                      className="text-green-600 dark:text-green-400"
                    />
                    {bookingDetails["Caddies"] || 0}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    {t("carts")}
                  </div>
                  <div className="font-medium flex items-center gap-1">
                    <Icon
                      icon="mdi-golf-cart"
                      className="text-green-600 dark:text-green-400"
                    />
                    {bookingDetails["Golf Cart"] || 0}
                  </div>
                </div>

                {/* NEW - Food & Drinks */}
                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    {t("foodAndDrinks")}
                  </div>
                  <div className="font-medium flex items-center gap-1">
                    <Icon
                      icon="mdi-food-fork-drink"
                      className="text-green-600 dark:text-green-400"
                    />
                    {bookingDetails["Food & Drinks"] || 0}
                  </div>
                </div>

                {/* Guests */}
                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    {t("guests")}
                  </div>
                  <div className="font-medium flex items-center gap-1">
                    <Icon
                      icon="mdi-account"
                      className="text-green-600 dark:text-green-400"
                    />
                    {bookingDetails.numberOfnonPlayers || 0}
                  </div>
                </div>
              </div>

              {/* Barcode section - Updated with wider barcode */}
              <div className="border-t border-dashed border-gray-200 bg-white rounded-md dark:border-gray-700 pt-4">
                <div className="text-center mb-4">
                  <div className="text-sm uppercase tracking-wide text-gray-600 dark:text-black font-medium mb-1">
                    {t("scanForETicket")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {t("eTicketRequiredAtReception")}
                  </div>
                </div>

                {/* Enhanced barcode - wider and more prominent */}
                <div className="bg-white rounded-lg p-3 py-4 shadow-sm mb-2 flex justify-center">
                  <Barcode
                    value={`GOLF-${bookingId}`}
                    height={60}
                    width={2} // Increased width for better readability
                    margin={10}
                    background="white"
                    lineColor="#000000"
                    displayValue={true} // Show the value below the barcode
                    fontSize={12}
                    textAlign="center"
                    textPosition="bottom"
                    textMargin={6}
                  />
                </div>

                {/* <div className="font-mono text-xs text-center text-gray-500 dark:text-gray-400">
                  {t("bookingId")}: #{bookingId}
                </div> */}
              </div>

              {/* Actions - Different layout on larger screens */}
              <div className="mt-6 grid grid-cols-2 gap-3 md:flex md:justify-end md:gap-4 md:mt-auto">
                <Button
                  className="bg-white border border-green-600 text-green-700 dark:bg-gray-700 dark:border-green-500 dark:text-green-400 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2 print:hidden"
                  onPress={handlePrint}
                >
                  <Icon icon="mdi-printer" />
                  {t("printETicket")}
                </Button>

                <Button
                  className="bg-green-600 text-white dark:bg-green-700 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
                  onPress={goToProfile}
                  isDisabled={isNavigatingToProfile}
                >
                  {isNavigatingToProfile ? (
                    <>
                      <Icon icon="mdi-loading" className="animate-spin" />
                      {t("loading")}...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi-account" />
                      {t("myBookings")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer with additional info */}
          {/* <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
            <p>{t("eTicketInstruction")}</p>
            <p className="mt-1">
              <Icon
                icon="mdi-information-outline"
                className="inline-block mr-1"
              />
              {t("arriveEarly")}
            </p>
          </div> */}
        </Card>
      </motion.div>
    </div>
  );
};

export default page;
