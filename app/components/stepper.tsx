import React from "react";

import RowSteps from "./row-steps";

export default function Stepper() {
  return (
    <RowSteps
      defaultStep={2}
      steps={[
        {
          title: "Course",
        },
        {
          title: "Time",
        },
        {
          title: "Hole",
        },
        {
          title: "Other Services",
        },
        {
          title: "Review",
        },
        {
          title: "Booking",
        },
        {
          title: "Done",
        },
      ]}
    />
  );
}
