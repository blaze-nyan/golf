"use client";
// import { Spinner } from "@heroui/react";
import CustomLoading from "./components/custom-loading";

export default function App() {
  return (
    <div className="flex h-[90vh] items-center justify-center">
      {/* <Spinner size="lg" /> */}
      <CustomLoading />
    </div>
  );
}
