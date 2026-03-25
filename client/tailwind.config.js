/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A3557", // Dark navy blue
        accent: "#2563A8",  // Medium blue
        background: "#F5F7FA", // Light gray
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        input: '4px'
      }
    },
  },
  plugins: [],
}
