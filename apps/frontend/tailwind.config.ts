/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",   // App Router使用時
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green01: '#3FB86B',
        green02: '#477A55',
        green03: '#D5FADD',
        gray01: '#DCDCDC',
        gray02: '#868282',
        orange: '#EA7A42',
        blule: "#298FE9",
        base: '#F5F5F5'

      }
    }, 
  },
  plugins: [

  ],
}