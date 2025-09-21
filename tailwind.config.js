/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'xrp-blue': '#2563eb',
        'xrp-purple': '#9333ea',
        'wallet-bg': '#f9fafb',
        'card-shadow': 'rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'system': ['System'],
      },
    },
  },
  plugins: [],
}