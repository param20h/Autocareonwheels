/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1C1C1C", // Carbon Black
        accent: "#C0392B",  // Race Red
        silver: "#C8C8C8",  // Chrome Silver
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
