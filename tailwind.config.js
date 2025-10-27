/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '360px',   // Small Android
      'sm': '390px',   // iPhone 12/13
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Desktop/tablet landscape
      'xl': '1280px',  // Large desktop
    },
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
