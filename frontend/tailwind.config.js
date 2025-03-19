module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🔵 Replacing purple shades with blue shades while keeping the same class names
        "russian-violet": "#0A192F", // Dark navy blue
        "russian-violet-2": "#112D4E", // Deep blue
        tekhelet: "#3A7CA5", // Muted blue
        "french-violet": "#4682B4", // Steel blue
        amethyst: "#5DADE2", // Lighter sky blue
        heliotrope: "#76C7F7", // Soft azure blue
        mauve: "#B0E0E6", // Pale blue
        white: "#ffffff",

        // Keep existing Tailwind color variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "#4682B4", // Steel Blue
          foreground: "#B0E0E6", // Pale Blue
        },
        secondary: {
          DEFAULT: "#3A7CA5", // Muted Blue
          foreground: "#76C7F7", // Soft Azure
        },
        accent: {
          DEFAULT: "#5DADE2", // Lighter Sky Blue
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#0A192F", // Dark Navy Blue
          foreground: "#B0E0E6", // Pale Blue
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
