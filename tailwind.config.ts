import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        light: {
          layout: {},
          colors: {
            primary: {
              DEFAULT: "#0E793C",
              50: "#E8FAF0",
              100: "#D1F4E0",
              200: "#A2E9C1",
              300: "#74DFA2",
              400: "#45D483",
              500: "#17C964",
              600: "#12A150",
              700: "#0E793C",
              800: "#095028",
              900: "#052814",
            },
            background: "var(--background)",
            foreground: "var(--foreground)",
          },
        },
      },
    }),
  ],
} satisfies Config;
