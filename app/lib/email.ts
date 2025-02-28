// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string,
  baseUrl: string
) => {
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
          <p>
            <a 
              href="${verificationUrl}" 
              style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
            >
              Verify Email
            </a>
          </p>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email with Resend:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};
