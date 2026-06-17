/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#1b2e22',
        'forest-green-dark': '#122017',
        'bronze': {
          '50': '#FAF6F0',
          '100': '#F3ECE6',
          '200': '#EBE3DE',
          '500': '#8D5A2B',
          '600': '#744A21',
          '700': '#5c3817',
        },
        'cream': {
          '50': '#fbfaf7',
          '100': '#faf8f5',
          '200': '#f7f4ef',
          '300': '#ede9e2',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

