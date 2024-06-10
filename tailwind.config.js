/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D271A',
        secondary: '#AC8E5D',
        darkItem: '#474747',
        bgSkin: '#C3B8AF',
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

