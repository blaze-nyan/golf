// app/auth/signup/page.tsx
"use client";
import React, { useState } from "react";
//components
import SignupForm from "../components/SignupForm";
import VerifyEmailForm from "../components/VerifyEmailForm";

const SignupPage = () => {
  const [step, setStep] = useState<"verify" | "signup">("signup");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handleVerificationComplete = (email: string) => {
    setVerifiedEmail(email);
    setStep("signup");
  };

  return (
    <div>
      {step === "verify" ? (
        <VerifyEmailForm onVerificationComplete={handleVerificationComplete} />
      ) : (
        <SignupForm verifiedEmail={verifiedEmail} />
      )}
    </div>
  );
};

export default SignupPage;
