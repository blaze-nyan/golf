import React from "react";
// import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { WeatherWidget } from "./weather/weather-widget";
import Link from "next/link";
import { Button } from "@heroui/button";
const Hero = () => {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center overflow-hidden px-4 sm:px-8 py-6 sm:py-10">
      <section className="z-20 flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-3xl">
        <div className="text-center text-xl sm:text-3xl md:text-4xl leading-[1.2] tracking-tighter">
          <div className="bg-hero-section-title bg-clip-text">
            Always Ready <br className="sm:hidden" /> Just Like Your Best Swing
          </div>
        </div>
        <p className="text-center font-normal text-sm sm:text-base md:text-lg leading-6 sm:leading-7 text-default-500 w-full max-w-[466px]">
          Streamline your golf experience with Splash Golf Club&apos;s intuitive
          online booking platform. Enjoy real-time tee time availability, secure
          member access, and a hassle-free reservation process that lets you
          focus solely on your game.
        </p>
        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
          <Button
            className="h-10 w-full sm:w-[163px] px-[16px] py-[10px] text-small font-medium leading-5 text-background"
            radius="full"
          >
            Get Started
          </Button>
          <Button
            className="h-10 w-full sm:w-[163px] border-1 border-default-100 px-[16px] py-[10px] text-small font-medium leading-5"
            endContent={
              <span className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-default-100">
                <Icon
                  className="text-default-500 [&>path]:stroke-[1.5]"
                  icon="solar:arrow-right-linear"
                  width={16}
                />
              </span>
            }
            radius="full"
            variant="bordered"
          >
            Golf Courses
          </Button>
        </div> */}
        {/* Footer CTA Section */}
        <Button
          as={Link}
          href="/golfcourse"
          color="primary"
          endContent={
            <span className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full ">
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
        {/* <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied golfers who have elevated their game
            with our service.
          </p>
          <Button as={Link} href="/golfcourse" color="primary">
            Book a Tee Time
          </Button>
        </div> */}
      </section>

      {/* <Button
        className="mt-8 sm:mt-10"
        endContent={
          <Icon
            className="flex-none outline-none [&>path]:stroke-[2]"
            icon="solar:arrow-right-linear"
            width={20}
          />
        }
        radius="full"
        variant="bordered"
        color="primary"
      >
        Get the app
      </Button> */}

      {/* Weather Section */}
      <section className="mt-8 sm:mt-10 w-full max-w-md">
        <WeatherWidget />
      </section>

      {/* Next Week's Weather Forecast Section */}
      <section className="text-center w-full max-w-4xl mx-auto mt-8 sm:mt-10 px-4">
        <h2 className="text-xl sm:text-2xl font-semibold ">
          Plan Your Week Ahead on the Course
        </h2>
        <p className="text-base sm:text-lg  mt-2 sm:mt-3">
          Stay updated with the weather forecast for the next week. Our detailed
          weather reports help you plan your next round of golf at Splash Golf
          Club.
        </p>
        <div className="mt-4 sm:mt-6 overflow-x-auto pb-4">
          {/* Scrollable container for small screens */}
          <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-3 min-w-10 ">
            {/* Day cards */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 sm:p-4 min-w-[80px] sm:w-24 flex-shrink-0 transition-colors duration-200"
              >
                <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {day}
                </p>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  {Math.floor(18 + Math.random() * 7)}°C
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {
                    ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][
                      Math.floor(Math.random() * 4)
                    ]
                  }
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
