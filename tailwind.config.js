/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#605DC8',
        secondary: '#8B89E6',
        accent: '#e8e7fa',
        shadow: '#E8E8E8',
      }
    },
    fontFamily: {
      'manuale': ['manuale', 'sans-serif'],
      'marcellus-sc': ['Marcellus SC', 'serif'],
      'major-mono-display': ['Major Mono Display', 'monospace']
    },
  },
  plugins: [],
}

