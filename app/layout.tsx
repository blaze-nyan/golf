import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";

//components
import AdvancedTourButton from "./components/AdvancedTourButton";
import ClientNavBar from "./components/client-navbar"; // Use the client-side wrapper
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const storedTheme = localStorage.getItem('theme');
                const theme = storedTheme || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {
                console.error('Theme initialization failed:', e);
              }
            })();
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <ClientNavBar />
            {children}
            <ChatWidget />
            <AdvancedTourButton />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
