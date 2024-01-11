import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        default: ["var(--font-default)", ...defaultTheme.fontFamily.sans],
        heading: ["var(--font-header)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0px" },
        },
        "overlay-show": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "content-show": {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "overlay-show": "overlay-show 220ms cubic-bezier(0.16, 1, 0.3, 1)",
        "content-show": "content-show 220ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      colors: {
        red: {
          DEFAULT: "#D5491F",
          50: "#F5C5B7",
          100: "#F2B7A5",
          200: "#ED9A82",
          300: "#E87E5E",
          400: "#E2613A",
          500: "#D5491F",
          600: "#A43818",
          700: "#732711",
          800: "#42170A",
          900: "#110602",
          950: "#000000",
        },
        orange: {
          DEFAULT: "#DA8D0F",
          50: "#F9DAA8",
          100: "#F8D295",
          200: "#F5C26E",
          300: "#F2B248",
          400: "#F0A222",
          500: "#DA8D0F",
          600: "#A66B0B",
          700: "#714908",
          800: "#3D2704",
          900: "#080501",
          950: "#000000",
        },
        green: {
          DEFAULT: "#80A454",
          50: "#D9E4CB",
          100: "#CFDEBE",
          200: "#BBD0A3",
          300: "#A8C288",
          400: "#94B46D",
          500: "#80A454",
          600: "#637F41",
          700: "#465A2E",
          800: "#29351B",
          900: "#0C1008",
          950: "#000000",
        },
        blue: {
          DEFAULT: "#3286A8",
          50: "#ABD5E6",
          100: "#9CCDE1",
          200: "#7CBED8",
          300: "#5DAECF",
          400: "#3D9EC5",
          500: "#3286A8",
          600: "#25647D",
          700: "#184152",
          800: "#0B1F26",
          900: "#000000",
          950: "#000000",
        },
        slate: {
          DEFAULT: "#9DB7C1",
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#E8EEF0",
          300: "#CFDCE1",
          400: "#B6C9D1",
          500: "#9DB7C1",
          600: "#7B9EAB",
          700: "#5C8392",
          800: "#46646F",
          900: "#31454D",
          950: "#26363C",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};

export default config;
