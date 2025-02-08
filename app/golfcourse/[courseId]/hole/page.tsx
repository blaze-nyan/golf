"use client";
import React from "react";
//components
import { DatePicker } from "@heroui/react";
import { NextButton } from "@/app/golfcourse/components/NextButton";
const page = () => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <DatePicker isRequired className="max-w-[284px]" label="Tee Time" />
      <NextButton />
    </div>
  );
};

export default page;
