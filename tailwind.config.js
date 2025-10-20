/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables class-based dark mode
  content: [
    './src/**/*.{html,js,svelte,ts}', // scan your project files
  ],
  theme: {
    extend: {
      fontFamily: {
        lex: ['"Lexend"', 'sans-serif'], // your custom font
      },
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
