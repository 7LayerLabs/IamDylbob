/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        eva: {
          green: '#2C6E49',
          greenLight: '#A4C3A2',
          terracotta: '#D88C64',
          beige: '#F7F1E3',
          ink: '#2A2A2A',
        },
      },
      fontFamily: {
        headline: ['Quicksand', 'sans-serif'],
        body: ['Merriweather Sans', 'sans-serif'],
        data: ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}