"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { WeatherWidget } from "./weather/weather-widget";
import Link from "next/link";
import { Button } from "@heroui/button";
import { useTheme } from "next-themes";

interface DayForecast {
  day: string;
  temp: number;
  condition: string;
}

const Hero: React.FC = () => {
  // State for theme/hydration
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Create refs for animating elements
  const heroSectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaIconRef = useRef<HTMLSpanElement>(null);
  const weatherWidgetRef = useRef<HTMLElement>(null);
  const forecastHeadingRef = useRef<HTMLHeadingElement>(null);
  const dayCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Weather forecast data - simplified generation
  const weekForecast: DayForecast[] = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    temp: Math.floor(18 + Math.random() * 7),
    condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][
      Math.floor(Math.random() * 4)
    ],
  }));

  // Handle hydration properly
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load GSAP only on client side when component is mounted
  useEffect(() => {
    if (!mounted) return;

    // Dynamic import of GSAP
    const loadGsap = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default || gsapModule;

      // Simple fade-in animation for main elements instead of complex animations
      const elements = [
        headingRef.current,
        ctaRef.current,
        weatherWidgetRef.current,
        forecastHeadingRef.current,
        ...dayCardsRef.current.filter(Boolean),
      ];

      // Simple staggered fade-in
      elements.forEach((el, index) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.1 * index,
            ease: "power2.out",
          }
        );
      });

      // Simple animation for CTA icon - uses less CPU
      if (ctaIconRef.current) {
        gsap.to(ctaIconRef.current, {
          x: 5,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    };

    loadGsap();

    // No need for complex scroll animations or expensive listeners
  }, [mounted]);

  // Add a day card to the refs array
  const addToDayCardRefs = (el: HTMLDivElement | null) => {
    if (el && !dayCardsRef.current.includes(el)) {
      dayCardsRef.current.push(el);
    }
  };

  const headingText = "Always Ready Just Like Your Best Swing";

  // Return empty div if not mounted yet to prevent hydration mismatch
  if (!mounted) {
    return <div className="h-screen"></div>;
  }

  return (
    <main
      ref={heroSectionRef}
      className="container mx-auto flex flex-1 flex-col items-center overflow-x-auto px-4 sm:px-8 py-6 sm:py-10"
    >
      <section className="z-20 flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-3xl">
        <div
          ref={headingRef}
          className={`text-center text-xl sm:text-3xl md:text-4xl font-bold leading-[1.2] tracking-tighter sm:w-full w-[300px] ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent"
          }`}
        >
          {/* Use a simpler heading without character-by-character animation */}
          <span>{headingText}</span>
        </div>

        <p className="text-center font-normal text-base sm:text-lg leading-6 sm:leading-7 text-gray-700 dark:text-gray-300 max-w-[466px] px-6">
          Streamline your golf experience with Splash Golf Club&apos;s intuitive
          online booking platform. Enjoy real-time tee time availability, secure
          member access, and a hassle-free reservation process.
        </p>

        <div className="flex justify-center space-x-6">
        <div>
        <Button
          as={Link}
          href="https://expo.dev/artifacts/eas/9gjPVcdPatFjFxf9fJC3rV.apk"
          variant="light"
          className="relative text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-500 transition-all duration-300 
          after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full focus:after:w-full active:scale-95"
          >
          Get Our App
        </Button>
        </div>
        <div ref={ctaRef}>
          <Button
            as={Link}
            href="/golfcourse"
            color="primary"
            className={`relative overflow-hidden px-6 py-3 shadow-lg rounded-full transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            }`}
            endContent={
              <span
                ref={ctaIconRef}
                className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full ml-1"
              >
                <Icon
                  className="text-white [&>path]:stroke-[1.5]"
                  icon="solar:arrow-right-linear"
                  width={20}
                />
              </span>
            }
          >
            Book a Tee Time
          </Button>
        </div>
        </div>

      </section>

      {/* Weather Section */}
      <section
        ref={weatherWidgetRef as React.RefObject<HTMLElement>}
        className="mt-8 sm:mt-10 w-full max-w-md flex items-center justify-center"
      >
        <WeatherWidget />
      </section>

      {/* Next Week's Weather Forecast Section */}
      <section className="text-center w-full max-w-4xl mx-auto mt-8 sm:mt-10 px-4">
        <h2
          ref={forecastHeadingRef}
          className={`text-xl sm:text-2xl font-semibold ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          }`}
        >
          Plan Your Week Ahead on the Course
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2 sm:mt-3 mx-auto">
          Stay updated with the weather forecast for the next week.
        </p>

        <div className="mt-4 sm:mt-6 pb-4">
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4 px-4 py-2 sm:justify-center">
            {weekForecast.map((day, index) => (
              <div
                key={day.day}
                ref={addToDayCardRefs}
                className={`
                  bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 
                  rounded-lg shadow-md
                  p-3 sm:p-4 
                  transition-all duration-300
                  ${index === 0 ? "border-l-green-500 border-l-4" : ""}
                `}
              >
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {day.day}
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  {day.temp}°C
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {day.condition}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
};

export default Hero;
