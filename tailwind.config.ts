import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
export default config;
