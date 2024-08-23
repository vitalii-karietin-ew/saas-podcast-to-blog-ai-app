import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#E5E7EB',
          100: '#D1D5DB',
          200: '#9CA3AF',
          300: '#6B7280',
          400: '#4B5563',
          500: '#374151',
          600: '#1F2937',
          700: '#111827',
          800: '#0F172A',
          900: '#0A0E1A',
        },
        primary: {
          50: '#E3F2F9',
          100: '#C5E4F3',
          200: '#A2D4EC',
          300: '#7AC1E4',
          400: '#47A9DA',
          500: '#0088CC',
          600: '#007AB8',
          700: '#006BA1',
          800: '#005885',
          900: '#003F5E',
        },
        secondary: {
          50: '#F3E8FF',
          100: '#E9D5FF',
          200: '#D4BBFF',
          300: '#BB8EFF',
          400: '#A366FF',
          500: '#7F3DFF',
          600: '#6B2BCC',
          700: '#5A23A3',
          800: '#491A7A',
          900: '#3A135C',
        },
        white: '#FFFFFF',
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        green: {
          500: '#10B981',
          600: '#059669',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
