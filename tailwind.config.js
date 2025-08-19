/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.5rem',
      },
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)', // make sure this exists
        input: 'hsl(var(--input) / <alpha-value>)',
        // add other tokens if needed
      },
    },
  },
  plugins: [],
}
