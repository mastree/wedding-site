/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-small": {
          "0%, 100%": {
            transform: "translateY(-5%)",
            "animation-timing-function": "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(5%)",
            "animation-timing-function": "cubic-bezier(0,0,0.2,1)",
          },
        },
        "go-from-left": {
          from: {
            transform: "translateX(-50%)",
            opacity: 0,
          },
          to: {
            transform: "translateX(0%)",
            opacity: 1,
          },
        },
        "go-from-right": {
          from: {
            transform: "translateX(50%)",
            opacity: 0,
          },
          to: {
            transform: "translateX(0%)",
            opacity: 1,
          },
        },
      },
      animation: {
        "bounce-small": "bounce-small 1s infinite",
        "go-from-left": "go-from-left 0.6s",
        "go-from-right": "go-from-right 0.6s",
      },
      colors: {
        primary: "#0D271A",
        "light-primary": "#2D473A",
        secondary: "#AC8E5D",
        "dark-secondary": "#342C20",
        "dark-item": "#474747",
        "bg-skin": "#C3B8AF",
        shadow: "#E8E8E8",
        "bg-grey": "#D9D9D9",
      },
    },
    fontFamily: {
      manuale: ["manuale", "sans-serif"],
      "marcellus-sc": ["Marcellus SC", "serif"],
      "major-mono-display": ["Major Mono Display", "monospace"],
      lato: ["Lato", "sans-serif"],
    },
  },
  plugins: [],
};
