"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { WeatherWidget } from "./weather/weather-widget";
import Link from "next/link";
import { Button } from "@heroui/button";
import gsap from "gsap";
import { useTheme } from "next-themes";

interface DayForecast {
  day: string;
  temp: number;
  condition: string;
}

const Hero: React.FC = () => {
  // State for theme/hydration
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  // Create refs for animating elements
  const heroSectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingCharRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaIconRef = useRef<HTMLSpanElement>(null);
  const weatherWidgetRef = useRef<HTMLElement>(null);
  const forecastSectionRef = useRef<HTMLElement>(null);
  const forecastHeadingRef = useRef<HTMLHeadingElement>(null);
  const forecastDescRef = useRef<HTMLParagraphElement>(null);
  const dayCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation timeline ref
  const mainTl = useRef<gsap.core.Timeline | null>(null);

  // Weather forecast data
  const weekForecast: DayForecast[] = [
    {
      day: "Mon",
      temp: Math.floor(18 + Math.random() * 7),
      condition: "Sunny",
    },
    {
      day: "Tue",
      temp: Math.floor(18 + Math.random() * 7),
      condition: "Cloudy",
    },
    {
      day: "Wed",
      temp: Math.floor(18 + Math.random() * 7),
      condition: "Rainy",
    },
    {
      day: "Thu",
      temp: Math.floor(18 + Math.random() * 7),
      condition: "Partly Cloudy",
    },
    {
      day: "Fri",
      temp: Math.floor(18 + Math.random() * 7),
      condition: "Sunny",
    },
    {
      day: "Sat",
      temp: Math.floor(18 + Math.random() * 7),
      condition: "Cloudy",
    },
    {
      day: "Sun",
      temp: Math.floor(18 + Math.random() * 7),
      condition: "Partly Cloudy",
    },
  ];

  // Handle hydration properly
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize animations
  useEffect(() => {
    if (!mounted) return;

    // Create master timeline
    mainTl.current = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: 0.5,
      },
    });

    // Text animation for heading by characters
    if (headingCharRefs.current.length > 0) {
      // Set initial state
      gsap.set(headingCharRefs.current, {
        opacity: 0,
        y: 30,
        rotationX: -45,
      });

      // Animate each character with a slight stagger
      mainTl.current.to(
        headingCharRefs.current,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.03,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        0
      );
    }

    // Description animation with reveal effect
    if (descriptionRef.current) {
      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 20,
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      });

      mainTl.current.to(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 0.6,
        },
        0.5
      );
    }

    // CTA button animation with pop and pulse
    if (ctaRef.current) {
      gsap.set(ctaRef.current, {
        opacity: 0,
        scale: 0.9,
      });

      mainTl.current.to(
        ctaRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        },
        0.7
      );

      // Subtle pulse animation for the CTA
      gsap.to(ctaRef.current, {
        scale: 1.03,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Arrow icon animation
    if (ctaIconRef.current) {
      gsap.to(ctaIconRef.current, {
        x: 5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    // Weather widget fade up
    if (weatherWidgetRef.current) {
      gsap.set(weatherWidgetRef.current, {
        opacity: 0,
        y: 30,
      });

      mainTl.current.to(
        weatherWidgetRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        0.8
      );
    }

    // Forecast section animations
    if (forecastSectionRef.current) {
      gsap.set(forecastSectionRef.current, {
        opacity: 0,
      });

      mainTl.current.to(
        forecastSectionRef.current,
        {
          opacity: 1,
          duration: 0.5,
        },
        0.9
      );
    }

    if (forecastHeadingRef.current) {
      gsap.set(forecastHeadingRef.current, {
        opacity: 0,
        y: 20,
      });

      mainTl.current.to(
        forecastHeadingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        1
      );
    }

    if (forecastDescRef.current) {
      gsap.set(forecastDescRef.current, {
        opacity: 0,
        y: 20,
      });

      mainTl.current.to(
        forecastDescRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        1.1
      );
    }

    // Day cards staggered entrance with bounce
    if (dayCardsRef.current.length > 0) {
      gsap.set(dayCardsRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.8,
      });

      mainTl.current.to(
        dayCardsRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.07,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        1.2
      );

      // Add hover animation for each card
      dayCardsRef.current.forEach((card) => {
        if (!card) return;

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            scale: 1.05,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            duration: 0.3,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            duration: 0.3,
          });
        });
      });
    }

    // Hover animations for the CTA button with ripple effect
    const ctaButton = ctaRef.current;
    if (ctaButton) {
      ctaButton.addEventListener("mouseenter", () => {
        gsap.to(ctaButton, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      ctaButton.addEventListener("mouseleave", () => {
        gsap.to(ctaButton, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }

    // Cleanup function
    return () => {
      if (mainTl.current) {
        mainTl.current.kill();
      }

      // Remove event listeners
      dayCardsRef.current.forEach((card) => {
        if (card) {
          card.removeEventListener("mouseenter", () => {});
          card.removeEventListener("mouseleave", () => {});
        }
      });

      if (ctaButton) {
        ctaButton.removeEventListener("mouseenter", () => {});
        ctaButton.removeEventListener("mouseleave", () => {});
      }
    };
  }, [mounted]);

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return;

    // Subtle animation for theme change
    const themeChangeAnimation = () => {
      // Animate the entire hero section to acknowledge theme change
      gsap.fromTo(
        heroSectionRef.current,
        { opacity: 0.7 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Add subtle transitions for key elements
      gsap.fromTo(
        [headingRef.current, forecastHeadingRef.current],
        { scale: 0.98 },
        { scale: 1, duration: 0.4, ease: "back.out(1.5)" }
      );
    };

    // Short delay to let theme changes complete
    const themeChangeTimeout = setTimeout(themeChangeAnimation, 50);

    return () => clearTimeout(themeChangeTimeout);
  }, [theme, resolvedTheme, mounted]);

  // Add a day card to the refs array
  const addToDayCardRefs = (el: HTMLDivElement | null) => {
    if (el && !dayCardsRef.current.includes(el)) {
      dayCardsRef.current.push(el);
    }
  };

  // Add a heading character span to the refs array
  const addToHeadingCharRefs = (el: HTMLSpanElement | null) => {
    if (el && !headingCharRefs.current.includes(el)) {
      headingCharRefs.current.push(el);
    }
  };

  // Split the heading text into characters
  const headingText = "Always Ready Just Like Your Best Swing";
  const headingChars = headingText.split("");

  // Return empty div if not mounted yet to prevent hydration mismatch
  if (!mounted) {
    return <div className="h-screen"></div>;
  }

  return (
    <main
      ref={heroSectionRef}
      className="container mx-auto flex flex-1 flex-col items-center overflow-hidden px-4 sm:px-8 py-6 sm:py-10"
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
          {/* Character by character for more advanced animation */}
          <span className="sr-only">
            Always Ready Just Like Your Best Swing
          </span>
          <span aria-hidden="true" className="inline-block">
            {headingChars.map((char, index) => (
              <span
                key={index}
                ref={addToHeadingCharRefs}
                className="inline-block text-primary"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </div>

        <p
          ref={descriptionRef}
          className="text-center font-normal text-sm sm:text-base md:text-lg leading-6 sm:leading-7 text-gray-700 dark:text-gray-300 w-[300px] max-w-[466px] text-wrap sm:w-full "
        >
          Streamline your golf experience with Splash Golf Club&apos;s intuitive
          online booking platform. Enjoy real-time tee time availability, secure
          member access, and a hassle-free reservation process that lets you
          focus solely on your game.
        </p>

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
      </section>

      {/* Weather Section */}
      <section
        ref={weatherWidgetRef as React.RefObject<HTMLElement>}
        className="mt-8 sm:mt-10 w-full max-w-md flex items-center justify-center"
      >
        <WeatherWidget />
      </section>

      {/* Next Week's Weather Forecast Section */}
      <section
        ref={forecastSectionRef as React.RefObject<HTMLElement>}
        className="text-center w-full max-w-4xl mx-auto mt-8 sm:mt-10 px-4"
      >
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
        <p
          ref={forecastDescRef}
          className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2 sm:mt-3 w-[300px] mx-auto sm:w-full"
        >
          Stay updated with the weather forecast for the next week. Our detailed
          weather reports help you plan your next round of golf at Splash Golf
          Club.
        </p>
        <div className="mt-4 sm:mt-6 overflow-x-auto  pb-4">
          {/* Scrollable container for small screens */}
          <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-3 pt-4 w-[300px] sm:w-full">
            {/* Day cards */}
            {weekForecast.map((day, index) => (
              <div
                key={day.day}
                ref={addToDayCardRefs}
                className={`
                  bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 
                  rounded-lg shadow-md dark:shadow-gray-900/30
                  p-3 sm:p-4 min-w-[40px] w-[102px] sm:w-24 flex-shrink-0 
                  transition-all duration-300
                  cursor-pointer
                  ${index === 0 ? "border-l-green-500 border-l-4" : ""}
                `}
              >
                <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {day.day}
                </p>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  {day.temp}°C
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
