/* eslint-env node */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    {
      // Safelist dynamic classes for status and due-date colors
      safelist: [
        // Status badge colors
        "bg-yellow-100", "text-yellow-800",
        "bg-green-100", "text-green-800",
        "bg-gray-100", "text-gray-800",

        // Due date colors
        "text-red-600", "text-orange-600", "text-green-600",
        "font-semibold", "font-medium"
      ],
    }
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.5rem',
      },
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
