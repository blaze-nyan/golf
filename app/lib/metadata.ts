import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Membership",
    description: "Join our membership program today!",
  };
}
