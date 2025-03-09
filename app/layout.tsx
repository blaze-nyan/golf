import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

//components
// import NavBar from "./components/NavBar";
import AdvancedTourButton from "./components/AdvancedTourButton";
import NavBar from "./components/nav-bar";
import { ChatWidget } from "@/app/components/Chat/chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Splash Golf Club",
  description:
    "Experience world-class golfing at Splash Golf Club. Enjoy scenic courses, professional coaching, and exclusive membership benefits. Book your tee time today. Easily book tee times at top golf courses near you. Enjoy hassle-free online golf club reservations with the best rates. Golf Club Booking. Reserve your spot today!",
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" }, // Fallback for browsers that don't support WebP
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.webp" type="image/webp" />
      <link rel="icon" href="/favicon.ico" sizes="any" /> {/* Fallback */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NavBar />
          {children}
          <ChatWidget />
          <AdvancedTourButton />
        </Providers>
      </body>
    </html>
  );
}
