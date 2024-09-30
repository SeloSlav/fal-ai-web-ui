/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'], // Custom serif font for styling
      },
      colors: {
        silver: '#C0C0C0',  // Custom color
        grey: '#808080',
      },
    },
  },
  plugins: [],
}
