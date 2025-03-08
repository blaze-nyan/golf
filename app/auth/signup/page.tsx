// app/auth/signup/page.tsx
"use client";
import React, { useState } from "react";
//components
import SignupForm from "../components/SignupForm";
import VerifyOtpForm from "../components/VerifyOtpForm";

const SignupPage = () => {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    surname: "",
  });

  const handleProceedToVerification = (formData: typeof userData) => {
    setUserData(formData);
    setStep("verify");
  };

  const handleVerificationComplete = () => {
    // This will be called after successful verification and account creation
    // You might want to redirect to login or show a success message
    window.location.href = "/auth/login";
  };

  return (
    <div>
      {step === "signup" ? (
        <SignupForm onProceedToVerification={handleProceedToVerification} />
      ) : (
        <VerifyOtpForm
          email={userData.email}
          userData={userData}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
    </div>
  );
};

export default SignupPage;
