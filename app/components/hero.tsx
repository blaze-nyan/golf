import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { WeatherWidget } from "./weather/weather-widget";

const Hero = () => {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center  overflow-hidden px-8">
      <section className="z-20 flex flex-col items-center justify-center gap-[18px] sm:gap-6">

        <div className="text-center text-xl  leading-[1.2] tracking-tighter sm:text-[32px]">
          <div className="bg-hero-section-title bg-clip-text ">
            Easiest way to <br /> power global teams.
          </div>
        </div>
        <p className="text-center font-normal leading-7 text-default-500 sm:w-[466px] sm:text-[18px]">
          Acme makes running global teams simple. HR, Payroll, International
          Employment, contractor management and more.
        </p>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button
            className="h-10 w-[163px]  px-[16px] py-[10px] text-small font-medium leading-5 text-background"
            radius="full"
          >
            Get Started
          </Button>
          <Button
            className="h-10 w-[163px] border-1 border-default-100 px-[16px] py-[10px] text-small font-medium leading-5"
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
        </div>
      </section>

      <Button
          className="mt-4"
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
        </Button>

      {/* Weather Section */}
      <section className="mt-10">
        <WeatherWidget />
      </section>

      {/* Next Week’s Weather Forecast Section */}
      <section className="text-center max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Plan Your Week Ahead on the Course
        </h2>
        <p className="text-lg text-gray-600 mt-3">
          Stay updated with the weather forecast for the next week. Our detailed weather reports help you plan your next round of golf at [Golf Club Name].
        </p>
        <div className="mt-6">
          {/* Placeholder for forecast for the next 7 days */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Example of a day’s weather card, repeat for the next 7 days */}
            <div className="bg-white border rounded-lg shadow-lg p-4 w-24">
              <p className="text-xl font-semibold">Mon</p>
              <p className="text-lg">22°C</p>
              <p className="text-sm text-gray-500">Sunny</p>
            </div>
            <div className="bg-white border rounded-lg shadow-lg p-4 w-24">
              <p className="text-xl font-semibold">Tue</p>
              <p className="text-lg">20°C</p>
              <p className="text-sm text-gray-500">Partly Cloudy</p>
            </div>
            {/* Repeat this block for other days of the week */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
