"use client";

import Faq from "./components/faq";
import Hero from "./components/hero";
import CardReview from "@/app/components/card-review";

export default function Home() {
  return (
    <div className="relative flex w-full flex-col justify-center items-center bg-background pb-10 overflow-auto">
      {/* Hero Section */}
      <Hero />

      {/* FAQ Section */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
        <Faq />
      </div>

      {/* Reviews Section */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Multiple review cards for a nicer layout */}
          <CardReview
            content="Arcu dui vivamus arcu felis bibendum. Amet tellus cras adipiscing enim eu turpis egestas pretium."
            createdAt="2021-08-01T12:00:00.000Z"
            rating={5}
            title="Great product"
            user={{
              name: "John Doe",
              avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
            }}
          />
          <CardReview
            content="Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus molestie nunc."
            createdAt="2021-09-15T14:30:00.000Z"
            rating={4}
            title="Very helpful service"
            user={{
              name: "Jane Smith",
              avatar: "https://i.pravatar.cc/150?u=a04258114e29026702c",
            }}
          />
          <CardReview
            content="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            createdAt="2021-10-22T09:15:00.000Z"
            rating={5}
            title="Excellent experience"
            user={{
              name: "Alex Johnson",
              avatar: "https://i.pravatar.cc/150?u=a04258114e29026703c",
            }}
          />
        </div>
      </div>
    </div>
  );
}
