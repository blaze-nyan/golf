"use client";
// import { Button } from "@heroui/button";
// import { Icon } from "@iconify/react";
// import Stepper from "./components/stepper";
// import ProductList from "./components/ProductList";
// import Review from "./components/Review";
import Hero from "./components/hero";
import { WeatherWidget } from "@/app/components/weather/weather-widget";
// import FadeInImage from "./components/fade-in-image";
export default function Home() {
  return (
    <div className="relative flex h-dvh w-full flex-col justify-center items-center  bg-background pb-10">
      <Hero />

      {/* <Button>Hello</Button> */}
      {/* <Stepper />
      <ProductList />
      <Review /> */}
      <WeatherWidget />
    </div>
  );
}
