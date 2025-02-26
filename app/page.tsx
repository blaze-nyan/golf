"use client";
// import { Button } from "@heroui/button";
// import { Icon } from "@iconify/react";
// import Stepper from "./components/stepper";
// import ProductList from "./components/ProductList";
// import Review from "./components/Review";
import Hero from "./components/hero";
// import FadeInImage from "./components/fade-in-image";

export default function Home() {
  return (
    <div className="relative flex w-full flex-col justify-center items-center bg-background pb-10 overflow-auto">
      {/* Hero Section */}
      <Hero />

      {/* You can add other content here */}
      {/* <Button>Hello</Button> */}
      {/* <Stepper />
      <ProductList />
      <Review /> */}
    </div>
  );
}
