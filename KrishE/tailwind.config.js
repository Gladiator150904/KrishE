/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#16221C',
        white: {
          DEFAULT: '#FFFFFF',
          text: '#DDDDDD',
          borders: '#BEAA73',
          300: '#EFE3C2'
        },
        green: {
          100: '#50B22C',
          gradient_s: '#9AC100',
          gradient_e: '#357A00',
          button: '#70C651',
          bg: '#224031',
          form_border: '#3B4741',
          form_bg: '#262F2A'
        }
      },
      fontFamily: {
        'pthin': ['Poppins-Thin', 'sans-serif'],
        'plight': ['Poppins-Light', 'sans-serif'],
        'pregular': ['Poppins-Regular', 'sans-serif'],
        'pmedium': ['Poppins-Medium', 'sans-serif'],
        'pbold': ['Poppins-Bold', 'sans-serif'],
        'pextrabold': ['Poppins-ExtraBold', 'sans-serif'],
        'psemibold': ['Poppins-SemiBold', 'sans-serif'],
        'pblack': ['Poppins-Black', 'sans-serif'],
        'pextralight': ['Poppins-ExtraLight', 'sans-serif'],
      },
      boxShadow:{
        'dark': '0px 0px 10px rgba(0 0 0 / 1)'
      },
    },
  },
  plugins: [],
}

