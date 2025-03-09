// components/ExpiryDateInput.tsx
import React, { useState } from "react";
import { Input, InputProps } from "@heroui/react";

interface ExpiryDateInputProps extends Omit<InputProps, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({
  value,
  onChange,

  ...props
}) => {
  const [focused, setFocused] = useState(false);

  // Format the raw input as MM/YY
  const formatExpiryDate = (input: string) => {
    // Remove any non-digit characters
    const digits = input.replace(/\D/g, "");

    // Limit to 4 digits maximum
    const trimmed = digits.substring(0, 4);

    // Format as MM/YY
    if (trimmed.length > 2) {
      return `${trimmed.substring(0, 2)}/${trimmed.substring(2)}`;
    } else {
      return trimmed;
    }
  };

  // Validate the expiry date
  //   const isValidExpiryDate = (formattedValue: string) => {
  //     // Check format
  //     if (!/^\d{2}\/\d{2}$/.test(formattedValue)) {
  //       return false;
  //     }

  //     const [monthStr, yearStr] = formattedValue.split("/");
  //     const month = parseInt(monthStr, 10);

  //     // Get current date
  //     const now = new Date();
  //     const currentYear = now.getFullYear() % 100; // Get last 2 digits of year
  //     const currentMonth = now.getMonth() + 1; // 1-12

  //     const year = parseInt(yearStr, 10);

  //     // Check if month is valid
  //     if (month < 1 || month > 12) {
  //       return false;
  //     }

  //     // Check if date is in the past
  //     if (year < currentYear || (year === currentYear && month < currentMonth)) {
  //       return false;
  //     }

  //     return true;
  //   };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatExpiryDate(rawValue);

    onChange(formattedValue);

    // If we have a full MM/YY format, check validity
  };

  // For display purposes, we want to show a placeholder when focused
  const getPlaceholder = () => {
    if (focused && value === "") {
      return "MM/YY";
    }
    return props.placeholder || "MM/YY";
  };

  return (
    <Input
      {...props}
      value={value}
      placeholder={getPlaceholder()}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        // Validate on blur as well
      }}
      maxLength={5}
      inputMode="numeric"
    />
  );
};

export default ExpiryDateInput;
